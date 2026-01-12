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
    Rocket,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Code,
    Globe,
    X,
    Maximize2,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "running" | "completed";

interface BuildStep {
    id: string;
    label: string;
    status: StepStatus;
}

export default function AppBuilder({
    initialPrompt,
}: {
    initialPrompt?: string;
}) {
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [isBuilding, setIsBuilding] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ type: 'page' | 'component', name: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

    // Missing state variables restored
    const [projectId, setProjectId] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [steps, setSteps] = useState<BuildStep[]>([
        { id: "schema", label: "Building the Foundation", status: "pending" },
        { id: "components", label: "Creating the Design", status: "pending" },
        { id: "pages", label: "Putting it Together", status: "pending" },
        { id: "preview", label: "Everything is Ready", status: "pending" },
    ]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    const startBuild = async () => {
        if (!prompt || isBuilding) return;

        setIsBuilding(true);
        setProjectId(null);
        setProjectData(null);
        setLogs(["Waking up the AI...", "Thinking about your idea..."]);

        // Reset steps
        setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                body: JSON.stringify({ prompt, name: "Prime Nexus v1" }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (!data.projectId) throw new Error("Failed to create project");
            setProjectId(data.projectId);

            let currentStep = 0;
            const logMessages = [
                "Setting up the database...",
                "Writing the code...",
                "Designing the pages...",
                "Making it fast...",
                "Almost there..."
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
                    setLogs(prev => [...prev, "Done! Opening your new app..."]);
                }
            }, 2000);
        } catch (err) {
            console.error("Build failed", err);
            setIsBuilding(false);
            setLogs(prev => [...prev, "ERROR: Neural Link Interrupted."]);
        }
    };

    const handleSendMessage = async () => {
        if (!prompt || !projectId || isBuilding) return;

        const userMsg = prompt;
        setPrompt("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsBuilding(true);
        addLog("Analyzing update request...");

        try {
            const res = await fetch("/api/projects", {
                method: "PATCH",
                body: JSON.stringify({ projectId, message: userMsg }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.success) {
                await fetchProjectData(projectId);
                setMessages(prev => [...prev, { role: "assistant", content: `Applied updates based on: "${userMsg}"` }]);
            }
        } catch (err) {
            console.error("Update failed", err);
        } finally {
            setIsBuilding(false);
        }
    };

    const fetchProjectData = async (id: string) => {
        const res = await fetch(`/api/projects?id=${id}`);
        const data = await res.json();
        setProjectData(data);
        setMessages(data.messages || []);
        if (data.pages?.length > 0) setSelectedFile({ type: 'page', name: data.pages[0].name });
        setIsBuilding(false);
    };

    useEffect(() => {
        if (initialPrompt) startBuild();
    }, []);

    // Handle mobile auto-close sidebar safely
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsSidebarOpen(false);
            else setIsSidebarOpen(true);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleGitHubDeploy = async () => {
        if (!projectId) return;
        const msg = window.prompt("Enter a name for your GitHub Repository:", "my-ai-app-v1");
        if (!msg) return;

        addLog(`Initiating deployment to GitHub: ${msg}...`);
        try {
            const res = await fetch("/api/deploy/github", {
                method: "POST",
                body: JSON.stringify({ projectId, repoName: msg }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.repoUrl) {
                window.open(data.repoUrl, "_blank");
                addLog(`Success! Repo created: ${data.repoUrl}`);
                alert(`Repository Created Successfully!\n${data.repoUrl}`);
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            console.error(err);
            addLog(`Deployment Failed: ${err.message}`);
            alert("Deployment Failed. Make sure you are logged in with GitHub.");
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-500">
            {/* Mobile Sidebar Toggle */}
            <AnimatePresence>
                {!isSidebarOpen && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed bottom-8 left-8 z-50 p-4 bg-solar-gradient text-black rounded-2xl shadow-2xl lg:hidden flex items-center justify-center"
                    >
                        <Zap className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Sidebar Overlay for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isSidebarOpen ? 0 : -420,
                    width: isSidebarOpen ? (isMobile ? "85%" : "420px") : "0px",
                }}
                className={cn(
                    "fixed lg:relative z-50 h-full border-r border-foreground/5 flex flex-col bg-background/80 backdrop-blur-3xl overflow-hidden shadow-2xl transition-colors duration-500",
                    !isSidebarOpen && "pointer-events-none lg:pointer-events-auto"
                )}
            >
                <header className="p-6 md:p-8 border-b border-foreground/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-solar-gradient flex items-center justify-center shadow-[0_0_20px_rgba(255,148,77,0.3)]">
                            <Zap className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-black uppercase tracking-[0.2em] text-[10px] text-foreground">Prime Builder</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsSidebarOpen(false)} className="p-2 lg:hidden text-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
                    {/* Chat Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Iteration History</h3>
                            {isBuilding && <span className="flex items-center gap-2 text-[10px] font-bold text-solar-orange animate-pulse">● Processing...</span>}
                        </div>
                        <div className="space-y-4">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "p-4 rounded-2xl text-[11px] leading-relaxed border",
                                        msg.role === 'user'
                                            ? "bg-foreground/5 border-foreground/10 ml-4 rounded-br-none"
                                            : "bg-solar-gradient text-black border-transparent mr-4 rounded-bl-none font-bold"
                                    )}
                                >
                                    {msg.content}
                                </motion.div>
                            ))}
                            {messages.length === 0 && !isBuilding && (
                                <div className="p-8 rounded-[2.5rem] border border-dashed border-foreground/10 text-center space-y-3">
                                    <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mx-auto">
                                        <History className="w-5 h-5 text-foreground/20" />
                                    </div>
                                    <p className="text-[10px] font-medium text-foreground/40 italic">Awaiting your first vision...</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Explorer/Steps Section */}
                    {isBuilding && messages.length === 0 ? (
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Building App</h3>
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all", step.status === 'pending' ? 'opacity-20' : 'opacity-100')}>
                                        {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4 text-solar-orange" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : projectData && (
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Project Files</h3>
                            <div className="space-y-2">
                                {projectData.pages?.map((p: any) => (
                                    <button
                                        key={p.name}
                                        onClick={() => { setSelectedFile({ type: 'page', name: p.name }); setActiveTab('code'); }}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-bold text-left transition-all",
                                            selectedFile?.name === p.name ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground/60"
                                        )}
                                    >
                                        <Globe className="w-3.5 h-3.5" /> {p.name}.tsx
                                    </button>
                                ))}
                                {projectData.components?.map((c: any) => (
                                    <button
                                        key={c.name}
                                        onClick={() => { setSelectedFile({ type: 'component', name: c.name }); setActiveTab('code'); }}
                                        className={cn(
                                            "w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-bold text-left transition-all",
                                            selectedFile?.name === c.name ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground/60"
                                        )}
                                    >
                                        <Layers className="w-3.5 h-3.5" /> {c.name}.tsx
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="p-6 md:p-8 bg-foreground/[0.02] border-t border-foreground/5 space-y-6">
                    <div className="relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); projectId ? handleSendMessage() : startBuild(); } }}
                            placeholder={projectId ? "Ask for changes..." : "What should it do next?"}
                            className="w-full h-24 md:h-28 bg-background border border-foreground/10 rounded-2xl p-4 pr-12 text-sm focus:ring-1 focus:ring-solar-orange focus:border-solar-orange transition-all resize-none shadow-inner"
                        />
                        <button
                            onClick={projectId ? handleSendMessage : startBuild}
                            disabled={isBuilding}
                            className={cn(
                                "absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-2xl",
                                prompt.length > 2 ? "bg-solar-gradient text-black scale-100" : "bg-foreground/5 text-foreground/10 scale-90"
                            )}
                        >
                            {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </footer>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative bg-background overflow-hidden transition-colors duration-500">
                <header className="h-16 md:h-20 border-b border-foreground/5 glass flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-foreground/5 rounded-lg transition-all hidden lg:block">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase text-foreground/20 tracking-[0.2em]">Project Environment</span>
                            <span className="text-[10px] font-black uppercase text-foreground tracking-[0.2em]">{projectData?.name || "Neural Prototype v1"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 glass p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={cn(
                                "px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                activeTab === "preview" ? "bg-foreground text-background shadow-xl" : "text-foreground/40 hover:text-foreground"
                            )}
                        >Preview</button>
                        <button
                            onClick={() => setActiveTab("code")}
                            className={cn(
                                "px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                activeTab === "code" ? "bg-foreground text-background shadow-xl" : "text-foreground/40 hover:text-foreground"
                            )}
                        >Source</button>
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                        <button className="px-5 py-2 rounded-xl glass text-[9px] font-black uppercase tracking-widest hover:border-solar-red transition-all">Export</button>
                        <button
                            onClick={handleGitHubDeploy}
                            disabled={!projectId}
                            className="px-5 py-2 rounded-xl bg-solar-gradient text-black text-[9px] font-black uppercase tracking-widest shadow-2xl shadow-solar-orange/20 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            Publish to GitHub
                        </button>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8 relative overflow-hidden bg-foreground/[0.01]">
                    <AnimatePresence mode="wait">
                        {activeTab === "preview" ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                whileHover={{ perspective: 1000, rotateX: 1, rotateY: -1 }}
                                transition={{ duration: 0.4 }}
                                className="h-full glass rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col cursor-default preserve-3d"
                            >
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-12 space-y-10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-solar-gradient opacity-[0.02] pointer-events-none" />

                                    <div className="relative">
                                        <div className="absolute inset-0 bg-solar-gradient blur-3xl opacity-20 animate-pulse" />
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-[2.5rem] bg-solar-gradient flex items-center justify-center p-6 md:p-8 shadow-2xl">
                                            <Rocket className="w-full h-full text-black" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 relative z-10 max-w-lg">
                                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-tight">Your <br /><span className="text-gradient-solar">App.</span></h2>
                                        <p className="text-foreground/40 font-medium text-sm md:text-lg leading-relaxed px-4">
                                            {isBuilding ? "Prime Engine is building your app right now. Everything is being made just for you." :
                                                projectData ? "Your app is ready! You can check the code or publish it to the web." :
                                                    "Tell the AI what to build to get started."}
                                        </p>
                                    </div>

                                    {projectData && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                            <div className="p-6 rounded-3xl glass text-left space-y-1">
                                                <div className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Schemas</div>
                                                <div className="text-2xl font-black text-solar-red">{projectData.entities?.length || 0}</div>
                                            </div>
                                            <div className="p-6 rounded-3xl glass text-left space-y-1">
                                                <div className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Files</div>
                                                <div className="text-2xl font-black text-solar-orange">{(projectData.components?.length || 0) + (projectData.pages?.length || 0)}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="code"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full glass rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                            >
                                <header className="px-8 py-5 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-solar-red animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60">
                                            {selectedFile ? `${selectedFile.name}.tsx` : 'Logic Manifest'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-2 text-[9px] font-black uppercase text-foreground/40 hover:text-solar-orange transition-colors tracking-widest">
                                            <Download className="w-3.5 h-3.5" /> Export
                                        </button>
                                        <button className="flex items-center gap-2 text-[9px] font-black uppercase text-foreground/40 hover:text-solar-orange transition-colors tracking-widest">
                                            <Maximize2 className="w-3.5 h-3.5" /> Expand
                                        </button>
                                    </div>
                                </header>
                                <div className="p-8 md:p-12 font-mono text-[10px] md:text-[11px] leading-relaxed text-foreground/70 overflow-y-auto h-full custom-scrollbar bg-background/50">
                                    {selectedFile && projectData ? (
                                        <div className="space-y-8">
                                            <div>
                                                <span className="text-solar-red italic">// {selectedFile.type}: {selectedFile.name}</span>
                                                <pre className="mt-2 text-foreground/90 whitespace-pre-wrap">
                                                    {selectedFile.type === 'page'
                                                        ? projectData.pages.find((p: any) => p.name === selectedFile.name)?.code
                                                        : projectData.components.find((c: any) => c.name === selectedFile.name)?.code}
                                                </pre>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-10">
                                            <Terminal className="w-16 h-16" />
                                            <span className="text-[10px] font-black uppercase tracking-widest italic">Awaiting selection...</span>
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
