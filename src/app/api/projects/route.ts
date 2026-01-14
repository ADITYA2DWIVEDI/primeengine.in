import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { orchestrateGeneration, iterateUpdate } from "@/lib/ai-engine";

import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const { prompt, name } = await req.json();
        const session = await auth();
        let userId = session?.user?.id;

        // Fallback for demo/dev mode or unauthenticated testing
        if (!userId) {
            // Check for existing "demo-user" or create one
            let demoUser = await prisma.user.findUnique({ where: { email: "demo@prime.engine" } });
            if (!demoUser) {
                demoUser = await prisma.user.create({
                    data: {
                        id: "demo-user",
                        email: "demo@prime.engine",
                        name: "Architect",
                        isPro: true
                    }
                });
            }
            userId = demoUser.id;
        }

        // 1. Create the project record
        const project = await prisma.project.create({
            data: {
                name: name || "New Project",
                prompt,
                userId: userId,
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
        return NextResponse.json({ error: "Failed to generate project: " + (error as any).message }, { status: 500 });
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
