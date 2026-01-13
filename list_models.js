
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env' });

async function listModels() {
    try {
        let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            const envConfig = fs.readFileSync('.env', 'utf8');
            const match = envConfig.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
            if (match) apiKey = match[1].trim();
        }

        if (!apiKey) {
            console.error("❌ No API Key found");
            return;
        }

        console.log(`🔑 Testing with API Key: ${apiKey.substring(0, 10)}...`);

        // Use raw fetch to list models to confirm connectivity independent of SDK quirks
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            console.error(`❌ Fetch failed: ${response.status} ${response.statusText}`);
            console.log(await response.text());
            return;
        }

        const data = await response.json();
        const modelNames = data.models ? data.models.map(m => m.name).join('\n') : "No models found";
        fs.writeFileSync('models_list.txt', modelNames);
        console.log("✅ Models written to models_list.txt");

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

listModels();
