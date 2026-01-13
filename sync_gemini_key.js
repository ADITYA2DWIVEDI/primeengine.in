
const fs = require('fs');
const { execSync } = require('child_process');

try {
    const content = fs.readFileSync('.env', 'utf8');
    const match = content.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);

    if (match && match[1]) {
        const apiKey = match[1].trim();
        console.log("Found Gemini API Key, length:", apiKey.length);

        console.log("Syncing GOOGLE_GENERATIVE_AI_API_KEY to Vercel Production...");
        execSync(`echo ${apiKey} | vercel env add GOOGLE_GENERATIVE_AI_API_KEY production --force`, { stdio: 'inherit' });

        console.log("Success!");
    } else {
        console.error("Could not find GOOGLE_GENERATIVE_AI_API_KEY in .env");
    }
} catch (e) {
    console.error("Error:", e);
}
