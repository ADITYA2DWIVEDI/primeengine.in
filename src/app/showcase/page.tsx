"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUpRight, Github, ExternalLink, Zap, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = ({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2rem] px-6 py-4 md:px-8 shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-2">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-solar-gradient flex items-center justify-center shadow-[0_0_15px_rgba(255,77,77,0.5)]">
                            <Zap className="w-5 h-5 text-black fill-black" />
                        </div>
                        <span className="text-lg md:text-xl font-bold tracking-tight uppercase">Prime Engine</span>
                    </a>
                </div>

                <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
                    <a href="/" className="hover:text-foreground transition-colors">Product</a>
                    <a href="/showcase" className="text-foreground transition-colors">Showcase</a>
                    <a href="/docs" className="hover:text-foreground transition-colors">Documentation</a>
                    <div className="w-[1px] h-4 bg-foreground/10" />
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform">
                        Launch App
                    </button>
                </div>

                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-4 right-4 mt-4 glass rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl"
                    >
                        <a href="/" className="text-xl font-bold uppercase tracking-widest text-center" onClick={() => setIsMenuOpen(false)}>Product</a>
                        <a href="/showcase" className="text-xl font-bold uppercase tracking-widest text-center" onClick={() => setIsMenuOpen(false)}>Showcase</a>
                        <a href="/docs" className="text-xl font-bold uppercase tracking-widest text-center" onClick={() => setIsMenuOpen(false)}>Documentation</a>
                        <hr className="border-foreground/5" />
                        <button className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest">Launch App</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const ShowcaseHero = () => (
    <div className="relative pt-40 pb-20 md:pt-56 md:pb-32 px-6 md:px-8 text-center space-y-8 max-w-5xl mx-auto">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass border-solar-orange/30 text-[10px] font-black uppercase text-solar-orange tracking-[0.3em] italic"
        >
            <Sparkles className="w-4 h-4" />
            The Neural Exhibition
        </motion.div>

        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] md:leading-[0.8] italic text-foreground">
            Beautiful <br />
            <span className="text-gradient-solar">Apps.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-foreground/40 font-medium tracking-tight">
            See what people are building with Prime Engine. Every app is fast,
            beautiful, and ready to use in the real world.
        </p>
    </div>
);

const ShowcaseItem = ({ category, name, desc, stats, color, i }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        viewport={{ once: true }}
        whileHover={{
            y: -15,
            rotateX: 5,
            rotateY: -5,
            scale: 1.02,
            transition: { duration: 0.3 }
        }}
        className="group relative rounded-[3rem] glass overflow-hidden border-foreground/5 p-8 md:p-10 space-y-8 flex flex-col h-full shadow-2xl transition-all duration-500 cursor-pointer preserve-3d"
    >
        <div className="flex items-start justify-between">
            <div className="space-y-4">
                <span className="px-4 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 text-[9px] font-black uppercase tracking-widest text-solar-orange">{category}</span>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-none">{name}</h3>
            </div>
            <div className={cn("p-4 rounded-2xl bg-foreground/5 group-hover:bg-solar-gradient text-foreground group-hover:text-black transition-all", color)}>
                <ArrowUpRight className="w-6 h-6" />
            </div>
        </div>

        <p className="text-foreground/40 font-medium text-sm md:text-base leading-relaxed flex-1">
            {desc}
        </p>

        <div className="pt-8 border-t border-foreground/5 grid grid-cols-2 gap-4">
            {Object.entries(stats).map(([key, val]: any) => (
                <div key={key}>
                    <p className="text-[10px] font-black uppercase text-foreground/20 tracking-widest">{key}</p>
                    <p className="text-lg font-black italic">{val}</p>
                </div>
            ))}
        </div>

        <div className="flex gap-4 pt-4">
            <button className="flex-1 py-4 rounded-2xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-solar-gradient hover:text-black transition-all">Launch Preview</button>
            <button className="p-4 rounded-2xl glass hover:bg-foreground/5 transition-all text-foreground/40 hover:text-foreground">
                <Github className="w-5 h-5" />
            </button>
        </div>
    </motion.div>
);

export default function ShowcasePage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark";
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <main className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
            <Navbar theme={theme} toggleTheme={toggleTheme} />

            {/* Animated Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [-100, 100, -100], y: [-50, 50, -50] }}
                    transition={{ duration: 30, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-solar-red/5 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [100, -100, 100], y: [50, -50, 50] }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-solar-orange/5 blur-[120px] rounded-full"
                />
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

            <ShowcaseHero />

            <section className="max-w-7xl mx-auto px-6 md:px-8 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {[
                        {
                            category: "E-Commerce",
                            name: "Solar Storefront",
                            desc: "A high-conversion headless storefront with atomic design and instant page loads.",
                            stats: { "Render": "0.3s", "Core": "Nexus" },
                            color: "group-hover:shadow-[0_0_30px_rgba(255,148,77,0.3)]",
                            i: 0
                        },
                        {
                            category: "Fintech",
                            name: "Quantum Ledger",
                            desc: "Real-time financial dashboard with complex data visualization and military-grade encryption.",
                            stats: { "Update": "10ms", "Nodes": "82k" },
                            color: "group-hover:shadow-[0_0_30px_rgba(255,77,77,0.3)]",
                            i: 1
                        },
                        {
                            category: "SaaS",
                            name: "Atmosphere CRM",
                            desc: "Fully autonomous customer relationship manifest with AI-driven predictive modeling.",
                            stats: { "AI Sync": "True", "Latency": "Low" },
                            color: "group-hover:shadow-[0_0_30_rgba(255,219,77,0.3)]",
                            i: 2
                        },
                        {
                            category: "Real Estate",
                            name: "Nexus Estates",
                            desc: "Futuristic property search engine with interactive 3D floorplan manifestations.",
                            stats: { "Objects": "4.2k", "Refract": "High" },
                            color: "group-hover:shadow-[0_0_30px_rgba(255,148,77,0.3)]",
                            i: 3
                        },
                        {
                            category: "Social",
                            name: "Neural Hive",
                            desc: "A decentralized social grid focused on algorithmic synergy and hyper-personalization.",
                            stats: { "Trust": "100%", "Decen": "Full" },
                            color: "group-hover:shadow-[0_0_30px_rgba(255,77,77,0.3)]",
                            i: 4
                        },
                        {
                            category: "Utility",
                            name: "Gravity Deck",
                            desc: "Command-line interface for atomic infrastructure management and edge deployment.",
                            stats: { "Load": "Insta", "Uptime": "99.9" },
                            color: "group-hover:shadow-[0_0_30_rgba(255,219,77,0.3)]",
                            i: 5
                        }
                    ].map((item, i) => (
                        <ShowcaseItem key={i} {...item} i={i} />
                    ))}
                </div>
            </section>

            <footer className="py-20 border-t border-foreground/5 text-center space-y-8 px-6">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-solar-gradient flex items-center justify-center">
                        <Zap className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tight">Prime Engine</span>
                </div>
                <p className="text-foreground/20 text-sm font-medium">Manifesting the future of software, one atom at a time.</p>
                <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-foreground/40">
                    <a href="#" className="hover:text-foreground">Privacy</a>
                    <a href="#" className="hover:text-foreground">Terms</a>
                    <a href="#" className="hover:text-foreground">Contact</a>
                </div>
            </footer>
        </main>
    );
}
