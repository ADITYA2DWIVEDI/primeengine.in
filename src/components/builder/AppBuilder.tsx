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
    Download,
    Smartphone,
    Tablet,
    Layout,
    Palette,
    Clock,
    MousePointer2,
    FileCode2,
    FolderTree,
    Sparkle
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "running" | "completed";

interface BuildStep {
    id: string;
    label: string;
    status: StepStatus;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    type?: "text" | "code_update" | "thought";
}

export default function AppBuilder({
    initialPrompt,
}: {
    initialPrompt?: string;
}) {
    const [prompt, setPrompt] = useState(initialPrompt || "");
    const [isBuilding, setIsBuilding] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedFile, setSelectedFile] = useState<{ type: 'page' | 'component', name: string } | null>(null);
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

    // Pro / Ultra State
    const [projectId, setProjectId] = useState<string | null>(null);
    const [projectData, setProjectData] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop");
    const [showTerminal, setShowTerminal] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark" | "solar" | "glass">("solar");
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isInspectorActive, setIsInspectorActive] = useState(false);
    const [isArtStudioOpen, setIsArtStudioOpen] = useState(false);

    // Art Studio State
    const [imagePrompt, setImagePrompt] = useState("");
    const [imageStyle, setImageStyle] = useState("Flat");
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerateImage = async () => {
        if (!imagePrompt) return;
        setIsGeneratingImage(true);
        setGeneratedImage(null);
        try {
            const res = await fetch("/api/generate/image", {
                method: "POST",
                body: JSON.stringify({ prompt: imagePrompt, style: imageStyle }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.imageUrl) {
                setGeneratedImage(data.imageUrl);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };


    const [steps, setSteps] = useState<BuildStep[]>([
        { id: "schema", label: "Building the Foundation", status: "pending" },
        { id: "components", label: "Creating the Design", status: "pending" },
        { id: "pages", label: "Putting it Together", status: "pending" },
        { id: "preview", label: "Everything is Ready", status: "pending" },
    ]);

    const addLog = (msg: string) => {
        setLogs(prev => [...prev.slice(-4), msg]);
    };

    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (e.data.type === 'INSPECTOR_CLICK') {
                const fileName = e.data.fileName;
                const page = projectData?.pages?.find((p: any) => p.name === fileName);
                const component = projectData?.components?.find((c: any) => c.name === fileName);

                if (page || component) {
                    setSelectedFile({
                        type: page ? 'page' : 'component',
                        name: fileName
                    });
                    setActiveTab('code');
                    setIsInspectorActive(false);
                }
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [projectData, setIsInspectorActive, setSelectedFile, setActiveTab]);

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
        const activeFile = selectedFile ? {
            name: selectedFile.name,
            code: selectedFile.type === 'page'
                ? projectData.pages.find((p: any) => p.name === selectedFile.name)?.code
                : projectData.components.find((c: any) => c.name === selectedFile.name)?.code
        } : null;

        setPrompt("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsBuilding(true);
        addLog("Analyzing update request...");

        try {
            const res = await fetch("/api/projects", {
                method: "PATCH",
                body: JSON.stringify({ projectId, message: userMsg, activeFile }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.success) {
                await fetchProjectData(projectId);
                setMessages(prev => [...prev.slice(0, -1), { role: "user", content: userMsg }, { role: "assistant", content: data.message || `I've applied the updates based on your request.` }]);
            }
        } catch (err) {
            console.error("Update failed", err);
            addLog("ERROR: Update sequence failed.");
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
        <div className={cn("flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-500", theme)}>
            {/* Background Ambient Mesh */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-solar-red/10 blur-[120px] animate-float-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-solar-orange/10 blur-[120px] animate-float-slower" />
            </div>
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
                    "fixed lg:relative z-50 h-full border-r border-foreground/5 flex flex-col bg-background/20 backdrop-blur-3xl overflow-hidden shadow-2xl transition-colors duration-500",
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
                        <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar px-1">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "p-4 rounded-2xl text-[10px] leading-relaxed relative group",
                                        msg.role === 'user'
                                            ? "bg-foreground/5 border border-foreground/10 ml-6 rounded-tr-none text-foreground/80"
                                            : "bg-solar-gradient text-black border-transparent mr-6 rounded-tl-none font-bold shadow-lg shadow-solar-orange/10"
                                    )}
                                >
                                    <div className="flex items-center gap-2 mb-1.5 opacity-40">
                                        {msg.role === 'user' ? <div className="w-1.5 h-1.5 rounded-full bg-foreground" /> : <Zap className="w-3 h-3" />}
                                        <span className="uppercase tracking-[0.2em] font-black text-[8px]">{msg.role === 'user' ? 'Commander' : 'Prime Engine'}</span>
                                    </div>
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
                            <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">Neural Construction</h3>
                            <div className="space-y-4">
                                {steps.map((step, idx) => (
                                    <div key={idx} className={cn("flex items-center gap-4 p-4 rounded-2xl border transition-all", step.status === 'pending' ? 'opacity-20' : 'opacity-100')}>
                                        {step.status === 'completed' ? (
                                            <div className="w-5 h-5 rounded-full bg-solar-gradient flex items-center justify-center">
                                                <CheckCircle2 className="w-3 h-3 text-black" />
                                            </div>
                                        ) : (
                                            <Loader2 className="w-5 h-5 animate-spin text-solar-orange" />
                                        )}
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : projectData && (
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em]">File System</h3>
                                    <FolderTree className="w-3.5 h-3.5 text-foreground/10" />
                                </div>

                                <div className="space-y-4">
                                    {/* Pages Folder */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 text-[9px] font-black text-foreground/30 uppercase tracking-widest">
                                            <Globe className="w-3 h-3" /> Pages
                                        </div>
                                        <div className="space-y-1 ml-2 border-l border-foreground/5 pl-2">
                                            {projectData.pages?.filter((p: any) => !p.route.startsWith('/api')).map((p: any) => (
                                                <button
                                                    key={p.name}
                                                    onClick={() => { setSelectedFile({ type: 'page', name: p.name }); setActiveTab('code'); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-bold text-left transition-all",
                                                        selectedFile?.name === p.name ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground/60"
                                                    )}
                                                >
                                                    <FileCode2 className="w-3.5 h-3.5" /> {p.name}.tsx
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* API Routes Folder */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 text-[9px] font-black text-foreground/30 uppercase tracking-widest">
                                            <div className="w-3 h-3 rounded-full bg-solar-orange/20 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-solar-orange animate-pulse" />
                                            </div>
                                            API Routes
                                        </div>
                                        <div className="space-y-1 ml-2 border-l border-foreground/5 pl-2">
                                            {projectData.pages?.filter((p: any) => p.route.startsWith('/api')).map((p: any) => (
                                                <button
                                                    key={p.name}
                                                    onClick={() => { setSelectedFile({ type: 'page', name: p.name }); setActiveTab('code'); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-bold text-left transition-all",
                                                        selectedFile?.name === p.name ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground/60"
                                                    )}
                                                >
                                                    <Terminal className="w-3.5 h-3.5 text-solar-orange" /> {p.name}
                                                </button>
                                            ))}
                                            {(!projectData.pages?.some((p: any) => p.route.startsWith('/api'))) && (
                                                <div className="px-2.5 py-1 text-[9px] text-foreground/20 italic">No endpoints</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Components Folder */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 px-2 text-[9px] font-black text-foreground/30 uppercase tracking-widest">
                                            <Layers className="w-3 h-3" /> Components
                                        </div>
                                        <div className="space-y-1 ml-2 border-l border-foreground/5 pl-2">
                                            {projectData.components?.map((c: any) => (
                                                <button
                                                    key={c.name}
                                                    onClick={() => { setSelectedFile({ type: 'component', name: c.name }); setActiveTab('code'); }}
                                                    className={cn(
                                                        "w-full flex items-center gap-2.5 p-2.5 rounded-xl text-[10px] font-bold text-left transition-all",
                                                        selectedFile?.name === c.name ? "bg-foreground text-background shadow-lg" : "hover:bg-foreground/5 text-foreground/60"
                                                    )}
                                                >
                                                    <Code2 className="w-3.5 h-3.5" /> {c.name}.tsx
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="p-6 md:p-8 border-t border-foreground/5 space-y-6 bg-background/50">
                    <div className="relative group">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); projectId ? handleSendMessage() : startBuild(); } }}
                            placeholder={projectId ? "Issue a command..." : "Initialize the AI..."}
                            className="w-full h-24 md:h-28 bg-foreground/[0.02] border border-foreground/5 rounded-[2rem] p-5 pr-14 text-xs font-medium focus:ring-1 focus:ring-solar-orange/50 focus:border-solar-orange/50 transition-all resize-none shadow-inner"
                        />
                        <button
                            onClick={projectId ? handleSendMessage : startBuild}
                            disabled={isBuilding}
                            className={cn(
                                "absolute bottom-5 right-5 p-3.5 rounded-2xl transition-all shadow-xl",
                                prompt.length > 2 ? "bg-solar-gradient text-black scale-100 hover:scale-110 active:scale-95" : "bg-foreground/5 text-foreground/10 scale-90"
                            )}
                        >
                            {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </footer>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative z-10 bg-transparent overflow-hidden transition-colors duration-500">
                <header className="h-16 md:h-20 border-b border-foreground/5 bg-background/30 backdrop-blur-xl flex items-center justify-between px-6 z-20">
                    <div className="flex items-center gap-4">
                        {!isSidebarOpen && (
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-foreground/5 rounded-lg transition-all hidden lg:block">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                        <div className="flex flex-col">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] italic">Neural <span className="text-solar-orange italic">Link</span></h2>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest leading-none">Aesthetic Core Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Device Switcher */}
                        <div className="hidden md:flex items-center gap-1 p-1 bg-foreground/5 rounded-xl border border-foreground/5">
                            {[
                                { id: 'mobile', icon: Smartphone, label: '375px' },
                                { id: 'tablet', icon: Tablet, label: '768px' },
                                { id: 'desktop', icon: Monitor, label: '100%' }
                            ].map(device => (
                                <button
                                    key={device.id}
                                    onClick={() => setDeviceType(device.id as any)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all flex items-center gap-2 hover:bg-foreground/5",
                                        deviceType === device.id ? "bg-background shadow-sm text-solar-orange" : "text-foreground/40"
                                    )}
                                >
                                    <device.icon className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">{device.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-foreground/5 mx-2" />

                        {/* Theme Lab Trigger */}
                        <div className="relative">
                            <button
                                onClick={() => setTheme(theme === 'solar' ? 'dark' : theme === 'dark' ? 'light' : 'solar')}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 transition-all group"
                            >
                                <Palette className="w-4 h-4 text-solar-orange group-hover:rotate-12 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{theme} Lab</span>
                            </button>
                        </div>

                        {/* Design Inspector Trigger */}
                        <button
                            onClick={() => setIsInspectorActive(!isInspectorActive)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                                isInspectorActive ? "bg-solar-orange text-black border-solar-orange" : "bg-foreground/5 hover:bg-foreground/10 border-foreground/5"
                            )}
                        >
                            <MousePointer2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Inspector</span>
                        </button>

                        <div className="h-6 w-px bg-foreground/5 mx-2" />

                        <button
                            onClick={() => setIsArtStudioOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-solar-gradient text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-solar-orange/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <Sparkle className="w-4 h-4" />
                            Art Studio
                        </button>
                    </div>
                </header>

                {/* Art Studio Modal */}
                <AnimatePresence>
                    {isArtStudioOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-2xl"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="w-full max-w-2xl bg-black border border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-solar-gradient opacity-[0.03] pointer-events-none" />
                                <button onClick={() => setIsArtStudioOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-white/5 rounded-full transition-all">
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="space-y-8 relative">
                                    <div className="space-y-2">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-gradient/10 border border-solar-orange/20 text-solar-orange text-[8px] font-black uppercase tracking-[0.2em]">
                                            <Sparkle className="w-3 h-3" /> Neural Artist
                                        </div>
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">AI Art <span className="text-gradient-solar">Studio.</span></h3>
                                        <p className="text-[10px] text-white/40 font-medium uppercase tracking-[0.2em] leading-relaxed">
                                            Generate high-fidelity assets, logos, and UI elements directly for your project.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <textarea
                                            value={imagePrompt}
                                            onChange={(e) => setImagePrompt(e.target.value)}
                                            placeholder="Describe the asset you want (e.g., 'A futuristic solar-powered data dashboard icon, high gloss, red and orange colors')..."
                                            className="w-full h-32 bg-white/5 border border-white/10 rounded-3xl p-6 text-xs font-medium focus:ring-1 focus:ring-solar-orange transition-all resize-none placeholder:text-white/10 text-white"
                                        />
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Flat', '3D Render', 'Minimalist', 'Realistic'].map(style => (
                                                <button
                                                    key={style}
                                                    onClick={() => setImageStyle(style)}
                                                    className={cn(
                                                        "p-3 rounded-2xl bg-white/5 border text-[8px] font-black uppercase tracking-widest transition-all font-bold",
                                                        imageStyle === style ? "border-solar-orange text-solar-orange bg-solar-orange/10" : "border-white/5 hover:border-solar-orange/50 text-white"
                                                    )}
                                                >
                                                    {style}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={handleGenerateImage}
                                            disabled={isGeneratingImage || !imagePrompt}
                                            className="w-full py-5 rounded-[2rem] bg-solar-gradient text-black font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {isGeneratingImage ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Dreaming...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkle className="w-4 h-4" />
                                                    Commence Generation
                                                </>
                                            )}
                                        </button>

                                        {generatedImage && (
                                            <div className="relative rounded-3xl overflow-hidden border border-white/10 group">
                                                <img src={generatedImage} alt="Generated Asset" className="w-full h-64 object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                    <a href={generatedImage} download="asset.png" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform">
                                                        <Download className="w-5 h-5" />
                                                    </a>
                                                    <button onClick={() => { setIsArtStudioOpen(false); /* Logic to insert into code could go here */ }} className="p-3 rounded-full bg-solar-gradient text-black hover:scale-110 transition-transform">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 p-4 md:p-8 relative overflow-hidden bg-foreground/[0.01] flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-3">
                            {['preview', 'code'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={cn(
                                        "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                                        activeTab === tab ? "bg-foreground text-background shadow-2xl" : "text-foreground/40 hover:bg-foreground/5"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleGitHubDeploy}
                            disabled={!projectId}
                            className="px-8 py-3 rounded-2xl bg-solar-gradient text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                        >
                            <Rocket className="w-4 h-4" />
                            Publish
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "preview" ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={cn(
                                    "relative transition-all duration-500 ease-in-out glass rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col",
                                    deviceType === 'mobile' ? "w-[375px] h-[667px]" :
                                        deviceType === 'tablet' ? "w-[768px] h-[1024px]" : "w-full h-full"
                                )}
                            >
                                <div className="h-6 w-full bg-foreground/5 flex items-center justify-center gap-1.5 border-b border-foreground/5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-solar-red/30" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-solar-orange/30" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-solar-yellow/30" />
                                </div>

                                <div className="flex-1 relative bg-background">
                                    {isBuilding && (
                                        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center space-y-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-solar-gradient blur-2xl opacity-20 animate-pulse" />
                                                <Loader2 className="w-12 h-12 text-solar-orange animate-spin relative z-10" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Syncing Neural Link</h3>
                                                <p className="text-[10px] text-foreground/40 font-medium uppercase tracking-[0.2em]">Compiling architecture in real-time...</p>
                                            </div>
                                        </div>
                                    )}

                                    {projectData ? (
                                        <iframe
                                            src={`/preview/${projectId}?theme=${theme}&inspector=${isInspectorActive}`}
                                            className="w-full h-full border-none"
                                            title="Live Preview"
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8 md:p-12 space-y-10 relative overflow-hidden bg-background">
                                            <div className="absolute inset-0 bg-solar-gradient opacity-[0.02] pointer-events-none" />

                                            <div className="relative">
                                                <div className="absolute inset-0 bg-solar-gradient blur-3xl opacity-20 animate-pulse" />
                                                <div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-[2.5rem] bg-solar-gradient flex items-center justify-center p-6 md:p-8 shadow-2xl shadow-solar-orange/20">
                                                    <Rocket className="w-full h-full text-black" />
                                                </div>
                                            </div>

                                            <div className="space-y-4 relative z-10 max-w-lg">
                                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-tight">Neural <br /><span className="text-gradient-solar">Project.</span></h2>
                                                <p className="text-foreground/40 font-medium text-[10px] md:text-sm leading-relaxed px-4 uppercase tracking-[0.2em]">
                                                    Awaiting Neural Command...
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Terminal Overlay */}
                                <AnimatePresence>
                                    {showTerminal && (
                                        <motion.div
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "100%" }}
                                            className="absolute bottom-0 inset-x-0 h-48 bg-black/90 backdrop-blur-xl border-t border-white/5 z-50 font-mono text-[10px] overflow-hidden flex flex-col"
                                        >
                                            <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Terminal className="w-3.5 h-3.5 text-solar-orange" />
                                                    <span className="font-bold text-white/40 uppercase tracking-widest">Neural Link Console</span>
                                                </div>
                                                <button onClick={() => setShowTerminal(false)} className="text-white/20 hover:text-white">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1">
                                                {logs.map((log, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                                                        <span className={cn(
                                                            log.includes("ERROR") ? "text-solar-red" :
                                                                log.includes("Done") ? "text-green-400" : "text-white/60"
                                                        )}>
                                                            {log.includes("ERROR") ? "✖" : "›"} {log}
                                                        </span>
                                                    </div>
                                                ))}
                                                {isBuilding && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                                                        <span className="text-solar-orange animate-pulse">› Processing neural buffer...</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Ultra Controls Bar (Time Travel & Console) */}
                                <div className="mt-8 w-full max-w-4xl self-center flex items-center gap-6 px-8 py-4 glass rounded-[2rem] border border-foreground/5 shadow-xl relative z-40 mb-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="flex items-center gap-2 text-solar-orange">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Time Travel</span>
                                        </div>
                                        <div className="flex-1 h-1.5 bg-foreground/5 rounded-full relative overflow-hidden group cursor-all-scroll">
                                            <div
                                                className="absolute inset-y-0 left-0 bg-solar-gradient rounded-full transition-all duration-300"
                                                style={{ width: `${(historyIndex + 1) * 10}%` }}
                                            />
                                            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-4 h-4 bg-white border-4 border-solar-orange rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground/40 font-mono">V{12}.{historyIndex}</span>
                                    </div>

                                    <div className="h-8 w-px bg-foreground/5" />

                                    <button
                                        onClick={() => setShowTerminal(!showTerminal)}
                                        className={cn(
                                            "flex items-center gap-3 px-6 py-2 rounded-xl transition-all",
                                            showTerminal ? "bg-foreground text-background shadow-lg" : "bg-foreground/5 hover:bg-foreground/10 text-foreground/60"
                                        )}
                                    >
                                        <Terminal className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Console</span>
                                    </button>
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
