"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Terminal,
    Layers,
    Code2,
    Monitor,
    CheckCircle2,
    Loader2,
    Send,
    Zap,
    MoreVertical,
    History,
    Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "running" | "completed";

interface BuildStep {
    id: string;
    label: string;
    status: StepStatus;
    details?: string;
}

export default function AppBuilder({ initialPrompt }: { initialPrompt?: string }) {
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [isBuilding, setIsBuilding] = useState(false);
    const [view, setView] = useState<"preview" | "code">("preview");
    const [projectId, setProjectId] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<any>(null);
    const [steps, setSteps] = useState<BuildStep[]>([
        { id: "schema", label: "Generating Entities", status: "pending" },
        { id: "components", label: "Writing Components", status: "pending" },
        { id: "pages", label: "Building Pages", status: "pending" },
        { id: "preview", label: "Launching Preview", status: "pending" },
    ]);

    const startBuild = async () => {
        if (!prompt) return;
        setIsBuilding(true);

        try {
            // Real API Call to start the full-stack build
            const res = await fetch("/api/projects", {
                method: "POST",
                body: JSON.stringify({ prompt, name: "Prime App" }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setProjectId(data.projectId);

            // Simulation for the UI steps
            let currentStep = 0;
            const interval = setInterval(() => {
                setSteps(prev => prev.map((s, i) => {
                    if (i === currentStep) return { ...s, status: "completed" };
                    if (i === currentStep + 1) return { ...s, status: "running" };
                    return s;
                }));
                currentStep++;
                if (currentStep >= steps.length) {
                    clearInterval(interval);
                    fetchProjectData(data.projectId);
                }
            }, 1500);
        } catch (err) {
            console.error("Build failed", err);
            setIsBuilding(false);
        }
    };

    const fetchProjectData = async (id: string) => {
        const res = await fetch(`/api/projects?id=${id}`);
        const data = await res.json();
        setProjectData(data);
        setIsBuilding(false);
    };

    useEffect(() => {
        if (initialPrompt) startBuild();
    }, []);

    return (
        <div className="flex h-screen bg-solar-black text-white font-sans overflow-hidden">
            {/* Sidebar: AI Generation Control */}
            <aside className="w-[400px] border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-xl relative z-30">
                <header className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-solar-orange" />
                        <span className="font-bold uppercase tracking-widest text-sm">Builder Engine</span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <History className="w-4 h-4 text-white/40" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Active Build Steps */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Generation Status</h3>
                        <div className="space-y-3">
                            {steps.map((step) => (
                                <div key={step.id} className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all border",
                                    step.status === "completed" ? "bg-solar-red/5 border-solar-red/20" :
                                        step.status === "running" ? "bg-white/5 border-white/20 animate-pulse" :
                                            "bg-transparent border-transparent opacity-40"
                                )}>
                                    <div className="flex-shrink-0">
                                        {step.status === "completed" ? (
                                            <CheckCircle2 className="w-5 h-5 text-solar-red" />
                                        ) : step.status === "running" ? (
                                            <Loader2 className="w-5 h-5 text-solar-orange animate-spin" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "text-sm font-bold",
                                            step.status === "completed" ? "text-white" : "text-white/60"
                                        )}>{step.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Explorer (Generated Files) */}
                    {projectData && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Project Files</h3>
                            <div className="space-y-1">
                                {projectData.pages.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs font-medium text-white/70">
                                        <Layers className="w-3.5 h-3.5 text-solar-orange" />
                                        {p.name}.tsx
                                    </div>
                                ))}
                                {projectData.components.map((c: any) => (
                                    <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs font-medium text-white/70">
                                        <Code2 className="w-3.5 h-3.5 text-solar-red" />
                                        {c.name}.tsx
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Suggestions */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Suggestions</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {["Add Dark Mode", "Setup Stripe Checkout", "Add Charts"].map(s => (
                                <button key={s} className="text-left px-4 py-2 rounded-lg glass text-[11px] font-bold text-white/60 hover:text-white transition-colors uppercase">
                                    + {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Prompt Footer */}
                <footer className="p-6 bg-black/60 border-t border-white/10">
                    <div className="relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="What would you like to change?"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 text-sm focus:ring-1 focus:ring-solar-orange focus:border-solar-orange transition-all h-24 resize-none"
                        />
                        <button
                            onClick={startBuild}
                            className="absolute bottom-4 right-4 p-2 bg-solar-gradient rounded-xl text-black hover:scale-110 transition-transform"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </footer>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative bg-[#050505]">
                <header className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-6">
                        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 transition-all">
                            <button
                                onClick={() => setView("preview")}
                                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", view === "preview" ? "bg-solar-gradient text-black" : "text-white/40 hover:text-white")}
                            >Preview</button>
                            <button
                                onClick={() => setView("code")}
                                className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all", view === "code" ? "bg-solar-gradient text-black" : "text-white/40 hover:text-white")}
                            >Code</button>
                        </div>

                        <div className="flex items-center gap-2 text-white/20">
                            <Monitor className="w-4 h-4" />
                            <span className="text-xs font-medium">{projectData ? `apps/${projectData.id}` : "no project active"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-1.5 rounded-lg glass text-xs font-bold text-white transition-colors">Export</button>
                        <button className="px-6 py-1.5 rounded-lg bg-solar-gradient text-black text-xs font-black uppercase tracking-widest shadow-lg shadow-solar-orange/20">Publish</button>
                    </div>
                </header>

                {/* Dynamic Viewport */}
                <div className="flex-1 p-8 relative overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        {view === "preview" ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="w-full h-full rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden group shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-solar-gradient opacity-[0.02]" />

                                {!isBuilding && !projectData ? (
                                    <div className="text-center space-y-6 max-w-md relative z-10">
                                        <div className="w-20 h-20 bg-solar-gradient rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(255,77,77,0.3)]">
                                            <Rocket className="w-10 h-10 text-black" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tighter">Ready for launch</h2>
                                        <p className="text-white/40 text-sm mt-2">Describe your application to the left and watch Prime Engine build it in real-time.</p>
                                    </div>
                                ) : isBuilding ? (
                                    <div className="text-center space-y-6 relative z-10">
                                        <Loader2 className="w-12 h-12 text-solar-orange animate-spin mx-auto" />
                                        <h2 className="text-xl font-bold uppercase tracking-widest animate-pulse">Evolving Application...</h2>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-8 overflow-y-auto">
                                        <div className="max-w-4xl mx-auto text-center space-y-12 py-12">
                                            <h1 className="text-5xl font-black uppercase text-solar-orange">Your Generated App</h1>
                                            <div className="grid grid-cols-2 gap-4">
                                                {projectData.components.map((c: any) => (
                                                    <div key={c.id} className="p-8 rounded-2xl glass border-solar-red/20 text-left space-y-4">
                                                        <div className="w-10 h-10 rounded-xl bg-solar-red/20 flex items-center justify-center"><Code2 className="text-solar-red" /></div>
                                                        <h3 className="font-bold text-xl uppercase italic">{c.name}</h3>
                                                        <p className="text-sm text-white/40">Highly optimized component generated by Prime Intelligence.</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="w-full h-full rounded-2xl border border-white/10 bg-black relative overflow-hidden shadow-2xl"
                            >
                                <header className="px-6 py-3 border-b border-white/10 bg-white/5 flex items-center gap-3">
                                    <Terminal className="w-4 h-4 text-solar-yellow" />
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest leading-none">Source Code Editor</span>
                                </header>
                                <div className="p-6 font-mono text-xs leading-relaxed text-white/80 overflow-y-auto h-full pb-20">
                                    {projectData ? (
                                        <pre className="text-solar-orange/80">
                                            {`// Project: ${projectData.name}\n// Generated at: ${new Date(projectData.createdAt).toLocaleString()}\n\n`}
                                            {projectData.pages[0]?.code || "// No code available yet"}
                                        </pre>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white/10 uppercase font-black text-4xl">
                                            No Code Yet
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
