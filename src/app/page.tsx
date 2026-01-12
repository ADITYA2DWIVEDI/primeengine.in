"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Zap, Rocket, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AppBuilder from "@/components/builder/AppBuilder";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-md border-b border-white/10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-solar-gradient flex items-center justify-center shadow-[0_0_15px_rgba(255,77,77,0.5)]">
        <Zap className="w-5 h-5 text-black fill-black" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white uppercase">Prime Engine</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
      <a href="/" className="hover:text-white transition-colors">Product</a>
      <a href="/showcase" className="hover:text-white transition-colors">Showcase</a>
      <a href="/docs" className="hover:text-white transition-colors">Documentation</a>
      <a href="#" className="px-5 py-2 rounded-full glass hover:bg-white/10 text-white transition-all">Log in</a>
      <button className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform">
        Start Building
      </button>
    </div>
  </nav>
);

const Footnote = () => (
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-white/40 text-sm">
    <p>Powered by Prime Intelligence • Built for 2026</p>
  </div>
);

const AnimatedOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 100, 0],
        y: [0, 50, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-solar-red/10 blur-[120px] rounded-full"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        x: [0, -120, 0],
        y: [0, -80, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-1/4 -right-24 w-[600px] h-[600px] bg-solar-orange/10 blur-[120px] rounded-full"
    />
    <motion.div
      animate={{
        opacity: [0.05, 0.1, 0.05],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-solar-yellow/5 blur-[160px] rounded-full"
    />
  </div>
);

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <AppBuilder initialPrompt={prompt} />;
  }

  return (
    <main className="relative min-h-screen bg-solar-black overflow-hidden flex flex-col items-center px-4 pt-32 pb-20">
      <Navbar />
      <AnimatedOrbs />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-[10px] font-black italic text-solar-orange border-solar-orange/30 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,148,77,0.1)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Next-Gen AI Neural Engine
          </motion.div>

          <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter text-white uppercase leading-[0.8] drop-shadow-2xl">
            Atomic <br />
            <span className="text-gradient-solar">Creation.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium tracking-tight leading-relaxed">
            Prime Engine architecturally evolves your vision into industrial-grade softare.
            <span className="text-white/80 block mt-2">No code. No limits. Just Pure Intelligence.</span>
          </p>
        </motion.div>

        {/* AI Prompt Input Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-3xl mx-auto group"
        >
          <div className="absolute -inset-2 bg-solar-gradient rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 transition-all duration-700" />
          <div className="relative glass rounded-[2.5rem] p-5 flex items-center gap-6 premium-shadow border-white/10 group-focus-within:border-solar-orange/40 transition-all">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-solar-yellow"
            >
              <Wand2 className="w-8 h-8" />
            </motion.div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Design a futuristic AI-driven logistics dashboard..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 text-xl font-medium resize-none py-3 h-14 leading-tight"
            />
            <button
              onClick={() => prompt.length > 5 && setShowBuilder(true)}
              className={cn(
                "w-16 h-16 rounded-2xl transition-all duration-500 flex items-center justify-center transform",
                prompt.length > 5
                  ? "bg-solar-gradient text-black shadow-[0_0_30px_rgba(255,148,77,0.5)] scale-100 rotate-0"
                  : "bg-white/5 text-white/10 scale-90 -rotate-12"
              )}
            >
              <ArrowRight className="w-8 h-8 font-black" />
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4 pt-6"
        >
          {["SaaS Dashboard", "Portfolio Site", "Real-estate App", "Inventory Manager"].map((tmp, i) => (
            <motion.button
              key={tmp}
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={() => { setPrompt(`Build a ${tmp}`); setShowBuilder(true); }}
              className="px-6 py-2.5 rounded-full glass text-[10px] font-black text-white/40 hover:text-white border-white/5 hover:border-solar-red/30 transition-all uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(255,77,77,0.2)]"
            >
              # {tmp}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Showcase Preview */}
      <section className="relative z-10 max-w-7xl w-full px-8 py-40">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <div className="text-solar-red font-black text-xs uppercase tracking-[0.4em]">Engineered Excellence</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Built with <br /><span className="text-gradient-solar">Prime Logic.</span></h2>
          </div>
          <p className="text-white/40 max-w-md text-sm font-medium leading-relaxed">Prime Engine uses proprietary neural architectures to ensure every line of code is performance-optimized and scalable from day zero.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { tag: "E-Commerce", title: "Solar Storefront", img: "🛍️" },
            { tag: "Fintech", title: "Quantum Ledger", img: "💳" },
            { tag: "SaaS", title: "Atmosphere CRM", img: "☁️" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group relative h-[400px] rounded-[3rem] overflow-hidden border border-white/5 glass"
            >
              <div className="absolute inset-0 bg-solar-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="absolute top-12 left-12 space-y-2 z-20">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-solar-orange tracking-widest">{item.tag}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic">{item.title}</h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-8xl grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">
                {item.img}
              </div>
              <div className="absolute bottom-12 left-12 right-12 z-20">
                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Launch Preview</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Features */}
      <section className="relative z-10 max-w-7xl w-full px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { icon: <Zap />, title: "Hyper-Speed", desc: "Atomic generation in sub-60 seconds. Deploy at the speed of thought." },
          { icon: <Code2 />, title: "Neural Logic", desc: "Proprietary AI architectures that write better code than seniors." },
          { icon: <Rocket />, title: "Edge Ready", desc: "One-click deployment to 300+ edge nodes globally for zero latency." },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group p-10 rounded-[3rem] glass border-white/5 space-y-6 hover:border-solar-red/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,77,77,0.05)]"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-solar-gradient flex items-center justify-center text-black shadow-2xl shadow-solar-red/20 group-hover:scale-110 transition-transform">
              <div className="w-7 h-7">{f.icon}</div>
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter">{f.title}</h3>
            <p className="text-white/30 text-base leading-relaxed font-medium">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 max-w-6xl w-full px-8 py-40 text-center space-y-24">
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-solar-orange font-black text-xs uppercase tracking-[0.5em]">Global Pricing</div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">Universal <span className="text-gradient-solar">Access.</span></h2>
          <p className="text-white/40 text-xl font-medium">Simple, transparent, and built for growth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-16 rounded-[4rem] glass border-white/10 text-left space-y-10 relative overflow-hidden"
          >
            <div className="space-y-3">
              <h3 className="text-3xl font-black uppercase italic text-white/80">Standard</h3>
              <div className="text-7xl font-black tracking-tighter">$0<span className="text-2xl text-white/20 font-medium">/MO</span></div>
            </div>
            <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-white/40">
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-solar-red" /> 3 AI Projects</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-solar-red" /> Standard UI Logic</li>
              <li className="flex items-center gap-4"><div className="w-1.5 h-1.5 rounded-full bg-solar-red" /> Global Community</li>
            </ul>
            <button className="w-full py-6 rounded-3xl border-2 border-white/5 hover:bg-white/5 font-black uppercase tracking-[0.2em] transition-all text-[11px]">Initiate Setup</button>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-16 rounded-[4rem] bg-solar-black border-2 border-solar-orange text-left space-y-10 relative overflow-hidden shadow-[0_0_60px_rgba(255,148,77,0.15)]"
          >
            <div className="absolute top-0 right-0 p-12 text-solar-orange opacity-10">
              <Zap className="w-40 h-40" />
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black uppercase italic text-solar-orange">Prime Elite</h3>
                <span className="px-4 py-1.5 bg-solar-orange text-black text-[10px] font-black rounded-full uppercase tracking-widest">Recommended</span>
              </div>
              <div className="text-7xl font-black tracking-tighter text-white">$29<span className="text-2xl text-white/20 font-medium italic">/MO</span></div>
            </div>
            <ul className="space-y-5 text-sm font-bold uppercase tracking-widest text-white/80 relative z-10">
              <li className="flex items-center gap-4"><Zap className="w-4 h-4 text-solar-orange" /> Unlimited Neural Builds</li>
              <li className="flex items-center gap-4"><Zap className="w-4 h-4 text-solar-orange" /> Direct Domain Binding</li>
              <li className="flex items-center gap-4"><Zap className="w-4 h-4 text-solar-orange" /> Full Source Manifest</li>
              <li className="flex items-center gap-4"><Zap className="w-4 h-4 text-solar-orange" /> Priority Edge Access</li>
            </ul>
            <button className="w-full py-6 rounded-3xl bg-solar-gradient text-black font-black uppercase tracking-[0.2em] transition-all text-[11px] shadow-2xl shadow-solar-orange/40 hover:scale-[1.02]">Access Neural Grid</button>
          </motion.div>
        </div>
      </section>

      <Footnote />
    </main>
  );
}
