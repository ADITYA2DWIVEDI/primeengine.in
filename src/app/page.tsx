import React, { useState } from "react";
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
      <a href="#" className="hover:text-white transition-colors">Product</a>
      <a href="#" className="hover:text-white transition-colors">Showcase</a>
      <a href="#" className="hover:text-white transition-colors">Pricing</a>
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

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <AppBuilder initialPrompt={prompt} />;
  }

  return (
    <main className="relative min-h-screen bg-solar-black overflow-hidden flex flex-col items-center justify-center px-4">
      <Navbar />

      {/* Decorative Background Orbs */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-solar-red/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-solar-orange/20 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-solar-yellow/5 blur-[160px] rounded-full" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-solar-orange border-solar-orange/20 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Native App Builder
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9]">
            Shape your ideas <br />
            <span className="text-gradient-solar">into reality.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium">
            Prime Engine transforms your words into production-ready full-stack applications in seconds. No code, just vision.
          </p>
        </motion.div>

        {/* AI Prompt Input Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-3xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-solar-gradient rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition-opacity duration-500" />
          <div className="relative glass rounded-[2rem] p-4 flex items-center gap-4 premium-shadow border-white/20">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-solar-yellow">
              <Wand2 className="w-6 h-6" />
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Build me a modern SaaS dashboard for a crypto exchange..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 text-lg resize-none py-2 h-12 leading-tight"
            />
            <button
              onClick={() => prompt.length > 5 && setShowBuilder(true)}
              className={cn(
                "p-4 rounded-2xl transition-all duration-300 flex items-center justify-center",
                prompt.length > 5
                  ? "bg-solar-gradient text-black shadow-[0_0_20px_rgba(255,148,77,0.4)]"
                  : "bg-white/5 text-white/20"
              )}
            >
              <ArrowRight className="w-6 h-6 font-bold" />
            </button>
          </div>
        </motion.div>

        {/* Quick Links / Templates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 pt-4"
        >
          {["SaaS Dashboard", "Portfolio Site", "Real-estate App", "Inventory Manager"].map((tmp) => (
            <button
              key={tmp}
              onClick={() => { setPrompt(`Build a ${tmp}`); setShowBuilder(true); }}
              className="px-4 py-2 rounded-full glass text-xs font-bold text-white/50 hover:text-white border-white/10 hover:border-white/20 transition-all uppercase tracking-wider"
            >
              {tmp}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl w-full px-8 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Zap />, title: "Hyper-Speed", desc: "From concept to code in under 60 seconds." },
          { icon: <Code2 />, title: "Full-Stack", desc: "Databases, Auth, and APIs generated automatically." },
          { icon: <Rocket />, title: "Instant Deployment", desc: "One-click publish to the global edge network." },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-8 rounded-[2.5rem] glass border-white/5 space-y-4 hover:border-solar-red/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-solar-gradient flex items-center justify-center text-black shadow-lg shadow-solar-red/20">
              {f.icon}
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">{f.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 max-w-5xl w-full px-8 py-32 text-center space-y-16">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Choose your <span className="text-gradient-solar">Core.</span></h2>
          <p className="text-white/40 text-lg">Scalable pricing for builders of all levels.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-12 rounded-[3rem] glass border-white/10 text-left space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-solar-red/20 transition-colors">
              <Code2 className="w-32 h-32" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase">Standard</h3>
              <div className="text-5xl font-black">$0<span className="text-lg text-white/40">/mo</span></div>
            </div>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-solar-orange" /> 3 AI Projects</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-solar-orange" /> Basic UI Templates</li>
              <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-solar-orange" /> Public Hosting</li>
            </ul>
            <button className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 font-bold uppercase tracking-widest transition-all">Start Free</button>
          </div>
          <div className="p-12 rounded-[3rem] bg-solar-black border-2 border-solar-orange text-left space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-solar-orange/10">
              <Zap className="w-32 h-32" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase">Prime</h3>
                <span className="px-3 py-1 bg-solar-orange text-black text-[10px] font-black rounded-full uppercase">Most Popular</span>
              </div>
              <div className="text-5xl font-black">$29<span className="text-lg text-white/40">/mo</span></div>
            </div>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-solar-orange" /> Unlimited AI Projects</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-solar-orange" /> Custom Domain Sync</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-solar-orange" /> Full Source Code Export</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-solar-orange" /> 10GB Asset Storage</li>
            </ul>
            <button className="w-full py-4 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-solar-orange/30">Get Prime Access</button>
          </div>
        </div>
      </section>

      <Footnote />
    </main>
  );
}
