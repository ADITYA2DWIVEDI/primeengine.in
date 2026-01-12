"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Describe Your App",
        description: "Tell Prime Engine what you want to build in plain English",
    },
    {
        number: "02",
        title: "AI Generates Code",
        description: "Our AI creates your entire application architecture and code",
    },
    {
        number: "03",
        title: "Review & Iterate",
        description: "Make changes through natural conversation with the AI",
    },
    {
        number: "04",
        title: "Deploy Instantly",
        description: "Push to GitHub and deploy to production with one click",
    },
];

export function HowItWorksSection() {
    return (
        <section className="relative z-10 w-full max-w-7xl px-6 md:px-8 py-32 md:py-48">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
            >
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-tight">
                    How It <br />
                    <span className="text-gradient-solar">Works.</span>
                </h2>
            </motion.div>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-solar-red via-solar-orange to-solar-yellow opacity-20" />

                <div className="space-y-16 md:space-y-24">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            className={`flex flex-col md:flex-row items-start md:items-center gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Number Circle */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-solar-gradient flex items-center justify-center shadow-2xl shadow-solar-orange/30 z-10"
                            >
                                <span className="text-2xl md:text-3xl font-black text-black">
                                    {step.number}
                                </span>
                                <div className="absolute inset-0 rounded-full bg-solar-gradient blur-xl opacity-50 animate-pulse" />
                            </motion.div>

                            {/* Content */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className={`flex-1 p-8 md:p-10 rounded-[2.5rem] glass border border-white/5 ${i % 2 === 1 ? "md:text-right" : ""
                                    }`}
                            >
                                <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-foreground/60 text-sm md:text-lg leading-relaxed max-w-md">
                                    {step.description}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
