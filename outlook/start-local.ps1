# Development-only static HTTPS server. Uses the existing Office localhost certificate.
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path $PSScriptRoot -Parent)
try {
    & npm run dev
    if ($LASTEXITCODE -ne 0) { throw 'The development server stopped with an error.' }
} finally { Pop-Location }
