'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search, Filter, ArrowRight, Loader2, Sparkles,
    Layers, Layout, ShoppingBag, Globe, Palette,
    Smartphone, Database, BrainCircuit, Gamepad2,
    ChevronRight, Star
} from 'lucide-react'
import { templatesAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const COL_CATEGORIES = [
    { id: 'all', name: 'All Starters', icon: Layers },
    { id: 'saas', name: 'SaaS & Dashboards', icon: Layout },
    { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingBag },
    { id: 'portfolio', name: 'Creative Portfolio', icon: Palette },
    { id: 'landing', name: 'Landing Pages', icon: Globe },
    { id: 'ai', name: 'AI & Machine Learning', icon: BrainCircuit },
    { id: 'mobile', name: 'Mobile Ready', icon: Smartphone },
    { id: 'gaming', name: 'Gaming & Web3', icon: Gamepad2 },
]

const TEMPLATE_DATA = [
    {
        id: '1',
        name: 'Nexus Analytics Dashboard',
        description: 'Next-gen SaaS metrics with real-time charting and team management.',
        category: 'saas',
        isFeatured: true,
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/template_saas_dashboard_1768546950659.png',
        complexity: 'Enterprise'
    },
    {
        id: '2',
        name: 'Aurora Fashion Suite',
        description: 'High-end retail experience with immersive product galleries.',
        category: 'ecommerce',
        isFeatured: true,
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/template_ecommerce_store_1768546973189.png',
        complexity: 'Full-Stack'
    },
    {
        id: '3',
        name: 'Zenith Portfolio',
        description: 'Clean, minimalist canvas for designers and digital artists.',
        category: 'portfolio',
        isFeatured: false,
        image: '/brain/c3577431-5570-46ed-9e73-7934cafe75ee/prime_engine_hero_preview_1768546917130.png',
        complexity: 'Client-Side'
    },
    {
        id: '4',
        name: 'Neural Chat Framework',
        description: 'Scalable AI infrastructure for custom LLM integrations.',
        category: 'ai',
        isFeatured: true,
        complexity: 'Advanced'
    },
    {
        id: '5',
        name: 'Velocity Startup Landing',
        description: 'Hyper-optimized conversion kit with A/B testing blocks.',
        category: 'landing',
        isFeatured: false,
        complexity: 'Lightweight'
    },
    {
        id: '6',
        name: 'Crypto Quest Portal',
        description: 'Web3-ready interface for gaming and NFT marketplaces.',
        category: 'gaming',
        isFeatured: false,
        complexity: 'Full-Stack'
    },
]

export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('all')
    const [isLoading, setIsLoading] = useState(false)

    const filteredTemplates = TEMPLATE_DATA.filter((t) => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory
        return matchesSearch && matchesCategory
    })

    const handleUseTemplate = async (templateId: string) => {
        try {
            toast.loading('Initializing Template Engine...')
            const response = await templatesAPI.use(templateId)
            toast.dismiss()
            toast.success('Workspace ready for construction!')
            window.location.href = `/editor/${response.data.project.id}`
        } catch (error) {
            toast.dismiss()
            toast.error('Initialization sequence failed.')
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Sidebar Categories */}
            <aside className="w-full md:w-72 md:h-screen md:sticky md:top-0 bg-dark-950 border-r border-white/5 p-8 overflow-y-auto">
                <div className="mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 italic">Library</span>
                    <h2 className="text-2xl font-black text-white mt-1">Marketplace</h2>
                </div>

                <nav className="space-y-2">
                    {COL_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                activeCategory === cat.id
                                    ? "bg-primary-500/10 border border-primary-500/20 text-white shadow-lg shadow-primary-500/5"
                                    : "text-dark-400 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <cat.icon className={cn(
                                    "w-5 h-5 transition-transform group-hover:scale-110",
                                    activeCategory === cat.id ? "text-primary-400" : "text-dark-500 group-hover:text-white"
                                )} />
                                <span className="text-sm font-bold">{cat.name}</span>
                            </div>
                            {activeCategory === cat.id && <ChevronRight className="w-4 h-4 text-primary-400" />}
                        </button>
                    ))}
                </nav>

                <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/20" />
                    <Sparkles className="absolute -right-2 -bottom-2 w-16 h-16 text-white/10 group-hover:scale-125 transition-transform" />
                    <div className="relative z-10">
                        <p className="text-white font-black leading-tight mb-2">Build Custom Template</p>
                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-4">AI Forge</p>
                        <button className="w-full py-2 bg-white text-dark-950 text-xs font-black rounded-xl hover:bg-gray-100 transition-colors uppercase tracking-widest">
                            Synthesize
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Pane */}
            <main className="flex-1 p-8 md:p-12 bg-dark-950/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-primary-500/5 to-transparent pointer-events-none" />

                {/* Search & Meta */}
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-500" />
                        <input
                            type="text"
                            placeholder="Describe a starter or search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-16 h-16 bg-dark-900 border-white/5 focus:border-primary-500/30 text-lg rounded-[24px]"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500">Live Models</span>
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                142 Starters Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="relative z-10">
                    <AnimatePresence mode='popLayout'>
                        {filteredTemplates.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-40 text-center"
                            >
                                <BrainCircuit className="w-16 h-16 text-dark-800 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-white italic">Zero matches in current sector.</h3>
                                <p className="text-dark-500 uppercase tracking-widest text-xs font-black mt-2">Try re-calibrating your search.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredTemplates.map((template, i) => (
                                    <motion.div
                                        layout
                                        key={template.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group bg-dark-900/40 rounded-[32px] overflow-hidden border border-white/5 hover:border-primary-500/30 transition-all duration-500 flex flex-col"
                                    >
                                        <div className="aspect-[16/10] relative overflow-hidden bg-dark-800">
                                            {template.image ? (
                                                <img
                                                    src={`file://${template.image}`}
                                                    alt={template.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center italic text-dark-700 font-black text-4xl uppercase tracking-tighter">
                                                    {template.name.split(' ')[0]}
                                                </div>
                                            )}

                                            {/* Feature Badge */}
                                            {template.isFeatured && (
                                                <div className="absolute top-4 left-4 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-2xl">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    PRO-SPEC
                                                </div>
                                            )}

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-8">
                                                <button
                                                    onClick={() => handleUseTemplate(template.id)}
                                                    className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-black shadow-2xl"
                                                >
                                                    Deploy Foundation
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{template.category}</span>
                                                <span className="text-[10px] font-bold text-dark-500 uppercase tracking-widest italic">{template.complexity}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-white mb-3 group-hover:text-primary-400 transition-colors">{template.name}</h3>
                                            <p className="text-sm text-dark-400 leading-relaxed line-clamp-2">
                                                {template.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
