"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Code2, Rocket, Sparkles } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Build full-stack apps in seconds with AI-powered generation",
        gradient: "from-solar-red to-solar-orange",
    },
    {
        icon: Code2,
        title: "Production Ready",
        description: "Clean, optimized code that's ready to deploy immediately",
        gradient: "from-solar-orange to-solar-yellow",
    },
    {
        icon: Rocket,
        title: "Deploy Anywhere",
        description: "One-click deployment to Vercel, Netlify, or your own infrastructure",
        gradient: "from-solar-yellow to-solar-red",
    },
    {
        icon: Sparkles,
        title: "AI Powered",
        description: "Powered by advanced AI models for intelligent code generation",
        gradient: "from-solar-red via-solar-orange to-solar-yellow",
    },
];

export function FeaturesSection() {
    const { scrollYProgress } = useScroll();

    return (
        <section className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-32 md:py-48">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-[10px] font-black text-solar-orange border border-solar-orange/30 uppercase tracking-[0.3em] mb-6">
                    <Sparkles className="w-3.5 h-3.5" />
                    Features
                </div>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
                    Built for <br />
                    <span className="text-gradient-solar">Speed.</span>
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30, rotateX: -15 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        whileHover={{
                            y: -10,
                            rotateX: 5,
                            rotateY: 5,
                            scale: 1.02,
                            transition: { duration: 0.3 },
                        }}
                        className="group relative p-8 md:p-12 rounded-[3rem] glass border border-white/5 overflow-hidden preserve-3d cursor-pointer"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                        <div className="relative z-10 space-y-6">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-8 h-8 text-black" />
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                {feature.title}
                            </h3>

                            <p className="text-foreground/60 text-sm md:text-base leading-relaxed">
                                {feature.description}
                            </p>
                        </div>

                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-solar-gradient rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
