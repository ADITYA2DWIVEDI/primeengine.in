
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deployToGitHub } from "@/lib/github-deploy";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        // @ts-ignore
        const githubToken = session?.user?.githubAccessToken;

        if (!githubToken) {
            return NextResponse.json(
                { error: "GitHub account not connected. Please login with GitHub." },
                { status: 401 }
            );
        }

        const { code, prompt } = await req.json();

        if (!code) {
            return NextResponse.json({ error: "No code to deploy" }, { status: 400 });
        }

        const projectName = prompt ? prompt.split(" ").slice(0, 3).join("-") : "ai-app";
        const result = await deployToGitHub(githubToken, code, projectName);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Deploy Error:", error);
        return NextResponse.json(
            { error: "Failed to deploy to GitHub" },
            { status: 500 }
        );
    }
}
