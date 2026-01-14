"use client";
// Prime Engine v1.0.4 - Production Release
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Wand2, Zap, Rocket, Code2, Menu, X, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import AppBuilder from "@/components/builder/AppBuilder";
import { signIn, signOut, useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useTheme, ThemeProvider } from "@/components/ThemeProvider";
import VibeCodeShowcase from "@/components/landing/VibeCodeShowcase";

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

const NavbarContent = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2rem] px-6 py-4 md:px-8 shadow-2xl backdrop-blur-xl bg-black/40 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-solar-gradient flex items-center justify-center p-1.5">
            <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight uppercase text-white">Prime Engine</span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="/" className="hover:text-white transition-colors">Product</a>
          <a href="/showcase" className="hover:text-white transition-colors">Showcase</a>
          <div className="w-[1px] h-4 bg-white/10" />

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-bold">{session.user?.name}</span>
              {/* @ts-ignore */}
              {session.user?.isPro && <span className="px-2 py-0.5 bg-solar-gold text-black text-[9px] font-black uppercase rounded">PRO</span>}
              <button onClick={() => signOut()} className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white">Log out</button>
              <a href="/builder" className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform">
                Open Builder
              </a>
            </div>
          ) : (
            <>
              <a href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-white">Log in</a>
              <a
                href="/login"
                className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform"
              >
                Start Building
              </a>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-4 text-white">
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
            className="lg:hidden absolute top-full left-4 right-4 mt-4 glass rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl bg-[#0a0a0a] border border-white/10"
          >
            <a href="/" className="text-white text-xl font-bold uppercase tracking-widest text-center" onClick={() => setIsMenuOpen(false)}>Product</a>
            <hr className="border-white/5" />

            {session ? (
              <a href="/builder" className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest text-center">Open Builder</a>
            ) : (
              <a href="/login" className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest text-center">Start Building</a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Navbar = () => {
  return (
    <SessionProvider>
      <NavbarContent />
    </SessionProvider>
  )
}

const Footnote = () => (
  <div className="px-8 py-12 text-center text-foreground/40 text-sm">
    <p>© 2026 Prime Intelligence • Neural Architecture manifest.</p>
  </div>
);

export default function LandingPage() {
  return (
    <SessionProvider>
      <LandingPageContent />
    </SessionProvider>
  );
}

function LandingPageContent() {
  const [prompt, setPrompt] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <AppBuilder initialPrompt={prompt} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col bg-[#050505] text-white selection:bg-solar-orange/30">
      <Navbar />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,148,77,0.05),_rgba(0,0,0,0)_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay" />

      {/* Hero Content */}
      <div className="relative z-10 w-full pt-32 md:pt-40 pb-20 flex flex-col items-center">

        {/* Text Layer */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center space-y-8 relative z-20 mb-[-100px] md:mb-[-150px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-solar-orange mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              v2.0 Neural Engine Live
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              Build with <br />
              <span className="text-solar-gradient">Vibration.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
              Describe your app. Watch it build itself. Connected to real backend infrastructure instantly.
            </p>
          </motion.div>
        </div>

        {/* 3D Visualization Layer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="w-full max-w-[1400px] mx-auto h-[600px] md:h-[900px] relative z-10 pointer-events-none"
        >
          <VibeCodeShowcase />
        </motion.div>

        {/* AI Prompt Input Bar (Floating over 3D scene bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative z-30 w-full max-w-2xl px-6 -mt-20 md:-mt-40"
        >
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-solar-gradient rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative bg-black/80 backdrop-blur-xl rounded-[2.5rem] p-2 pl-6 flex items-center gap-4 border border-white/10 group-focus-within:border-solar-orange/50 transition-all shadow-2xl">
              <Wand2 className="w-6 h-6 text-solar-orange" />
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && prompt.length > 2 && window.location.assign('/login')}
                placeholder="Ex: A fitness tracker with goals..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 text-lg font-medium h-14"
              />
              <button
                onClick={() => window.location.assign('/login')}
                className="w-14 h-14 rounded-[2rem] bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>


      {/* Showcase Grid */}
      <section className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-20 md:py-40">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="space-y-4">
            <div className="text-solar-red font-black text-xs uppercase tracking-[0.4em]">Made by AI</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none italic">Choose a <br /><span className="text-gradient-solar">Template.</span></h2>
          </div>
          <p className="text-foreground/40 max-w-md text-sm md:text-base font-medium leading-relaxed">Starting is easy. Just pick a style and let the AI build the rest for you instantly.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { tag: "E-Commerce", title: "Solar Storefront", img: "🛍️" },
            { tag: "Fintech", title: "Quantum Ledger", img: "💳" },
            { tag: "SaaS", title: "Atmosphere CRM", img: "☁️" },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{
                y: -15,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              className="group relative h-[350px] md:h-[400px] rounded-[3rem] overflow-hidden border border-white/5 glass cursor-pointer preserve-3d shadow-2xl"
            >
              <div className="absolute inset-0 bg-solar-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
              <div className="absolute top-10 left-10 space-y-2 z-20">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-solar-orange tracking-widest">{item.tag}</span>
                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic">{item.title}</h3>
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-7xl md:text-8xl grayscale opacity-20 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700">
                {item.img}
              </div>
              <div className="absolute bottom-10 left-10 right-10 z-20">
                <button
                  onClick={() => window.location.href = '/showcase'}
                  className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-solar-gradient hover:text-black hover:border-transparent transition-all"
                >
                  See it Work
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Temporarily disabled for SSR fix
      <FeaturesSection />
      <HowItWorksSection />
      */}

      {/* Pricing / CTA */}
      <section className="relative z-10 w-full max-w-5xl px-6 md:px-8 py-20 md:py-40 text-center space-y-12">
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">Simple <span className="text-gradient-solar">Pricing.</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 md:p-16 rounded-[4rem] glass text-left space-y-8">
            <h3 className="text-2xl md:text-3xl font-black uppercase italic">Free Plan</h3>
            <p className="text-4xl md:text-6xl font-black">$0</p>
            <button className="w-full py-5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 text-foreground font-black uppercase tracking-widest transition-all">Get Started</button>
          </div>
          <div className="p-10 md:p-16 rounded-[4rem] bg-foreground text-background border-2 border-solar-orange text-left space-y-8 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <h3 className="text-2xl md:text-3xl font-black uppercase italic text-solar-orange">Pro Plan</h3>
              <p className="text-4xl md:text-6xl font-black">$29</p>
              <ProButton setShowBuilder={setShowBuilder} />
            </div>
          </div>
        </div>
      </section>

      <Footnote />
    </main>
  );
}

const ProButton = ({ setShowBuilder }: { setShowBuilder: (val: boolean) => void }) => {
  const { data: session } = useSession();

  const handlePayment = async () => {
    if (!session) {
      signIn("google");
      return;
    }

    const res = await fetch("/api/payment/create-order", { method: "POST" });
    const data = await res.json();

    if (data.id) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Prime Engine Pro",
        description: "Unlock AI superpowers",
        order_id: data.id,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }),
            headers: { "Content-Type": "application/json" }
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Upgrade Successful! Welcome to Prime Pro.");
            window.location.reload();
          }
        },
        theme: { color: "#FF4D4D" }
      };
      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest"
    >
      Go Pro
    </button>
  )
}
