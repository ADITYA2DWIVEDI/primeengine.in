
$envs = @{
    "NEXTAUTH_URL" = "https://www.primeengine.in"
    "NEXT_PUBLIC_APP_URL" = "https://www.primeengine.in"
}

foreach ($key in $envs.Keys) {
    $val = $envs[$key]
    Write-Host "Updating $key..."
    & vercel env rm $key production -y 2>$null | Out-Null
    $tempFile = "temp_env_val.txt"
    [System.IO.File]::WriteAllText((Join-Path (Get-Location) $tempFile), $val)
    Get-Content $tempFile -Raw | & vercel env add $key production
    Remove-Item $tempFile
}
