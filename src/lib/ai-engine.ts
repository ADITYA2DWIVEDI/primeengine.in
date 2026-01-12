import { prisma } from "./db";

export type GenerationState = "schema" | "components" | "pages" | "completed";

export async function orchestrateGeneration(projectId: string, prompt: string) {
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
}

// Mock AI functions for now
async function generateSchema(prompt: string) {
    // Logic to call LLM and get JSON schema
    return [
        { name: "Project", fields: { title: "String", status: "String" } },
        { name: "Task", fields: { title: "String", completed: "Boolean" } }
    ];
}

async function generateComponents(prompt: string, entities: any[]) {
    return [
        { name: "ProjectCard", code: "export const ProjectCard = () => <div className='p-4 border'>Project</div>" },
        { name: "TaskItem", code: "export const TaskItem = () => <div className='flex gap-2'>Task</div>" }
    ];
}

async function generatePages(prompt: string, entities: any[], components: any[]) {
    return [
        { name: "Dashboard", route: "/dashboard", code: "export default function Dashboard() { return <div>Dashboard</div> }" }
    ];
}
