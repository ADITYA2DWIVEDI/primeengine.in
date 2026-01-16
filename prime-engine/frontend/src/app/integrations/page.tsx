'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Puzzle, Globe, Shield, CreditCard,
    Database, Mail, Share2, Terminal,
    ExternalLink, CheckCircle2, Search,
    Activity, Zap, Info
} from 'lucide-react'
import { cn } from '@/lib/utils'

const integrationCategories = [
    'All Systems', 'Authentication', 'E-Commerce', 'Database', 'Marketing', 'Infrastructure'
]

const integrations = [
    {
        id: 'firebase',
        name: 'Firebase Catalyst',
        description: 'Complete backend infrastructure with real-time sync, auth, and cloud functions.',
        category: 'Infrastructure',
        status: 'Stable',
        isInstalled: true,
        complexity: 'Enterprise'
    },
    {
        id: 'stripe',
        name: 'Stripe Terminal',
        description: 'Global payment processing and subscription management for digital ventures.',
        category: 'E-Commerce',
        status: 'Stable',
        isInstalled: false,
        complexity: 'Financial'
    },
    {
        id: 'auth0',
        name: 'Auth0 Matrix',
        description: 'Identity management and single sign-on specialized for complex organizations.',
        category: 'Authentication',
        status: 'Beta',
        isInstalled: false,
        complexity: 'Advanced'
    },
    {
        id: 'supabase',
        name: 'Supabase Core',
        description: 'Open source Firebase alternative with PostgreSQL power and vector search.',
        category: 'Database',
        status: 'Stable',
        isInstalled: false,
        complexity: 'Full-Stack'
    },
    {
        id: 'mailgun',
        name: 'Mailgun Delivery',
        description: 'Tactical email infrastructure for localized and global communication.',
        category: 'Marketing',
        status: 'Stable',
        isInstalled: false,
        complexity: 'Lightweight'
    },
    {
        id: 'redis',
        name: 'Redis Cache',
        description: 'High-velocity data structure store for real-time application states.',
        category: 'Database',
        status: 'Legacy',
        isInstalled: false,
        complexity: 'Strategic'
    }
]

export default function IntegrationsPage() {
    const [activeCategory, setActiveCategory] = useState('All Systems')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredIntegrations = integrations.filter((item) => {
        const matchesCategory = activeCategory === 'All Systems' || item.category === activeCategory
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen p-8 md:p-12 relative overflow-hidden bg-dark-950">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <Puzzle className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Expansion Matrix</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-black text-white tracking-tight"
                    >
                        Plugins & <span className="text-white/40">Integrations</span>
                    </motion.h1>
                    <p className="text-xl text-dark-400 mt-4 max-w-2xl font-medium leading-relaxed italic">
                        Extend your AI-generated applications with production-grade tactical modules.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filter Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="relative mb-8 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Filter modules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field pl-12 h-12 bg-dark-900 border-white/5 focus:border-primary-500/30 text-xs font-bold uppercase tracking-widest"
                            />
                        </div>

                        <nav className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-600 mb-4 ml-2">Categories</h4>
                            {integrationCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "w-full text-left px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        activeCategory === cat
                                            ? "bg-primary-500 text-white shadow-xl shadow-primary-500/10"
                                            : "text-dark-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Matrix Grid */}
                    <main className="flex-1">
                        <AnimatePresence mode='popLayout'>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredIntegrations.map((item, i) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="group glass p-8 rounded-[32px] border border-white/5 flex flex-col hover:border-primary-500/20 transition-all duration-500 card-hover"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {item.id === 'firebase' && <Globe className="w-7 h-7 text-amber-500" />}
                                                {item.id === 'stripe' && <CreditCard className="w-7 h-7 text-indigo-400" />}
                                                {item.id === 'auth0' && <Shield className="w-7 h-7 text-rose-500" />}
                                                {item.id === 'supabase' && <Database className="w-7 h-7 text-emerald-400" />}
                                                {item.id === 'mailgun' && <Mail className="w-7 h-7 text-red-400" />}
                                                {item.id === 'redis' && <Zap className="w-7 h-7 text-red-500" />}
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={cn(
                                                    "text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest",
                                                    item.status === 'Stable' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-primary-500/10 text-primary-400 border-primary-500/20"
                                                )}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="text-xl font-black text-white italic group-hover:text-primary-400 transition-colors uppercase tracking-tight">{item.name}</h3>
                                                {item.isInstalled && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            </div>
                                            <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mb-4 italic">{item.category} • {item.complexity}</p>
                                            <p className="text-sm text-dark-400 font-medium leading-relaxed mb-8">
                                                {item.description}
                                            </p>
                                        </div>

                                        <button className={cn(
                                            "w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                            item.isInstalled
                                                ? "bg-dark-900 text-dark-500 border border-white/5 cursor-default"
                                                : "bg-white text-dark-950 hover:bg-gray-100 shadow-xl"
                                        )}>
                                            {item.isInstalled ? "Synchronized" : "Initialize Plugin"}
                                            {!item.isInstalled && <ExternalLink className="w-3 h-3" />}
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}
