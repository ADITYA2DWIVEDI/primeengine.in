"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wand2, Globe, Layout, Code } from "lucide-react";

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const templates = [
        {
            id: "saas",
            title: "SaaS Application",
            description: "Complete SaaS starter with auth, payments, and dashboard.",
            icon: Layout,
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            id: "landing",
            title: "Marketing Website",
            description: "High-conversion landing page with modern animations.",
            icon: Globe,
            color: "bg-solar-orange/10 text-solar-orange",
        },
        {
            id: "api",
            title: "REST API Backend",
            description: "Scalable Node.js API with Prisma and PostgreSQL.",
            icon: Code,
            color: "bg-green-500/10 text-green-500",
        },
    ];

    const handleCreate = async (templateId: string) => {
        setLoading(true);
        // Simulate creation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        router.push("/dashboard");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-zinc-400 hover:text-zinc-100 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </button>
                <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
                <p className="text-zinc-400 mt-2">Choose a template to start building your AI-powered application.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleCreate(template.id)}
                        disabled={loading}
                        className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className={`w-12 h-12 rounded-xl ${template.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <template.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">{template.description}</p>

                        {loading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Wand2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
