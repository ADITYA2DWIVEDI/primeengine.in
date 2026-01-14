"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Layout, MessageSquare, Code, Play, Smartphone, Monitor, Tablet,
    Send, Loader2, Info, X, ChevronRight, ChevronLeft,
    MoreHorizontal, RefreshCw, Layers, Sparkles, Zap, Globe, FileCode,
    Settings, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

// --- Types ---
interface Message {
    role: 'user' | 'assistant';
    content: string;
    thought?: string; // New: AI Thought Bubble
}

type Mode = 'build' | 'design' | 'plan' | 'debug';

export default function AppBuilder() {
    // --- State ---
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [mode, setMode] = useState<Mode>('build');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    // Legacy State / Placeholders for compatibility if needed
    const [showConsole, setShowConsole] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    // --- Actions ---
    const handleSend = async () => {
        if (!prompt.trim()) return;

        const newMsg: Message = { role: 'user', content: prompt };
        setMessages(prev => [...prev, newMsg]);
        setPrompt("");
        setIsBuilding(true);

        try {
            // Check if creating new project or updating
            const endpoint = "/api/projects";
            const method = projectId ? "PATCH" : "POST";
            const body = projectId
                ? { projectId, message: newMsg.content }
                : { prompt: newMsg.content, name: "Hercules App" };

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (data.projectId) setProjectId(data.projectId);

            // Simulation of "Thought" process for UI effect
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.message || "I've updated the application based on your request.",
                thought: "Analyzing request... Generating component structure... Updating files..."
            }]);

            if (iframeRef.current) {
                iframeRef.current.src = iframeRef.current.src; // Reload preview
            }

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please try again." }]);
        } finally {
            setIsBuilding(false);
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">

            {/* 1. Left Sidebar (Deep Navigation) */}
            <aside className="w-16 border-r border-border bg-sidebar-bg flex flex-col items-center py-4 gap-4 z-20">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                    <Zap className="w-6 h-6 text-white" />
                </div>

                <NavIcon icon={Layout} active tooltip="Apps" />
                <NavIcon icon={Code} tooltip="Editor" />
                <NavIcon icon={Layers} tooltip="Assets" />
                <NavIcon icon={Settings} tooltip="Settings" />

                <div className="mt-auto flex flex-col gap-4">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                        {session?.user?.name?.[0] || "U"}
                    </div>
                </div>
            </aside>

            {/* 2. Chat Column (Command Center) */}
            <section className="w-[400px] flex flex-col border-r border-border bg-background z-10 shadow-lg md:shadow-none">
                {/* Header */}
                <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">New Chat</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] uppercase font-bold text-muted-foreground tracking-wider">v2.0</span>
                    </div>
                    <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="mt-20 px-8 text-center space-y-4">
                            <h2 className="text-xl font-bold tracking-tight">What will you build?</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {["SaaS Dashboard", "Landing Page", "E-commerce", "Blog"].map(t => (
                                    <button key={t} onClick={() => setPrompt(`Build a ${t}`)} className="p-3 rounded-xl border border-border hover:bg-muted text-xs transition-all text-left">
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {/* Thought Bubble (Assistant Only) */}
                            {msg.thought && (
                                <div className="flex gap-3">
                                    <div className="w-8 flex justify-center"><Sparkles className="w-4 h-4 text-primary animate-pulse" /></div>
                                    <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg italic">
                                        {msg.thought}
                                    </div>
                                </div>
                            )}

                            {/* Message Content */}
                            <div className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-muted uppercase font-bold text-[10px]">
                                    {msg.role === 'user' ? session?.user?.name?.[0] || "U" : <Zap className="w-4 h-4 text-primary" />}
                                </div>
                                <div className={cn(
                                    "px-4 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[85%]",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-muted text-foreground rounded-tl-sm"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isBuilding && (
                        <div className="flex gap-3">
                            <div className="w-8 flex justify-center"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>
                            <div className="text-xs text-muted-foreground">Thinking...</div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-background">
                    <div className="relative rounded-2xl border border-border bg-muted/30 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">

                        {/* Mode Switcher */}
                        <div className="absolute top-2 left-2 z-10">
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as Mode)}
                                className="bg-background text-xs font-medium px-2 py-1 rounded-lg border border-border outline-none cursor-pointer hover:bg-muted transition-colors opacity-80 hover:opacity-100"
                            >
                                <option value="build">Build Mode</option>
                                <option value="design">Design Mode</option>
                                <option value="plan">Plan Mode</option>
                            </select>
                        </div>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Describe your vision..."
                            className="w-full h-24 pt-12 p-3 bg-transparent outline-none resize-none text-sm placeholder:text-muted-foreground/50"
                        />

                        <div className="absolute bottom-2 right-2">
                            <button
                                onClick={handleSend}
                                disabled={!prompt.trim() || isBuilding}
                                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                {isBuilding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Preview Column (Workspace) */}
            <main className="flex-1 flex flex-col bg-muted/20 relative min-w-0">
                {/* Workspace Header */}
                <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4">
                    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                        <DeviceBtn active={device === 'desktop'} icon={Monitor} onClick={() => setDevice('desktop')} />
                        <DeviceBtn active={device === 'tablet'} icon={Tablet} onClick={() => setDevice('tablet')} />
                        <DeviceBtn active={device === 'mobile'} icon={Smartphone} onClick={() => setDevice('mobile')} />
                    </div>

                    <div className="flex-1 max-w-lg mx-4 hidden md:block">
                        <div className="bg-muted/50 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-muted-foreground w-full">
                            <Globe className="w-3 h-3" />
                            <span className="truncate">https://preview.hercules.ai/{projectId || "draft"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab(activeTab === 'preview' ? 'code' : 'preview')}
                            className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors flex items-center gap-2"
                        >
                            {activeTab === 'preview' ? <FileCode className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            {activeTab === 'preview' ? "Code" : "Preview"}
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 shadow-sm transition-all flex items-center gap-2">
                            <Monitor className="w-3.5 h-3.5" /> Publish
                        </button>
                    </div>
                </header>

                {/* Workspace Content */}
                <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative">
                    <div className={cn(
                        "transition-all duration-300 bg-background shadow-2xl border border-border overflow-hidden",
                        device === 'mobile' ? "w-[375px] h-[667px] rounded-[3rem] border-[8px] border-gray-800" :
                            device === 'tablet' ? "w-[768px] h-[1024px] rounded-2xl border" :
                                "w-full h-full rounded-lg border"
                    )}>
                        {activeTab === 'preview' ? (
                            projectId ? (
                                <iframe
                                    ref={iframeRef}
                                    src={`/preview/${projectId}`}
                                    className="w-full h-full bg-white"
                                    title="Preview"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center animate-pulse">
                                        <Monitor className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-sm font-medium">Ready to instantiate...</p>
                                </div>
                            )
                        ) : (
                            <div className="w-full h-full bg-[#1e1e1e] p-4 font-mono text-xs text-blue-300 overflow-auto">
                                <p>{'// File Explorer and Monaco Editor integration pending...'}</p>
                                <p>{'// This view stays clean for now.'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

        </div>
    );
}

function NavIcon({ icon: Icon, active, tooltip }: { icon: any, active?: boolean, tooltip?: string }) {
    return (
        <button className={cn(
            "p-2.5 rounded-xl transition-all group relative",
            active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95"
        )} title={tooltip}>
            <Icon className="w-5 h-5" />
        </button>
    )
}

function DeviceBtn({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 rounded-md transition-all",
                active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}
