
import Razorpay from "razorpay";

export const getRazorpay = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        // Only throw at runtime if actually needed
        console.warn("Razorpay keys missing during initialization");
    }

    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "dummy",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy",
    });
};
