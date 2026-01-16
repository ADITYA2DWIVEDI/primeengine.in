'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Zap, Code2, Rocket, Layers, Globe, ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import ThreedHero from '@/components/ThreedHero'

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Generation',
        description: 'Describe your app in plain English and watch it come to life in seconds.',
        gradient: 'from-blue-500 to-indigo-500'
    },
    {
        icon: Code2,
        title: 'Full-Stack Output',
        description: 'Get complete frontend, backend, and database code ready for production.',
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        icon: Layers,
        title: 'Visual Editor',
        description: 'Drag-and-drop interface to customize your app without writing code.',
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        icon: Zap,
        title: 'Instant Preview',
        description: 'See real-time previews as you build and iterate on your ideas.',
        gradient: 'from-cyan-500 to-teal-500'
    },
    {
        icon: Globe,
        title: 'One-Click Deploy',
        description: 'Deploy your app to the cloud with a single click. No DevOps required.',
        gradient: 'from-emerald-500 to-green-500'
    },
    {
        icon: Rocket,
        title: 'Export Anywhere',
        description: 'Export clean code to GitHub. No vendor lock-in, full ownership.',
        gradient: 'from-rose-500 to-red-500'
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

export default function HomePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Immersive 3D Background */}
                <ThreedHero />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary-500/20 mb-8"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            <span className="text-sm font-medium text-primary-200">v2.0 Beta: Now with GPT-4 & Gemini Pro</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
                        >
                            Build the <span className="gradient-text">Future</span> <br />
                            without the <span className="text-white/40">Code.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-dark-300 max-w-3xl mb-12 leading-relaxed"
                        >
                            Prime Engine is the AI-native workspace where natural language transforms into
                            <span className="text-white font-semibold"> enterprise-grade </span>
                            full-stack applications in minutes.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-6"
                        >
                            <Link href="/create">
                                <button className="btn-primary flex items-center gap-3 text-lg px-8 py-4 shadow-xl shadow-primary-500/20 group">
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Start Building Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <button className="btn-secondary flex items-center gap-3 text-lg px-8 py-4">
                                <Play className="w-5 h-5 fill-current" />
                                Watch the Vision
                            </button>
                        </motion.div>
                    </div>

                    {/* Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
                        className="relative mx-auto mt-20 max-w-6xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10 h-1/2 bottom-0" />
                        <div className="rounded-3xl border border-white/10 overflow-hidden bg-dark-900/50 backdrop-blur-3xl shadow-2xl">
                            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                </div>
                                <div className="mx-auto text-xs font-medium text-dark-400 bg-dark-950 px-3 py-1 rounded-full border border-white/5">
                                    prime-engine.ai/workspace/new-saas-app
                                </div>
                            </div>
                            <img
                                src="file://C:/Users/Adity/.gemini/antigravity/brain/c3577431-5570-46ed-9e73-7934cafe75ee/prime_engine_hero_preview_1768546917130.png"
                                alt="Prime Engine Dashboard"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        {/* Floating Micro-UI elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -right-6 top-1/4 glass p-4 rounded-2xl border-white/10 hidden lg:block z-20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">App Generated</p>
                                    <p className="text-[10px] text-dark-400">Database & API Ready</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 italic">
                        <span className="text-primary-400 font-bold uppercase tracking-[0.2em] text-sm">Capabilities</span>
                        <h2 className="text-4xl md:text-5xl font-black mt-4">Built for <span className="gradient-text">Innovation</span></h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-8 rounded-3xl bg-dark-900/40 border border-white/5 hover:border-primary-500/30 transition-all duration-500 card-hover"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marketplace Preview */}
            <section className="py-32 px-6 bg-dark-950/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div>
                            <span className="text-primary-400 font-bold uppercase tracking-[0.2em] text-sm italic">App Marketplace</span>
                            <h2 className="text-4xl md:text-5xl font-black mt-4">Start with <span className="gradient-text">Intelligence</span></h2>
                            <p className="text-xl text-dark-400 mt-4 max-w-xl">
                                Launch pre-optimized application foundations designed by world-class engineers.
                            </p>
                        </div>
                        <Link href="/templates">
                            <button className="btn-secondary px-8 py-4 flex items-center gap-2 group">
                                Browse Marketplace
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-dark-900/40 rounded-[32px] overflow-hidden border border-white/5 hover:border-primary-500/40 transition-all duration-500"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img
                                        src={`file://${template.image}`}
                                        alt={template.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-primary-500/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                                        {template.tag}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-primary-400 uppercase tracking-widest">{template.category}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-500/30" />)}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">{template.name}</h3>
                                    <button className="text-sm font-bold text-dark-300 group-hover:text-white transition-colors flex items-center gap-2 mt-6">
                                        Use Template <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { value: '50K+', label: 'Apps Generated' },
                            { value: '1M+', label: 'Lines of Code' },
                            { value: '99.9%', label: 'Cloud Uptime' },
                            { value: '150+', label: 'AI Models' },
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                                <div className="text-sm font-bold text-dark-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
