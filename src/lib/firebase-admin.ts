
import * as admin from "firebase-admin";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID?.trim(),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.trim(),
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.trim()?.replace(/\\n/g, "\n"),
        }),
    });
}

export const adminAuth = admin.auth();
