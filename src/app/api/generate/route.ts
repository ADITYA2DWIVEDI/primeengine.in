
import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const systemPrompt = `
    You are an expert AI web developer specializing in React, TypeScript, Tailwind CSS, and Next.js.
    Your task is to generate a single-file React component based on the user's request.
    
    Rules:
    1. Output ONLY the code. No markdown code blocks, no explanations.
    2. Use "lucide-react" for icons.
    3. Use Tailwind CSS for styling. Use "bg-white", "text-black", "rounded-xl", "shadow-lg" kind of standard classes.
    4. Ensure the component is responsive.
    5. If animations are needed, use "framer-motion".
    6. The component should be exported as default.
    7. Do not declare "use client" as it will be handled by the parent.
    8. Make it beautiful, modern, and production-ready.
    
    User Request: ${prompt}
    `;

        const result = await geminiModel.generateContent(systemPrompt);
        const response = result.response;
        let code = response.text();

        // Clean up code blocks if present
        code = code.replace(/```tsx/g, "").replace(/```typescript/g, "").replace(/```/g, "");

        return NextResponse.json({ code });
    } catch (error) {
        console.error("AI Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
    }
}
