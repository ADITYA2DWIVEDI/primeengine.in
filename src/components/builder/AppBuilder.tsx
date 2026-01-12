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
    const [logs, setLogs] = useState<string[]>([]);
    const [steps, setSteps] = useState<BuildStep[]>([
        { id: "schema", label: "Neural Schema Architecture", status: "pending" },
        { id: "components", label: "Component Atomization", status: "pending" },
        { id: "pages", label: "Nexus Page Assembly", status: "pending" },
        { id: "preview", label: "Final Production Render", status: "pending" },
    ]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const startBuild = async () => {
        if (!prompt) return;
        setIsBuilding(true);
        setLogs(["Initiating Neural Link...", "Validating core prompt requirements..."]);

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                body: JSON.stringify({ prompt, name: "Prime Nexus v1" }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            setProjectId(data.projectId);

            let currentStep = 0;
            const logMessages = [
                "Generating relational entities...",
                "Writing TypeScript interfaces...",
                "Synthesizing Tailwind components...",
                "Optimizing page layouts...",
                "Finalizing publication manifests..."
            ];

            const interval = setInterval(() => {
                setSteps(prev => prev.map((s, i) => {
                    if (i === currentStep) return { ...s, status: "completed" };
                    if (i === currentStep + 1) return { ...s, status: "running" };
                    return s;
                }));

                addLog(logMessages[currentStep % logMessages.length]);

                currentStep++;
                if (currentStep >= steps.length) {
                    clearInterval(interval);
                    fetchProjectData(data.projectId);
                    setLogs(prev => [...prev, "Neural generation complete. Launching environment..."]);
                }
            }, 2000);
        } catch (err) {
            console.error("Build failed", err);
            setIsBuilding(false);
            setLogs(prev => [...prev, "ERROR: Neural Link Interrupted."]);
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
        <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-[420px] border-r border-white/5 flex flex-col bg-black/60 backdrop-blur-3xl relative z-30">
                <header className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-solar-gradient flex items-center justify-center shadow-[0_0_20px_rgba(255,148,77,0.3)]">
                            <Zap className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Architect Engine</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                    {/* Status Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Status</h3>
                            {isBuilding && <span className="flex items-center gap-2 text-[10px] font-bold text-solar-orange animate-pulse">● Active Build</span>}
                        </div>
                        <div className="space-y-4">
                            {steps.map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-2xl transition-all border",
                                        step.status === "completed" ? "bg-solar-red/5 border-solar-red/20 shadow-[0_0_20px_rgba(255,77,77,0.05)]" :
                                            step.status === "running" ? "bg-white/5 border-white/10" :
                                                "bg-transparent border-transparent opacity-20"
                                    )}
                                >
                                    <div className="flex-shrink-0">
                                        {step.status === "completed" ? (
                                            <div className="w-6 h-6 rounded-full bg-solar-red flex items-center justify-center shadow-[0_0_10px_rgba(255,77,77,0.5)]">
                                                <CheckCircle2 className="w-4 h-4 text-black" />
                                            </div>
                                        ) : step.status === "running" ? (
                                            <Loader2 className="w-6 h-6 text-solar-orange animate-spin" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full border-2 border-white/10" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={cn(
                                            "text-xs font-black uppercase tracking-widest leading-none",
                                            step.status === "completed" ? "text-white" : "text-white/40"
                                        )}>{step.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Build Logs */}
                    {logs.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Runtime Logs</h3>
                            <div className="p-4 rounded-2xl bg-black border border-white/5 font-mono text-[10px] text-white/40 space-y-1">
                                {logs.map((log, i) => (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i}>
                                        <span className="text-solar-orange mr-2">»</span> {log}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Files List */}
                    {projectData && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Structural Manifest</h3>
                            <div className="space-y-2">
                                {projectData.pages.map((p: any) => (
                                    <motion.div whileHover={{ x: 5 }} key={p.id} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-solar-orange/30 cursor-pointer transition-all">
                                        <Layers className="w-4 h-4 text-solar-orange group-hover:drop-shadow-[0_0_8px_rgba(255,148,77,0.5)]" />
                                        <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-wider">{p.name}.tsx</span>
                                    </motion.div>
                                ))}
                                {projectData.components.map((c: any) => (
                                    <motion.div whileHover={{ x: 5 }} key={c.id} className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-solar-red/30 cursor-pointer transition-all">
                                        <Code2 className="w-4 h-4 text-solar-red group-hover:drop-shadow-[0_0_8px_rgba(255,148,77,0.5)]" />
                                        <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-wider">{c.name}.tsx</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                <footer className="p-8 bg-black/40 border-t border-white/5 pt-10">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-solar-gradient opacity-0 group-focus-within:opacity-20 blur-xl transition-all" />
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Architectural modification..."
                            className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 pr-14 text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-solar-orange focus:border-solar-orange transition-all h-28 resize-none placeholder:text-white/10"
                        />
                        <button
                            onClick={startBuild}
                            disabled={isBuilding}
                            className="absolute bottom-5 right-5 p-3 bg-solar-gradient rounded-xl text-black hover:scale-110 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-solar-orange/20"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </footer>
            </aside>

            {/* Main Area */}
            <main className="flex-1 flex flex-col relative bg-[#020202]">
                <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 z-20">
                    <div className="flex items-center gap-10">
                        <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 transition-all">
                            {(["preview", "code"] as const).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={cn(
                                        "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                        view === v ? "bg-solar-gradient text-black shadow-lg" : "text-white/20 hover:text-white/40"
                                    )}
                                >{v}</button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 text-white/10">
                            <Monitor className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{projectData ? `PRIME_ENVIRONMENT_${projectData.id.slice(0, 8)}` : "STANDBY_MODE"}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-2 rounded-xl glass text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all border-white/5">Export Manifest</button>
                        <button className="px-8 py-2 rounded-xl bg-solar-gradient text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,148,77,0.2)] hover:scale-105 transition-all">Sync to Cloud</button>
                    </div>
                </header>

                <div className="flex-1 p-10 relative overflow-hidden flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {view === "preview" ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full rounded-[3rem] border border-white/5 bg-black/60 flex items-center justify-center relative shadow-2xl group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-solar-gradient opacity-[0.03]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,77,0.05)_0%,transparent_70%)]" />

                                {!isBuilding && !projectData ? (
                                    <div className="text-center space-y-8 max-w-sm relative z-10 px-8">
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 6, repeat: Infinity }}
                                            className="w-24 h-24 bg-solar-gradient rounded-[2rem] mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(255,77,77,0.3)]"
                                        >
                                            <Rocket className="w-12 h-12 text-black fill-black" />
                                        </motion.div>
                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Neural Link <br /><span className="text-gradient-solar italic">Ready.</span></h2>
                                            <p className="text-white/20 text-xs font-bold uppercase tracking-widest leading-relaxed">Enter your architectural prompt to begin the synthesis process.</p>
                                        </div>
                                    </div>
                                ) : isBuilding ? (
                                    <div className="text-center space-y-8 relative z-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-solar-orange blur-3xl opacity-20 animate-pulse" />
                                            <Loader2 className="w-16 h-16 text-solar-orange animate-spin mx-auto relative z-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-xl font-black uppercase tracking-[0.4em] text-solar-orange animate-pulse italic">Synthesizing...</h2>
                                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Building industrial grade architecture</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-full p-12 overflow-y-auto custom-scrollbar">
                                        <div className="max-w-5xl mx-auto space-y-16 py-12">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                                <div className="space-y-2">
                                                    <div className="text-solar-orange font-black text-[10px] uppercase tracking-[0.5em]">Live Prototype</div>
                                                    <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">The {projectData.name}</h1>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="px-5 py-2 rounded-full glass border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 italic">v1.0.402</div>
                                                    <div className="w-12 h-12 rounded-full bg-solar-gradient flex items-center justify-center shadow-lg"><Zap className="w-6 h-6 text-black" /></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {projectData.components.map((c: any, i: number) => (
                                                    <motion.div
                                                        key={c.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="p-10 rounded-[2.5rem] glass border-white/5 hover:border-solar-red/30 transition-all flex flex-col gap-6"
                                                    >
                                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-solar-red"><Code2 className="w-6 h-6" /></div>
                                                        <div className="space-y-2">
                                                            <h3 className="font-black text-2xl uppercase italic tracking-tighter">{c.name}</h3>
                                                            <p className="text-[11px] font-medium text-white/20 leading-relaxed">Highly scalable neural component optimized for global deployment.</p>
                                                        </div>
                                                        <button className="mt-4 py-3 rounded-2xl border border-white/5 text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Inspect Atom</button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code"
                                initial={{ opacity: 0, scale: 1.02 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                className="w-full h-full rounded-[3rem] border border-white/5 bg-black relative overflow-hidden shadow-3xl"
                            >
                                <header className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Terminal className="w-5 h-5 text-solar-yellow" />
                                        <span className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic">Neural Source Manifest</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-solar-red opacity-40 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase text-solar-red tracking-widest">Read-Only</span>
                                    </div>
                                </header>
                                <div className="p-10 font-mono text-[11px] leading-relaxed text-solar-orange/80 overflow-y-auto h-full pb-32 custom-scrollbar">
                                    {projectData ? (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/40 italic">
                                                // Automated Architectural Scan Complete <br />
                                                // ID: {projectData.id} <br />
                                                // Stamp: {new Date(projectData.createdAt).toISOString()}
                                            </div>
                                            <pre className="selection:bg-solar-red/30 selection:text-white">
                                                {projectData.pages[0]?.code || "// NO BUFFERED DATA AVAILABLE"}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="text-center space-y-4 opacity-5">
                                                <div className="text-9xl font-black uppercase italic tracking-tighter">Standby</div>
                                                <div className="text-xl font-black uppercase tracking-[1em]">Awaiting Link</div>
                                            </div>
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
