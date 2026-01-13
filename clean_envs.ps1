
$file = ".env.prod.inspect.local"
if (Test-Path $file) {
    $content = Get-Content $file
    foreach ($line in $content) {
        if ($line -match "^(NEXT_PUBLIC_FIREBASE|FIREBASE)[\w_]*=(.*)$") {
            $key = $matches[1]
            $val = $matches[2].Trim()
            Write-Host "Cleaning and Syncing $key..."
            # Remove existing production env var
            & vercel env rm $key production -y
            # Re-add with cleaned value
            echo $val | & vercel env add $key production
        }
    }
} else {
    Write-Host "File not found!"
}
