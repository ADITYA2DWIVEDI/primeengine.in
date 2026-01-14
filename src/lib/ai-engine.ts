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

export async function iterateUpdate(projectId: string, userMessage: string, activeFile?: any) {
    try {
        // 1. Fetch current project state
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: {
                entities: true,
                components: true,
                pages: true,
                messages: { orderBy: { createdAt: 'asc' } }
            }
        });

        if (!project) throw new Error("Project not found");

        // 2. Save user message to history
        await prisma.chatMessage.create({
            data: { role: "user", content: userMessage, projectId }
        });

        // 3. Prepare AI Prompt for iteration
        const historyContext = project.messages.slice(-5).map((m: any) => `${m.role}: ${m.content}`).join("\n");
        const activeFileContext = activeFile ? `\nACTIVE FILE CONTENT: \nFile: ${activeFile.name}\nCode: ${activeFile.code}\n` : "";

        const aiPrompt = `
            You are "Prime Engine", a powerful agentic AI web builder. 
            User Request: "${userMessage}"
            
            ${activeFileContext}

            Project Architecture Overview:
            Entities: ${JSON.stringify(project.entities)}
            Components: ${project.components.map(c => c.name).join(", ")}
            Pages: ${project.pages.map(p => p.name).join(", ")}

            Recent Chat History:
            ${historyContext}

            TASKS:
            1. Analyze the request and determine which files need updating or creation.
            2. Generate the necessary code updates.
            3. Provide a helpful, technical, yet friendly summary of what you've done (in the "message" field). 

            CAPABILITIES:
            - You can create backend API routes by creating a "page" with a route starting with "/api/".
            - Example: { "type": "page", "name": "users_api", "route": "/api/users", "code": "export async function GET()..." }

            OUTPUT FORMAT (JSON):
            {
                "message": "A brief summary of what I did...",
                "actions": [
                    { "type": "page", "name": "...", "route": "...", "code": "..." },
                    { "type": "component", "name": "...", "code": "..." }
                ]
            }

            Be precise. Use Tailwind CSS and lucide-react. Return ONLY JSON.
        `;

        const result = await model.generateContent(aiPrompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const { message, actions } = JSON.parse(cleanJson);

        // 4. Apply updates
        for (const update of actions) {
            if (update.type === "page") {
                await prisma.page.upsert({
                    where: {
                        projectId_name: { projectId, name: update.name }
                    } as any, // Using composite unique if available, else simple match
                    update: { code: update.code, route: update.route },
                    create: { name: update.name, code: update.code, route: update.route, projectId }
                });
            } else if (update.type === "component") {
                await prisma.component.upsert({
                    where: {
                        projectId_name: { projectId, name: update.name }
                    } as any,
                    update: { code: update.code },
                    create: { name: update.name, code: update.code, projectId }
                });
            }
        }

        // 5. Save AI response to history
        await prisma.chatMessage.create({
            data: { role: "assistant", content: message || `Updated ${actions.length} files.`, projectId }
        });

        return { success: true, message, updatesCount: actions.length };
    } catch (error) {
        console.error("Iteration error:", error);
        throw error;
    }
}
async function generateSchema(prompt: string) {
    const aiPrompt = `
        You are an expert database architect. Given the following user prompt for a web application, generate a database schema in JSON format.
        User Prompt: "${prompt}"

        Output format:
        [
            { "name": "EntityName", "fields": { "fieldName": "type", ... } }
        ]
        Types: String, Int, Boolean, DateTime, Json.
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
            { "name": "ComponentName", "code": "full source code string" }
        ]
        Return ONLY the JSON. Use standard lucide-react icons.
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
        Return ONLY the JSON.
    `;

    const result = await model.generateContent(aiPrompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}
