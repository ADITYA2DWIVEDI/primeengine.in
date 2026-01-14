import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, style } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "No description provided" }, { status: 400 });
        }

        // enhance prompt with style
        const enhancedPrompt = `${prompt}, ${style} style, high quality, highly detailed, 8k`;

        // Pollinations AI URL (Free, No Key)
        // We use a random seed to ensure new images on same prompt
        const seed = Math.floor(Math.random() * 100000);
        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&seed=${seed}`;

        // Pollinations returns the image directly, but for our API we return the URL string
        // The frontend can just set this as the src
        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error("Image generation error:", error);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
