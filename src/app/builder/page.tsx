"use client";

import AppBuilder from "@/components/builder/AppBuilder";
import { SessionProvider } from "next-auth/react";

export default function BuilderPage() {
    return (
        <SessionProvider>
            <AppBuilder />
        </SessionProvider>
    );
}
