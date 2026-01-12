import { prisma } from "./db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export type GenerationState = "schema" | "components" | "pages" | "completed";

export async function orchestrateGeneration(projectId: string, prompt: string) {
    try {
        // Step 1: Generate Entities/Schema
        const entities = await generateSchema(prompt);
        for (const entity of entities) {
            await prisma.entity.create({
                data: {
                    name: entity.name,
                    schema: entity.fields,
                    projectId
                }
            });
        }

        // Step 2: Generate Components
        const components = await generateComponents(prompt, entities);
        for (const comp of components) {
            await prisma.component.create({
                data: {
                    name: comp.name,
                    code: comp.code,
                    projectId
                }
            });
        }

        // Step 3: Generate Pages
        const pages = await generatePages(prompt, entities, components);
        for (const page of pages) {
            await prisma.page.create({
                data: {
                    name: page.name,
                    route: page.route,
                    code: page.code,
                    projectId
                }
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Orchestration error:", error);
        throw error;
    }
}

async function generateSchema(prompt: string) {
    const aiPrompt = `
        You are an expert database architect. Given the following user prompt for a web application, generate a database schema in JSON format.
        User Prompt: "${prompt}"

        Output format:
        [
            { "name": "EntityName", "fields": { "fieldName": "type", ... } },
            ...
        ]
        Types should be: String, Int, Boolean, DateTime, Json.

        Return ONLY the JSON.
    `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}

async function generateComponents(prompt: string, entities: any[]) {
    const aiPrompt = `
        You are an expert React developer. Given the following user prompt and schema, generate 2-3 essential UI components using Tailwind CSS.
        User Prompt: "${prompt}"
        Schema: ${JSON.stringify(entities)}

        Output format:
        [
            { "name": "ComponentName", "code": "full source code string" },
            ...
        ]

        Return ONLY the JSON. Use standard lucide-react icons if needed.
    `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}

async function generatePages(prompt: string, entities: any[], components: any[]) {
    const aiPrompt = `
        You are an expert Next.js developer. Given the following user prompt, schema, and components, generate 1 main page (e.g., Dashboard or Home).
        User Prompt: "${prompt}"
        Schema: ${JSON.stringify(entities)}
        Components: ${JSON.stringify(components)}

        Output format:
        [
            { "name": "Dashboard", "route": "/dashboard", "code": "full source code string" }
        ]

        Return ONLY the JSON. Ensure the code is production-quality React.
    `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}
