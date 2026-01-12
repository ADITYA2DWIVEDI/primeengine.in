"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Code, Zap, ChevronRight, Search, Terminal, Cpu, Globe, Menu, X, Sun, Moon } from "lucide-react";
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
                    <a href="/showcase" className="hover:text-foreground transition-colors">Showcase</a>
                    <a href="/docs" className="hover:text-foreground transition-colors">Documentation</a>
                    <div className="w-[1px] h-4 bg-foreground/10" />
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-foreground/5 transition-colors"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform">
                        Get Started
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
                        <button className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest">Get Started</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const SidebarItem = ({ icon: Icon, label, active }: any) => (
    <button className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all",
        active ? "bg-solar-gradient text-black shadow-lg" : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
    )}>
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

export default function DocsPage() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

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

    return (
        <main className="relative min-h-screen bg-background text-foreground transition-colors duration-500 flex flex-col">
            <Navbar theme={theme} toggleTheme={toggleTheme} />

            <div className="flex-1 flex pt-24 md:pt-32">
                {/* Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            {isMobile && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                                />
                            )}
                            <motion.aside
                                initial={isMobile ? { x: -300 } : false}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                className="fixed lg:sticky top-32 h-[calc(100vh-8rem)] w-[280px] p-6 space-y-8 glass border-r-0 lg:border-r border-foreground/5 flex flex-col z-50 lg:z-10 ml-0 lg:ml-8 rounded-[2.5rem] lg:rounded-none lg:bg-transparent"
                            >
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] px-4">Core Concepts</p>
                                    <SidebarItem icon={Book} label="Getting Started" active />
                                    <SidebarItem icon={Cpu} label="How it Works" />
                                    <SidebarItem icon={Terminal} label="Easy Commands" />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] px-4">Development</p>
                                    <SidebarItem icon={Code} label="Code Help" />
                                    <SidebarItem icon={Globe} label="Go Live" />
                                    <SidebarItem icon={Zap} label="Speed Up" />
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Content */}
                <div className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-12 space-y-16">
                    {!isSidebarOpen && (
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="fixed bottom-8 left-8 p-4 bg-solar-gradient text-black rounded-2xl shadow-2xl z-50 lg:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    )}

                    <section className="space-y-8">
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">How to <br /><span className="text-gradient-solar">Build.</span></h1>
                        <p className="text-lg md:text-xl text-foreground/40 font-medium leading-relaxed tracking-tight">
                            Learn how to use Prime Engine to build amazing things.
                            From starting your first project to going live, we've got you covered.
                        </p>
                    </section>

                    <section className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic underline decoration-solar-orange decoration-4 underline-offset-8">Quick Start</h2>
                            <p className="text-foreground/60 font-medium">Start building by typing what you want or using our simple command line tool.</p>
                        </div>

                        <div className="p-8 md:p-10 glass rounded-[3rem] border-foreground/5 bg-foreground/[0.02] space-y-6">
                            <div className="flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-solar-orange" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Try this command</span>
                            </div>
                            <pre className="p-6 md:p-8 rounded-2xl bg-black font-mono text-xs md:text-sm text-solar-yellow/90 overflow-x-auto border border-white/10 shadow-2xl">
                                <code>{`$ npx prime-engine init project-alpha\n$ prime-engine architect --prompt "SaaS dashboard"\n$ prime-engine manifest --deploy --edge`}</code>
                            </pre>
                        </div>
                    </section>

                    <section className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic underline decoration-solar-red decoration-4 underline-offset-8">Step by Step</h2>
                            <p className="text-foreground/60 font-medium">See how Prime Engine builds your app from start to finish.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            {[
                                { step: "01", title: "Plan", desc: "AI maps out your app's structure and needs." },
                                { step: "02", title: "Logic", desc: "AI builds the smart parts of your application." },
                                { step: "03", title: "Design", desc: "Beautiful UI components are created instantly." },
                                { step: "04", title: "Go Live", desc: "One click and your app is ready for the world." },
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-[2.5rem] glass border-foreground/5 hover:border-solar-orange/30 transition-all flex flex-col gap-4">
                                    <span className="text-4xl font-black text-solar-orange opacity-20">{item.step}</span>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{item.title}</h3>
                                    <p className="text-sm text-foreground/40 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="pt-20 pb-10 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">© 2026 Prime Intelligence Manifest</p>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                            <a href="#" className="hover:text-foreground">Support</a>
                            <a href="#" className="hover:text-foreground">GitHub</a>
                            <a href="#" className="hover:text-foreground">Discord</a>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}
