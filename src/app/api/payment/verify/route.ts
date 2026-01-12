
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Update user status
        await prisma.user.update({
            where: { email: session.user.email },
            data: { isPro: true }
        });

        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
}
