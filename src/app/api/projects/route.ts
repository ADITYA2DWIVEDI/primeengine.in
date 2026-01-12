import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orchestrateGeneration } from "@/lib/ai-engine";

export async function POST(req: Request) {
    try {
        const { prompt, name, userId } = await req.json();

        // 1. Create the project record
        const project = await prisma.project.create({
            data: {
                name: name || "New Project",
                prompt,
                userId: userId || "default-user", // In a real app, this would come from the session
            },
        });

        // 2. Start the generation process (Background process in a real app, 
        // but here we wait for it to simulate the multi-step build)
        await orchestrateGeneration(project.id, prompt);

        return NextResponse.json({ success: true, projectId: project.id });
    } catch (error) {
        console.error("Project generation error:", error);
        return NextResponse.json({ error: "Failed to generate project" }, { status: 500 });
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
        },
    });

    return NextResponse.json(project);
}
