$ErrorActionPreference = 'Stop'
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  Get-ChildItem (Join-Path $dir 'html') -Filter *.html | ForEach-Object {
    $doc = $word.Documents.Open($_.FullName, $false, $true)
    $base = Join-Path $dir ('files\' + $_.BaseName)
    $doc.SaveAs2($base + '.word.docx', 16)
    $doc.SaveAs2($base + '.word.pdf', 17)
    $doc.Close(0)
  }
} finally { $word.Quit(); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
Write-Output 'word done'
