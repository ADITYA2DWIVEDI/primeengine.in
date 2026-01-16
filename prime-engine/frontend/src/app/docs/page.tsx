'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Book, Search, ChevronRight, Terminal,
    Code, Cpu, Layers, Zap, Info,
    ArrowRight, MessageSquare, Copy, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

const docSections = [
    {
        title: 'Initialization',
        items: [
            { id: 'intro', name: 'System Introduction' },
            { id: 'setup', name: 'Workspace Configuration' },
            { id: 'auth', name: 'Identity Protocols' },
        ]
    },
    {
        title: 'Core Construction',
        items: [
            { id: 'ai-prompts', name: 'AI Synthesis Commands' },
            { id: 'visual-editor', name: 'Manual Decoupling' },
            { id: 'templates', name: 'Sector Foundations' },
        ]
    },
    {
        title: 'Advanced Operations',
        items: [
            { id: 'deployment', name: 'Tactical Deployment' },
            { id: 'api', name: 'External API Matrix' },
            { id: 'credits', name: 'Resource Allocation' },
        ]
    }
]

export default function DocsPage() {
    const [activeDoc, setActiveDoc] = useState('intro')
    const [searchQuery, setSearchQuery] = useState('')
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-dark-950 text-sans">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-80 md:h-screen md:sticky md:top-0 border-r border-white/5 p-8 overflow-y-auto bg-dark-950/50 backdrop-blur-3xl z-40">
                <div className="mb-10 group">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
                            <Book className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Knowledge Hub</span>
                    </div>
                    <h2 className="text-2xl font-black text-white italic">Technical <span className="text-white/40">Manual</span></h2>
                </div>

                <div className="relative mb-10 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan protocols..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-dark-900 border border-white/5 rounded-2xl pl-12 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary-500/30 transition-all shadow-inner"
                    />
                </div>

                <nav className="space-y-10">
                    {docSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-600 mb-4 ml-2">{section.title}</h4>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveDoc(item.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                            activeDoc === item.id
                                                ? "bg-primary-500/10 border border-primary-500/20 text-white"
                                                : "text-dark-500 hover:text-white hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <span className="text-[11px] font-bold uppercase tracking-tight">{item.name}</span>
                                        {activeDoc === item.id && <ChevronRight className="w-3 h-3 text-primary-400" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto max-w-5xl">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeDoc}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="prose prose-invert max-w-none"
                    >
                        <header className="mb-16 border-b border-white/5 pb-10 italic">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Documentation / {activeDoc}</span>
                            <h1 className="text-5xl md:text-6xl font-black text-white mt-6 tracking-tighter leading-tight uppercase">System <br /> <span className="gradient-text">Introduction.</span></h1>
                            <p className="text-xl text-dark-400 font-medium max-w-2xl mt-8">
                                Prime Engine is a high-fidelity application synthesizer. It bridges the gap between conceptual vision and production codebases.
                            </p>
                        </header>

                        <section className="space-y-12">
                            <div>
                                <h3 className="text-2xl font-black text-white italic mb-4 uppercase tracking-tight">Core Synthesis Matrix</h3>
                                <p className="text-dark-400 font-medium leading-relaxed text-lg">
                                    The platform operates on a three-tier architectural synthesis model. Each request is passed through our internal Prime Intelligence layer, which generates a tactical blueprint consisting of:
                                </p>
                                <ul className="mt-8 space-y-4 list-none p-0">
                                    {[
                                        { icon: Layers, title: "Frontend Synthesis", desc: "Atomic React component structures." },
                                        { icon: Cpu, title: "Backend Synthesis", desc: "Production-grade Node.js service logic." },
                                        { icon: Zap, title: "Infrastructure Layout", desc: "Scalable PostgreSQL schemas and edge rules." },
                                    ].map((spec, i) => (
                                        <li key={i} className="flex gap-4 p-6 bg-dark-900/50 border border-white/5 rounded-[24px]">
                                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                                                <spec.icon className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black italic uppercase tracking-widest text-sm mb-1">{spec.title}</h4>
                                                <p className="text-dark-500 text-sm font-medium">{spec.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white italic mb-6 uppercase tracking-tight">Execution Protocol</h3>
                                <div className="relative group">
                                    <div className="absolute -top-3 right-4 z-10">
                                        <button
                                            onClick={handleCopy}
                                            className="p-2 bg-dark-800 border border-white/10 rounded-lg text-white hover:bg-dark-700 transition-colors flex items-center gap-2 text-[8px] font-black uppercase tracking-widest"
                                        >
                                            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'Captured' : 'Capture Key'}
                                        </button>
                                    </div>
                                    <pre className="p-8 bg-dark-900 border border-white/5 rounded-[24px] overflow-hidden text-primary-400 font-mono text-sm leading-relaxed shadow-inner">
                                        <code>{`// Initialize Prime Engine Core
import { PrimeSynthesizer } from '@prime/engine';

const vision = "A high-fidelity dashboard for satellite telemetry";
const project = await PrimeSynthesizer.forge(vision, {
  fidelity: 'enterprise',
  infrastructure: 'global-edge'
});

console.log(\`Sector ID: \${project.id} initialized.\`);`}</code>
                                    </pre>
                                </div>
                            </div>
                        </section>

                        <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 italic">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-full border border-white/5 bg-dark-900 flex items-center justify-center grayscale">
                                    <Info className="w-6 h-6 text-dark-500" />
                                </div>
                                <p className="text-sm font-medium text-dark-500">Last updated: Sector Cycle 12.04.26</p>
                            </div>
                            <div className="flex gap-4">
                                <button className="btn-secondary px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Community
                                </button>
                                <button className="btn-primary px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    Identity Access <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </footer>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
