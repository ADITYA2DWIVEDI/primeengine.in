
import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import shortid from "shortid";
import { auth } from "@/auth";

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payment_capture = 1;
    const amount = 29 * 100; // $29 in cents (or INR equivalent if configured)
    const currency = "USD"; // Change to INR if needed
    const options = {
        amount: amount.toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
        notes: {
            userId: session.user.id,
        }
    };

    try {
        const razorpay = getRazorpay();
        const response = await razorpay.orders.create(options);
        return NextResponse.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error("Razorpay error:", error);
        return NextResponse.json({ error: "Payment initiation failed" }, { status: 500 });
    }
}
