
$envs = @{
    "NEXT_PUBLIC_FIREBASE_API_KEY" = "AIzaSyDqC65DHb7cSHc-8E0enHFnmvk0oyeVCpI"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" = "primeengine-in.firebaseapp.com"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID" = "primeengine-in"
    "NEXT_PUBLIC_FIREBASE_APP_ID" = "1:633902583220:web:828829367ce41bae8c76e1"
    "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID" = "G-6QS337J4FV"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" = "633902583220"
    "FIREBASE_PROJECT_ID" = "primeengine-in"
}

foreach ($key in $envs.Keys) {
    $val = $envs[$key]
    Write-Host "Updating $key..."
    # Suppress output and handle removal/addition
    & vercel env rm $key production -y | Out-Null
    echo $val | & vercel env add $key production
}
