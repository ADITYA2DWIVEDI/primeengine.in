"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Code2, Layers, Globe, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const ShowcaseCard = ({ item, index }: { item: any; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative h-[450px] rounded-[3rem] overflow-hidden border border-white/5 glass bg-[#050505]/40"
    >
        <div className="absolute inset-0 bg-solar-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-700" />

        {/* Category Badge */}
        <div className="absolute top-10 left-10 z-20">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase text-solar-orange tracking-[0.2em] backdrop-blur-md">
                {item.category}
            </span>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-10 right-10 z-20 flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <Globe className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                <Shield className="w-4 h-4" />
            </div>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-10 space-y-6 z-20">
            <div className="space-y-2">
                <h3 className="text-4xl font-black uppercase tracking-tighter italic text-white drop-shadow-xl">{item.title}</h3>
                <p className="text-white/30 text-xs font-medium uppercase tracking-[0.1em]">{item.description}</p>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 py-4 rounded-2xl bg-solar-gradient text-black text-[10px] font-black uppercase tracking-widest shadow-xl shadow-solar-orange/20 hover:scale-105 transition-all">Launch Preview</button>
                <button className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <Code2 className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Background Visual */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 grayscale group-hover:grayscale-0">
            <span className="text-9xl">{item.icon}</span>
        </div>
    </motion.div>
);

export default function ShowcasePage() {
    const items = [
        { category: "Fintech", title: "Aura Pay", description: "Hyper-secure quantum payment gateway", icon: "💎" },
        { category: "SaaS", title: "Lumina CRM", description: "AI-driven customer relationship intelligence", icon: "🛰️" },
        { category: "E-Commerce", title: "Nova Store", description: "Atomic commerce with instant fulfillment", icon: "📦" },
        { category: "Logistics", title: "Swift Fleet", description: "Neural routing for global supply chains", icon: "🚛" },
        { category: "Health", title: "Pulse AI", description: "Real-time hemodynamic monitoring network", icon: "❤️" },
        { category: "Estate", title: "Skyline", description: "Visual property intelligence & mapping", icon: "🏙️" },
    ];

    return (
        <main className="min-h-screen bg-solar-black text-white relative overflow-hidden px-8 pt-40 pb-20">
            {/* Background Orbs */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-solar-red/5 blur-[160px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-solar-orange/5 blur-[160px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-24">
                {/* Header */}
                <header className="space-y-6 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-[10px] font-black italic text-solar-red border-solar-red/30 uppercase tracking-[0.3em]">
                        <Layers className="w-3.5 h-3.5" />
                        Neural Gallery
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">The <span className="text-gradient-solar">Artifacts.</span></h1>
                    <p className="text-xl md:text-2xl text-white/40 font-medium tracking-tight leading-relaxed">
                        A collection of industrial-grade applications architected and deployed by Prime Intelligence.
                        <span className="text-white/80 block mt-2">Explore the potential of atomic creation.</span>
                    </p>
                </header>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map((item, i) => (
                        <ShowcaseCard key={i} item={item} index={i} />
                    ))}
                </div>

                {/* Call to action */}
                <section className="pt-20 text-center">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-20 rounded-[4rem] bg-solar-gradient text-black relative overflow-hidden group shadow-2xl shadow-solar-orange/20"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-20 pointer-events-none">
                            <Zap className="w-60 h-60" />
                        </div>
                        <div className="space-y-8 relative z-10">
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Ready to <br />Architect?</h2>
                            <button className="px-12 py-5 rounded-2xl bg-black text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">Start Your Engine Now</button>
                        </div>
                    </motion.div>
                </section>
            </div>

            {/* Navbar Shorthand for simple navigation */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full glass border-white/10 flex gap-8 backdrop-blur-2xl premium-shadow">
                {["Home", "Showcase", "Docs", "Pricing"].map(nav => (
                    <a key={nav} href={nav === "Home" ? "/" : `/${nav.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">{nav}</a>
                ))}
            </div>
        </main>
    );
}
