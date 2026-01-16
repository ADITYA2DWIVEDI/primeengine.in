'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Zap, Code2, Rocket, Layers, Globe, ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import ThreedHero from '@/components/ThreedHero'
import Magnetic from '@/components/Magnetic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Register ScrollTrigger only on client side
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Generation',
        description: 'Describe your app in plain English and watch it come to life in seconds.',
        gradient: 'from-blue-600 to-indigo-600'
    },
    {
        icon: Code2,
        title: 'Full-Stack Output',
        description: 'Get complete frontend, backend, and database code ready for production.',
        gradient: 'from-purple-600 to-pink-600'
    },
    {
        icon: Layers,
        title: 'Visual Editor',
        description: 'Drag-and-drop interface to customize your app without writing code.',
        gradient: 'from-orange-600 to-amber-600'
    },
    {
        icon: Zap,
        title: 'Instant Preview',
        description: 'See real-time previews as you build and iterate on your ideas.',
        gradient: 'from-cyan-600 to-teal-600'
    },
    {
        icon: Globe,
        title: 'One-Click Deploy',
        description: 'Deploy your app to the cloud with a single click. No DevOps required.',
        gradient: 'from-emerald-600 to-green-600'
    },
    {
        icon: Rocket,
        title: 'Export Anywhere',
        description: 'Export clean code to GitHub. No vendor lock-in, full ownership.',
        gradient: 'from-rose-600 to-red-600'
    }
]

const templates = [
    {
        name: 'SaaS Dashboard',
        category: 'Business',
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/template_saas_dashboard_1768546950659.png',
        tag: 'Popular'
    },
    {
        name: 'E-Commerce Store',
        category: 'Retail',
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/template_ecommerce_store_1768546973189.png',
        tag: 'Hot'
    },
    {
        name: 'AI Portfolio',
        category: 'Creative',
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/prime_engine_hero_preview_1768546917130.png',
        tag: 'New'
    }
]

export default function LandingPage() {
    const mainTitleRef = useRef<HTMLHeadingElement>(null)
    const { scrollYProgress } = useScroll()
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -100])
    const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0])

    useEffect(() => {
        if (!mainTitleRef.current) return

        const title = mainTitleRef.current
        const words = title.textContent?.split(' ') || []
        title.innerHTML = words.map(word => `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${word}</span></span>`).join(' ')

        gsap.to(title.querySelectorAll('span span'), {
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.5
        })
    }, [])

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 px-6 overflow-hidden">
                {/* Immersive 3D Background */}
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <ThreedHero />
                </motion.div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary-500/20 mb-12"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-sm font-bold text-primary-200 uppercase tracking-widest">v2.0 Beta: Now Live</span>
                        </motion.div>

                        <h1
                            ref={mainTitleRef}
                            className="text-6xl md:text-9xl font-black mb-12 leading-[0.9] tracking-tight text-white"
                        >
                            BUILD THE <span className="gradient-text">FUTURE</span> WITHOUT THE CODE.
                        </h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 1 }}
                            className="text-xl md:text-3xl text-dark-300 max-w-4xl mb-16 leading-tight font-medium"
                        >
                            Prime Engine is the AI-native workspace where natural language transforms into
                            <span className="text-white font-bold"> enterprise-grade </span>
                            full-stack applications in minutes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="flex flex-wrap items-center justify-center gap-8"
                        >
                            <Magnetic>
                                <Link href="/create">
                                    <button className="btn-premium flex items-center gap-3 text-xl group overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-3">
                                            <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            Start Building Free
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </button>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <button className="btn-secondary-outline flex items-center gap-3 text-xl">
                                    <Play className="w-6 h-6 fill-current" />
                                    Watch Vision
                                </button>
                            </Magnetic>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Dashboard Preview */}
            <section className="px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative mx-auto max-w-6xl group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative rounded-[2rem] border border-white/10 overflow-hidden bg-dark-900/50 backdrop-blur-3xl shadow-2xl">
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                            </div>
                            <div className="mx-auto text-xs font-bold text-dark-400 bg-dark-950 px-4 py-1.5 rounded-full border border-white/5 tracking-wider uppercase">
                                prime-engine.ai/ide/quantum-nexus
                            </div>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                            alt="Prime Engine Dashboard"
                            className="w-full h-auto object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-40 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/10 blur-[150px] -z-10 rounded-full"></div>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-32">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-primary-400 font-black uppercase tracking-[0.4em] text-sm"
                        >
                            Core Capabilities
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-7xl font-black mt-6"
                        >
                            Built for <span className="gradient-text italic">Extraordinary</span> Results
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="premium-card group"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-3xl font-black mb-6 text-white leading-tight">{feature.title}</h3>
                                <p className="text-dark-300 text-lg leading-relaxed font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marketplace Preview */}
            <section className="py-40 px-6 bg-dark-950/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-12">
                        <div className="max-w-3xl">
                            <span className="text-primary-400 font-black uppercase tracking-[0.4em] text-sm">App Marketplace</span>
                            <h2 className="text-5xl md:text-7xl font-black mt-6 leading-tight">Elite <span className="gradient-text">Blueprints</span></h2>
                            <p className="text-2xl text-dark-400 mt-8 font-medium">
                                Launch pre-optimized application foundations designed by world-class engineers.
                            </p>
                        </div>
                        <Magnetic>
                            <Link href="/templates">
                                <button className="btn-secondary-outline px-10 py-5 flex items-center gap-3 text-lg group">
                                    Browse Templates
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                                </button>
                            </Link>
                        </Magnetic>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {templates.map((template, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-dark-900/60 rounded-[3rem] overflow-hidden border border-white/5 hover:border-primary-500/20 transition-all duration-700"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={template.name === 'AI Portfolio' ? 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'}
                                        alt={template.name}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                                    />
                                    <div className="absolute top-6 right-6 bg-primary-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full backdrop-blur-3xl shadow-2xl">
                                        {template.tag}
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-xs font-black text-primary-400 uppercase tracking-[0.3em]">{template.category}</span>
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-primary-500/20 group-hover:bg-primary-500/50 transition-colors" />)}
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-8 group-hover:text-primary-100 transition-colors">{template.name}</h3>
                                    <button className="text-lg font-bold text-dark-300 group-hover:text-white transition-all flex items-center gap-3 group/btn">
                                        Deploy Instance <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-40 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
                        {[
                            { value: '50K+', label: 'Engines Built' },
                            { value: '1M+', label: 'LOC Generated' },
                            { value: '99.9%', label: 'Precision' },
                            { value: '150+', label: 'AI Clusters' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">{stat.value}</div>
                                <div className="text-xs font-black text-primary-400 uppercase tracking-[0.4em]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
