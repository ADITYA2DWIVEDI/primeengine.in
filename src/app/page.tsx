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
// import { ParticleBackground } from "@/components/ParticleBackground";
// import { FeaturesSection } from "@/components/FeaturesSection";
// import { HowItWorksSection } from "@/components/HowItWorksSection";
// import { FloatingCard } from "@/components/FloatingCard";

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

const NavbarContent = () => {
  const { data: session } = useSession();
  // const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-[2rem] px-6 py-4 md:px-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Prime Engine" className="w-10 h-10 object-contain" />
          <span className="text-lg md:text-xl font-bold tracking-tight uppercase">Prime Engine</span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/70">
          <a href="/" className="hover:text-foreground transition-colors">Product</a>
          <a href="/showcase" className="hover:text-foreground transition-colors">Showcase</a>
          <a href="/docs" className="hover:text-foreground transition-colors">Documentation</a>
          <div className="w-[1px] h-4 bg-foreground/10" />

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-foreground font-bold">{session.user?.name}</span>
              {/* @ts-ignore */}
              {session.user?.isPro && <span className="px-2 py-0.5 bg-solar-gold text-black text-[9px] font-black uppercase rounded">PRO</span>}
              <button onClick={() => signOut()} className="px-5 py-2 rounded-full glass hover:bg-foreground/5 transition-all">Log out</button>
            </div>
          ) : (
            <button onClick={() => signIn("google")} className="px-5 py-2 rounded-full glass hover:bg-foreground/5 transition-all">Log in</button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full glass hover:bg-foreground/5 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => document.getElementById('prompt-input')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-2 rounded-full bg-solar-gradient text-black font-bold hover:scale-105 transition-transform"
          >
            Start Building
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-4">
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
            {session ? (
              <button onClick={() => signOut()} className="text-xl font-bold uppercase tracking-widest text-center text-red-500">Log out</button>
            ) : (
              <button onClick={() => signIn("google")} className="text-xl font-bold uppercase tracking-widest text-center">Log in</button>
            )}
            <hr className="border-foreground/5" />
            <button
              onClick={() => document.getElementById('prompt-input')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-5 rounded-2xl bg-solar-gradient text-black font-black uppercase tracking-widest"
            >
              Start Building
            </button>
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

const AnimatedOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 100, 0],
        y: [0, 50, 0],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/4 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-solar-red/10 blur-[100px] md:blur-[120px] rounded-full"
    />
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        x: [0, -120, 0],
        y: [0, -80, 0],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-1/4 -right-24 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-solar-orange/10 blur-[100px] md:blur-[120px] rounded-full"
    />
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
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center">
      <Navbar />
      <AnimatedOrbs />
      {/* <ParticleBackground /> */}

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-8 pt-40 md:pt-56 pb-20 text-center space-y-12 md:space-y-16">
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
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-[10px] font-black italic text-solar-orange border-solar-orange/30 uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Superpowers
          </motion.div>

          <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85] md:leading-[0.8]">
            Built with <br />
            <span className="text-gradient-solar">Magic.</span>
          </h1>

          <p className="text-lg md:text-2xl text-foreground/40 max-w-3xl mx-auto font-medium tracking-tight">
            Prime Engine turns your simple words into working apps in seconds.
            <span className="text-foreground/80 block mt-2">No code. No stress. Just amazing results.</span>
          </p>
        </motion.div>

        {/* AI Prompt Input Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ perspective: 1000, rotateX: 2, rotateY: -2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative max-w-3xl mx-auto group w-full cursor-default"
        >
          <div className="absolute -inset-2 bg-solar-gradient rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-10 group-focus-within:opacity-20 transition-all duration-700" />
          <div className="relative glass rounded-[2.5rem] p-3 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6 premium-shadow border-white/10 group-focus-within:border-solar-orange/40 transition-all">
            <div className="hidden md:flex p-4 rounded-2xl bg-white/5 text-solar-yellow">
              <Wand2 className="w-8 h-8" />
            </div>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What do you want to build today?"
              className="flex-1 w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-foreground/20 text-lg md:text-xl font-medium resize-none py-3 h-14 md:h-14 leading-tight"
            />
            <button
              onClick={() => prompt.length > 5 && setShowBuilder(true)}
              className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-2xl transition-all duration-500 flex items-center justify-center transform self-end md:self-center",
                prompt.length > 5
                  ? "bg-solar-gradient text-black shadow-[0_0_30px_rgba(255,148,77,0.5)] scale-100"
                  : "bg-white/5 text-foreground/10 scale-90"
              )}
            >
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 font-black" />
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4"
        >
          {["SaaS Dashboard", "Portfolio", "Real-estate", "Inventory"].map((tmp) => (
            <button
              key={tmp}
              onClick={() => { setPrompt(`Build a ${tmp}`); setShowBuilder(true); }}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-full glass text-[9px] md:text-[10px] font-black text-foreground/40 hover:text-foreground uppercase tracking-widest transition-all"
            >
              # {tmp}
            </button>
          ))}
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
