"use client";
import React from "react";
import { motion } from "framer-motion";
import { Terminal, Book, Code2, Cpu, Zap, Send, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const DocSection = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: React.ReactNode }) => (
    <motion.section
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="space-y-6 pb-20 border-b border-white/5"
    >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-solar-orange">
                {icon}
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">{title}</h2>
        </div>
        <div className="text-white/40 text-sm font-medium leading-relaxed space-y-4">
            {children}
        </div>
    </motion.section>
);

const CodeBlock = ({ code, label }: { code: string; label: string }) => (
    <div className="group relative rounded-[2rem] overflow-hidden border border-white/5 bg-black mt-6 shadow-2xl">
        <header className="px-6 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-solar-yellow" />
                <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{label}</span>
            </div>
            <button className="text-[9px] font-black uppercase text-white/20 hover:text-white transition-all">Copy</button>
        </header>
        <pre className="p-8 font-mono text-[11px] text-solar-orange/80 overflow-x-auto leading-relaxed">
            {code}
        </pre>
    </div>
);

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-solar-black text-white relative flex">
            {/* Background Grain */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none z-50" />

            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 bottom-0 w-[350px] border-r border-white/5 bg-black/40 backdrop-blur-3xl hidden lg:flex flex-col p-10 space-y-12">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-solar-gradient flex items-center justify-center shadow-lg">
                        <Zap className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-[11px]">Core Manifest</span>
                </div>

                <nav className="space-y-10">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Foundation</h3>
                        <div className="space-y-2">
                            {["Introduction", "Core Principles", "Architecture"].map(item => (
                                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="block text-xs font-bold text-white/40 hover:text-white hover:translate-x-2 transition-all uppercase tracking-widest">{item}</a>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">The Engine</h3>
                        <div className="space-y-2">
                            {["API Reference", "Neural Schemes", "Atomic Components"].map(item => (
                                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="block text-xs font-bold text-white/40 hover:text-white hover:translate-x-2 transition-all uppercase tracking-widest">{item}</a>
                            ))}
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 lg:ml-[350px] p-8 md:p-20 md:pt-40">
                <div className="max-w-4xl mx-auto space-y-32">
                    {/* Hero */}
                    <header className="space-y-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                            <span className="w-12 h-[1px] bg-solar-red" />
                            <span className="text-solar-red font-black text-[10px] uppercase tracking-[0.5em]">Release v1.0.4 Beta</span>
                        </motion.div>
                        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none italic">Technical <br /><span className="text-gradient-solar">Protocols.</span></h1>
                        <p className="text-xl md:text-2xl text-white/30 font-medium tracking-tight leading-relaxed max-w-2xl">
                            The definitive guide to architecting the future using Prime Engine's neural-native interface.
                        </p>
                    </header>

                    {/* Section: Introduction */}
                    <DocSection title="Introduction" icon={<Book className="w-6 h-6" />}>
                        <p>Prime Engine is not just a code generator; it is a <span className="text-white font-bold">Neural Architect</span> designed to bridge the gap between human vision and enterprise-grade software. It translates complex conceptual prompts into optimized full-stack manifestations.</p>
                        <p>Our philosophy is <span className="text-solar-orange italic">Atomic Creation</span>—where every component, database entry, and API route is synthesized as a single, cohesive unit of logic.</p>
                    </DocSection>

                    {/* Section: API Reference */}
                    <DocSection title="API Reference" icon={<Cpu className="w-6 h-6" />}>
                        <p>To interact with the Prime Engine programmatically, use the following REST protocols. All requests require a valid <span className="text-white">Neural Key</span> in the authorization header.</p>
                        <CodeBlock
                            label="POST /api/projects"
                            code={`{
    "prompt": "Build a real-time analytics nexus for IoT devices",
    "name": "Project Omega",
    "architecture": "nexus-v2"
}`}
                        />
                        <p className="mt-8">The system will initiate a three-step orchestration process: <span className="text-solar-red lowercase font-black tracking-widest italic">Schema Synthesis, Component Atomization, and Page Assembly.</span></p>
                    </DocSection>

                    {/* Section: Neural Schemes */}
                    <DocSection title="Neural Schemes" icon={<Layers className="w-6 h-6" />}>
                        <p>Schemes define the relational DNA of your application. Prime Intelligence automatically detects the optimal data structure based on your functional requirements.</p>
                        <CodeBlock
                            label="JSON Schema Manifest"
                            code={`[
    {
        "entity": "UserTerminal",
        "fields": {
            "id": "UUID",
            "access_level": "Protocol",
            "neural_signature": "Signature"
        }
    }
]`}
                        />
                    </DocSection>

                    {/* Footer Call to Action */}
                    <footer className="pt-20 border-t border-white/5 flex flex-col items-center gap-12 text-center pb-40">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none italic">Need deeper <br />manifestations?</h3>
                            <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Connect with our core architectural collective.</p>
                        </div>
                        <button className="px-10 py-4 rounded-2xl bg-solar-gradient text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-solar-orange/20 hover:scale-105 transition-all">Request Priority Access</button>
                    </footer>
                </div>
            </div>

            {/* Mobile Nav Shorthand */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass border-white/10 flex gap-8 backdrop-blur-3xl premium-shadow lg:hidden">
                {["Home", "Showcase", "Docs"].map(nav => (
                    <a key={nav} href={nav === "Home" ? "/" : `/${nav.toLowerCase()}`} className="text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">{nav}</a>
                ))}
            </div>
        </main>
    );
}
