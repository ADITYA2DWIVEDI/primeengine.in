
$envPath = ".env"
if (Test-Path $envPath) {
    $lines = Get-Content $envPath
    $idLine = $lines | Where-Object { $_ -match "^AUTH_GOOGLE_ID=" }
    $secretLine = $lines | Where-Object { $_ -match "^AUTH_GOOGLE_SECRET=" }

    if ($idLine) {
        $idRaw = $idLine -replace "^AUTH_GOOGLE_ID=", ""
        # Remove quotes and whitespace
        $idClean = $idRaw.Trim().Trim('"').Trim("'")
        
        # Check for duplicate suffix pattern (common copy paste error)
        if ($idClean -match "(apps\.googleusercontent\.com)+") {
            # Extract the first valid ID part
            if ($idClean -match "([0-9]+-[a-z0-9-_]+\.apps\.googleusercontent\.com)") {
                $idClean = $matches[1]
                Write-Host "Detected mess in ID, cleaned to: $idClean"
            }
        }

        Write-Host "Syncing AUTH_GOOGLE_ID: $idClean"
        echo $idClean | vercel env add AUTH_GOOGLE_ID production --force
    }

    if ($secretLine) {
        $secretRaw = $secretLine -replace "^AUTH_GOOGLE_SECRET=", ""
        $secretClean = $secretRaw.Trim().Trim('"').Trim("'")
        Write-Host "Syncing AUTH_GOOGLE_SECRET: [HIDDEN]"
        echo $secretClean | vercel env add AUTH_GOOGLE_SECRET production --force
    }
} else {
    Write-Error ".env file not found"
}
