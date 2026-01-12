$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*#") { return }
        if ([string]::IsNullOrWhiteSpace($_)) { return }
        
        $parts = $_ -split "=", 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim().Trim('"').Trim("'")
            
            # Skip AUTH_SECRET as we set it manually
            # Skip NEXTAUTH_URL and AUTH_TRUST_HOST as we set them manually
            if ($key -notin @("AUTH_SECRET", "NEXTAUTH_URL", "AUTH_TRUST_HOST")) {
                Write-Host "Adding $key..."
                try {
                    $value | vercel env add $key production
                } catch {
                    Write-Host "Failed to add $key"
                }
            }
        }
    }
} else {
    Write-Host ".env file not found!"
}
