$envFile = ".env"
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $googleIdLine = $content | Select-String "AUTH_GOOGLE_ID"
    $googleSecretLine = $content | Select-String "AUTH_GOOGLE_SECRET"

    if ($googleIdLine) {
        $id = $googleIdLine.ToString().Split("=")[1].Trim().Trim('"').Trim("'")
        Write-Host "Found Google ID: $id"
        $id | vercel env add AUTH_GOOGLE_ID production
        $id | vercel env add AUTH_GOOGLE_ID development
    }

    if ($googleSecretLine) {
        $secret = $googleSecretLine.ToString().Split("=")[1].Trim().Trim('"').Trim("'")
        Write-Host "Found Google Secret: $secret"
        $secret | vercel env add AUTH_GOOGLE_SECRET production
        $secret | vercel env add AUTH_GOOGLE_SECRET development
    }
} else {
    Write-Host ".env not found"
}
