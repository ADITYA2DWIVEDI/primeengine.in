
const fs = require('fs');
const { execSync } = require('child_process');

try {
    const content = fs.readFileSync('.env', 'utf8');
    const match = content.match(/(\d+-[a-zA-Z0-9-_]+\.apps\.googleusercontent\.com)/);

    if (match && match[1]) {
        const cleanID = match[1];
        console.log("Found Clean ID:", cleanID);

        // Construct command to pipe the ID to vercel
        // Using execSync with input option is safer than shell piping sometimes, but simple pipe works here.
        // We use 'echo' and pipe to vercel env add

        console.log("Setting AUTH_GOOGLE_ID in Vercel Production...");
        execSync(`echo ${cleanID} | vercel env add AUTH_GOOGLE_ID production --force`, { stdio: 'inherit' });

        console.log("Success! Vercel env updated.");
    } else {
        console.error("Could not find a valid Google Client ID pattern in .env");
        process.exit(1);
    }
} catch (e) {
    console.error("Error:", e);
    process.exit(1);
}
