import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orchestrateGeneration, iterateUpdate } from "@/lib/ai-engine";

export async function POST(req: Request) {
    try {
        const { prompt, name, userId } = await req.json();

        // 1. Create the project record
        const project = await prisma.project.create({
            data: {
                name: name || "New Project",
                prompt,
                userId: userId || "default-user",
            },
        });

        // 2. Save initial message
        await prisma.chatMessage.create({
            data: { role: "user", content: prompt, projectId: project.id }
        });

        // 3. Start initial generation
        await orchestrateGeneration(project.id, prompt);

        return NextResponse.json({ success: true, projectId: project.id });
    } catch (error) {
        console.error("Project generation error:", error);
        return NextResponse.json({ error: "Failed to generate project" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { projectId, message, activeFile } = await req.json();
        if (!projectId || !message) {
            return NextResponse.json({ error: "Missing projectId or message" }, { status: 400 });
        }

        const result = await iterateUpdate(projectId, message, activeFile);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Project update error:", error);
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
        return NextResponse.json({ error: "Missing project ID" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            entities: true,
            components: true,
            pages: true,
            messages: { orderBy: { createdAt: 'asc' } }
        },
    });

    return NextResponse.json(project);
}
