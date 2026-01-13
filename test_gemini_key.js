
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config({ path: '.env' });

async function testGemini() {
    try {
        // Try to get key from .env file directly if process.env fails, just to be sure
        let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            console.log("Reading .env manually...");
            const envConfig = fs.readFileSync('.env', 'utf8');
            const match = envConfig.match(/GOOGLE_GENERATIVE_AI_API_KEY=(.+)/);
            if (match) {
                apiKey = match[1].trim();
            }
        }

        if (!apiKey) {
            console.error("❌ No API Key found in environment or .env file");
            return;
        }

        console.log(`🔑 Testing with API Key: ${apiKey.substring(0, 10)}...`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        console.log("🤖 Sending prompt to Gemini...");
        const result = await model.generateContent("Explain React in one sentence.");
        const response = await result.response;
        const text = response.text();

        console.log("✅ Success! Response:");
        console.log(text);
    } catch (error) {
        console.error("❌ Error:");
        console.error(error);
    }
}

testGemini();
