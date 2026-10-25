"""Download pinned public data as bytes. Never open documents in an application.
Standard library only. ZIP extraction is selective, bounded, and rejects path traversal.
"""
import argparse
import hashlib
import json
import pathlib
import urllib.request
import zipfile

BASE = 'https://digitalcorpora.s3.amazonaws.com/corpora/files/govdocs1/'
KINDS = {'pdf', 'docx', 'xlsx', 'pptx', 'csv', 'txt', 'doc', 'xls', 'ppt', 'rtf'}


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda: f.read(1024 * 1024), b''):
            h.update(block)
    return h.hexdigest()


def download(url, target):
    if not target.exists():
        part = target.with_suffix(target.suffix + '.partial')
        with urllib.request.urlopen(url, timeout=120) as response, part.open('wb') as out:
            while chunk := response.read(1024 * 1024):
                out.write(chunk)
        part.replace(target)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('destination')
    p.add_argument('--manifest', default='evaluation/robustness/govdocs-manifest.json')
    p.add_argument('--discover', action='store_true', help='maintainer only: create pins from the fixed sampling policy')
    args = p.parse_args()
    root = pathlib.Path(args.destination).resolve()
    repo = pathlib.Path(__file__).resolve().parent.parent
    if root == repo or repo in root.parents:
        raise ValueError('Downloads must be outside the repository')
    root.mkdir(parents=True, exist_ok=True)
    archives_dir = root / 'archives'
    archives_dir.mkdir(exist_ok=True)
    manifest_path = pathlib.Path(args.manifest)
    if args.discover:
        sources = ['threads/thread%d.zip' % n for n in range(4)] + ['by_type/%s.zip' % k for k in ('docx', 'xlsx', 'pptx', 'rtf')]
        manifest = {'source': 'GovDocs1 (2009 web harvest)', 'homepage': 'https://digitalcorpora.org/corpora/file-corpora/files/',
                    'selection': 'All target extensions in threads 0-3, plus first 20 lexicographic members of each by_type docx/xlsx/pptx/rtf archive; exclude members above 64 MiB; deduplicate by original member name.',
                    'archives': [], 'files': [], 'excluded': [], 'failures': []}
    else:
        manifest = json.loads(manifest_path.read_text(encoding='utf-8-sig'))
        sources = [a['key'] for a in manifest['archives']]
    seen = set()
    for key in sources:
        url = BASE + key
        archive_path = archives_dir / key.replace('/', '-')
        print('Downloading/verifying ' + key, flush=True)
        download(url, archive_path)
        archive_hash = digest(archive_path)
        if args.discover:
            manifest['archives'].append({'key': key, 'url': url, 'sha256': archive_hash, 'bytes': archive_path.stat().st_size})
        else:
            pin = next(a for a in manifest['archives'] if a['key'] == key)
            if archive_hash != pin['sha256'] or archive_path.stat().st_size != pin['bytes']:
                raise ValueError('Archive hash mismatch: ' + key)
        with zipfile.ZipFile(archive_path) as z:
            infos = sorted((i for i in z.infolist() if not i.is_dir() and pathlib.PurePosixPath(i.filename).suffix[1:].lower() in KINDS), key=lambda i: i.filename)
            if args.discover and key.startswith('by_type/'):
                infos = infos[:20]
            if not args.discover:
                wanted = {f['member'] for f in manifest['files'] if f['archive'] == key}
                infos = [i for i in infos if i.filename in wanted]
                if len(infos) != len(wanted):
                    raise ValueError('Missing pinned archive member')
            for info in infos:
                member = pathlib.PurePosixPath(info.filename)
                if member.is_absolute() or '..' in member.parts or '\\' in info.filename or ':' in info.filename:
                    raise ValueError('Unsafe archive path')
                if info.filename in seen:
                    continue
                seen.add(info.filename)
                if info.file_size > 64 * 1024 * 1024:
                    if not args.discover:
                        raise ValueError('Pinned member exceeds extraction bound')
                    manifest['excluded'].append({'archive': key, 'member': info.filename, 'bytes': info.file_size, 'reason': 'download_size_bound'})
                    continue
                relative = 'files/' + info.filename
                target = root / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                h = hashlib.sha256()
                count = 0
                with z.open(info) as src, target.open('wb') as out:
                    while chunk := src.read(1024 * 1024):
                        count += len(chunk)
                        if count > 64 * 1024 * 1024:
                            raise ValueError('Expansion bound')
                        h.update(chunk)
                        out.write(chunk)
                receipt = {'path': relative, 'archive': key, 'member': info.filename, 'bytes': count, 'sha256': h.hexdigest()}
                if args.discover:
                    manifest['files'].append(receipt)
                elif receipt != next(f for f in manifest['files'] if f['path'] == relative):
                    raise ValueError('File hash mismatch: ' + relative)
        if args.discover:
            manifest_path.parent.mkdir(parents=True, exist_ok=True)
            manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    (root / 'DOWNLOAD.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'files': len(manifest['files']), 'counts': {k: sum(f['path'].endswith('.' + k) for f in manifest['files']) for k in sorted(KINDS)}}))


if __name__ == '__main__':
    main()
