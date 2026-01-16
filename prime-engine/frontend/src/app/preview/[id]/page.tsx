'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Monitor, Tablet, Smartphone, ChevronLeft,
    ExternalLink, RefreshCw, Loader2, Rocket,
    Activity, ShieldCheck, Globe
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { projectsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

type ViewMode = 'desktop' | 'tablet' | 'mobile'

export default function PreviewPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const { currentProject, setCurrentProject } = useProjectStore()
    const [viewMode, setViewMode] = useState<ViewMode>('desktop')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchProject()
    }, [projectId])

    const fetchProject = async () => {
        setIsLoading(true)
        try {
            const response = await projectsAPI.getById(projectId)
            setCurrentProject(response.data.project)
        } catch (error) {
            toast.error('Preview stream disconnected.')
            router.push('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    const getPreviewWidth = () => {
        switch (viewMode) {
            case 'mobile': return 'max-w-[375px]'
            case 'tablet': return 'max-w-[768px]'
            default: return 'max-w-full'
        }
    }

    if (isLoading) {
        return (
            <div className="h-screen bg-dark-950 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2 animate-pulse">Rendering Sandbox</p>
                    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest italic">Simulating sector environment...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-dark-950 overflow-hidden">
            {/* Preview Toolbar */}
            <header className="h-20 bg-dark-950 border-b border-white/5 flex items-center justify-between px-8 relative z-10">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => router.push(`/editor/${projectId}`)}
                        className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Editor</span>
                    </button>

                    <div className="h-6 w-px bg-white/5" />

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-white tracking-tight uppercase">Preview: {currentProject?.name}</h1>
                        </div>
                        <p className="text-[9px] font-bold text-dark-500 italic uppercase">Secure Sandbox Environment</p>
                    </div>
                </div>

                {/* Viewport Toggles */}
                <div className="flex items-center gap-2 bg-dark-900/50 p-1.5 rounded-2xl border border-white/5">
                    {[
                        { mode: 'desktop' as ViewMode, icon: Monitor },
                        { mode: 'tablet' as ViewMode, icon: Tablet },
                        { mode: 'mobile' as ViewMode, icon: Smartphone },
                    ].map(({ mode, icon: Icon }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "w-12 h-10 flex items-center justify-center rounded-xl transition-all",
                                viewMode === mode
                                    ? "bg-white/10 text-white shadow-lg"
                                    : "text-dark-500 hover:text-white"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors group">
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Rebuild</span>
                    </button>
                    <button className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-primary-500/20">
                        <Rocket className="w-4 h-4" /> Live Deploy
                    </button>
                </div>
            </header>

            {/* Sandbox Area */}
            <main className="flex-1 bg-dark-900/50 flex flex-col p-8 lg:p-12 relative overflow-hidden">
                <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

                {/* Meta Bar */}
                <div className="max-w-5xl mx-auto w-full mb-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-dark-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            SSL Secured
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-primary-400" />
                            Global Edge CDN
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-white">Generated: {new Date(currentProject?.updatedAt || Date.now()).toLocaleTimeString()}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>

                <div className="flex-1 flex items-start justify-center overflow-auto pb-12">
                    <div className={cn(
                        "bg-white shadow-[0_60px_150px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden transition-all duration-700 mx-auto min-h-screen relative",
                        getPreviewWidth()
                    )}>
                        {/* Realistic Browser/App Chrome */}
                        <div className="h-10 bg-gray-100 flex items-center px-6 gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                            <div className="mx-auto bg-white/50 px-10 py-1 rounded-md text-[8px] font-bold text-gray-400">
                                sandbox.prime-engine.ai/{projectId.slice(0, 12)}
                            </div>
                        </div>

                        {/* Actual App Content Rendering (Simulation) */}
                        <div className="p-16">
                            <nav className="flex justify-between items-center mb-24">
                                <Activity className="w-8 h-8 text-black" />
                                <div className="flex gap-8 text-sm font-bold text-gray-400">
                                    <span>Genesis</span>
                                    <span>Vision</span>
                                    <span>Nexus</span>
                                </div>
                            </nav>
                            <h1 className="text-7xl font-black text-gray-900 tracking-tighter mb-8 italic uppercase">SYNERGY <br /> <span className="text-gray-300">HUB.</span></h1>
                            <p className="max-w-md text-gray-500 font-medium leading-relaxed mb-12">
                                Professional application architecture synthesized via Prime Engine Core. This sandbox renders the real-time state of your construction.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-20">
                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                    <h4 className="font-black text-xl mb-2 italic">01. Dynamic</h4>
                                    <p className="text-sm text-gray-400 font-medium">Real-time state synchronization.</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
                                    <h4 className="font-black text-xl mb-2 italic">02. Atomic</h4>
                                    <p className="text-sm text-gray-400 font-medium">Component-driven architecture.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl flex items-center gap-3">
                                    Launch Interface
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
