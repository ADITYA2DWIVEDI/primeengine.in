'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Save, Play, Rocket, Github, Undo, Redo,
    Smartphone, Monitor, Tablet, Loader2, ChevronLeft,
    Type, Image as ImageIcon, Square, Layout, List, Table, FormInput,
    Sparkles, Settings as SettingsIcon, Code, Eye, Layers,
    MousePointer2, Plus, Share2, Download, Terminal,
    Activity, Box, Zap
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { projectsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Canvas from '@/components/Canvas'

const COMPONENT_PALETTE = [
    { id: 'hero', icon: Sparkles, label: 'Hero Section', group: 'Layout' },
    { id: 'navbar', icon: Layout, label: 'Navigation', group: 'Layout' },
    { id: 'grid', icon: Box, label: 'Feature Grid', group: 'Layout' },
    { id: 'text', icon: Type, label: 'Heading', group: 'Elements' },
    { id: 'button', icon: Zap, label: 'CTA Button', group: 'Elements' },
    { id: 'input', icon: FormInput, label: 'Input Field', group: 'Elements' },
]

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type PanelTab = 'ai' | 'components' | 'styles' | 'layers'

export default function EditorPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const { currentProject, setCurrentProject, updateProject } = useProjectStore()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeploying, setIsDeploying] = useState(false)
    const [viewMode, setViewMode] = useState<ViewMode>('desktop')
    const [activeTab, setActiveTab] = useState<PanelTab>('ai')
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [prompt, setPrompt] = useState('')

    useEffect(() => {
        fetchProject()
    }, [projectId])

    const fetchProject = async () => {
        setIsLoading(true)
        try {
            const response = await projectsAPI.getById(projectId)
            setCurrentProject(response.data.project)
        } catch (error) {
            toast.error('Session failed to initialize.')
            router.push('/dashboard')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await projectsAPI.update(projectId, {
                canvasState: currentProject?.canvasState
            })
            toast.success('Workspace synchronized.')
        } catch (error) {
            toast.error('Sync error.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleGenerate = async () => {
        if (!prompt) return toast.error('Command required.')
        setIsSaving(true)
        try {
            const response = await projectsAPI.generate(prompt, projectId)
            updateProject(projectId, { canvasState: response.data.canvasState })
            toast.success('Synthesis successful.')
        } catch (error) {
            toast.error('Synthesis failed.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeploy = async () => {
        setIsDeploying(true)
        try {
            await projectsAPI.deploy(projectId)
            toast.success('Deployed to Sector 7.')
        } catch (error) {
            toast.error('Deployment error.')
        } finally {
            setIsDeploying(false)
        }
    }

    const getSelectedComponent = () => {
        if (!selectedId || !currentProject?.canvasState?.pages?.[0]) return null
        return currentProject.canvasState.pages[0].components.find((c: any) => c.id === selectedId)
    }

    const selectedComponent = getSelectedComponent()

    const getCanvasDimensions = () => {
        switch (viewMode) {
            case 'mobile': return 'w-[375px] h-[812px]'
            case 'tablet': return 'w-[768px] h-[1024px]'
            default: return 'w-full h-full'
        }
    }

    if (isLoading) {
        return (
            <div className="h-screen bg-dark-950 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black text-white uppercase tracking-[0.3em] mb-2 animate-pulse">Initializing Editor</p>
                    <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest italic">Syncing architect blueprints...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen flex flex-col bg-dark-950 overflow-hidden font-sans">
            {/* Top Command Bar */}
            <header className="h-20 bg-dark-950 border-b border-white/5 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-10 h-10 flex items-center justify-center text-dark-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-black text-white tracking-tight uppercase">{currentProject?.name}</h1>
                            <span className="text-[9px] font-black bg-primary-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Live</span>
                        </div>
                        <p className="text-[10px] font-bold text-dark-500 italic uppercase">Sector ID: {projectId.slice(0, 8)}</p>
                    </div>
                </div>

                <div className="hidden lg:flex items-center gap-2 bg-dark-900/50 p-1.5 rounded-2xl border border-white/5">
                    {[
                        { mode: 'desktop' as ViewMode, icon: Monitor, label: 'Desktop' },
                        { mode: 'tablet' as ViewMode, icon: Tablet, label: 'Tablet' },
                        { mode: 'mobile' as ViewMode, icon: Smartphone, label: 'Mobile' },
                    ].map(({ mode, icon: Icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest",
                                viewMode === mode
                                    ? "bg-white/10 text-white shadow-lg shadow-black/50"
                                    : "text-dark-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-3 text-dark-500 hover:text-white transition-colors"><Undo className="w-5 h-5" /></button>
                    <button className="p-3 text-dark-500 hover:text-white transition-colors mr-2"><Redo className="w-5 h-5" /></button>

                    <div className="h-10 w-px bg-white/5 mx-2" />

                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 text-dark-300 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Sync
                    </button>

                    <button className="btn-secondary px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-4 h-4" /> Preview
                    </button>

                    <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl shadow-primary-500/20 disabled:opacity-50"
                    >
                        {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
                        Deploy
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Control Panel */}
                <aside className="w-80 bg-dark-950 border-r border-white/5 flex flex-col z-40">
                    <div className="flex p-4 gap-2 border-b border-white/5">
                        {[
                            { id: 'ai', icon: Sparkles, label: 'Forge' },
                            { id: 'components', icon: Layers, label: 'Kit' },
                            { id: 'layers', icon: List, label: 'Map' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as PanelTab)}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all",
                                    activeTab === tab.id ? "bg-primary-500/10 text-white border border-primary-500/20" : "text-dark-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'ai' && (
                                <motion.div
                                    key="ai"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-primary-400">
                                            <Terminal className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">System Prompt</span>
                                        </div>
                                        <textarea
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="Describe a tactical evolution for this application..."
                                            className="w-full h-48 bg-dark-900 border border-white/5 rounded-2xl p-4 text-sm text-white placeholder:text-dark-600 focus:border-primary-500/30 transition-all resize-none shadow-inner"
                                        />
                                        <button
                                            onClick={handleGenerate}
                                            disabled={isSaving}
                                            className="w-full mt-4 py-4 bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-primary-500/10 hover:scale-[1.02] transition-transform disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                            Initialize Generation
                                        </button>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-dark-500 mb-4 block italic">Generation Status</span>
                                        <div className="p-4 bg-dark-900/50 rounded-2xl border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-white uppercase italic">Nexus Model 4.0</span>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-full h-full bg-emerald-500/50" />
                                            </div>
                                            <p className="text-[9px] font-bold text-dark-500 mt-2 italic">Ready for commands.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'components' && (
                                <motion.div
                                    key="components"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8"
                                >
                                    {['Layout', 'Elements'].map((group) => (
                                        <div key={group}>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-dark-500 mb-4 ml-1">{group}</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                {COMPONENT_PALETTE.filter(c => c.group === group).map((comp) => (
                                                    <button
                                                        key={comp.id}
                                                        className="flex flex-col items-center gap-3 p-5 bg-dark-900 border border-white/5 hover:border-primary-500/30 hover:bg-dark-800 rounded-[24px] transition-all group"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                                                            <comp.icon className="w-5 h-5" />
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-dark-400 group-hover:text-white">{comp.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-dark-900/20">
                        <div className="flex items-center gap-4 text-dark-500">
                            <Activity className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic">Architect latency: 24ms</span>
                        </div>
                    </div>
                </aside>

                {/* Main Visual Canvas Area */}
                <main className="flex-1 bg-dark-900/50 relative overflow-hidden flex flex-col p-8 lg:p-12">
                    <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

                    <div className="flex-1 relative flex items-center justify-center">
                        <div className={cn(
                            "bg-white rounded-[32px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 relative group border-[8px] border-dark-950",
                            getCanvasDimensions()
                        )}>
                            {/* Visual Editor Tooltips Layer */}
                            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="absolute top-40 left-20 p-2 bg-primary-500 text-white text-[10px] font-black rounded-lg shadow-2xl flex items-center gap-2">
                                    <MousePointer2 className="w-3 h-3" /> Hero_Sector_Main
                                </div>
                            </div>

                            {/* Generated App Iframe/Preview */}
                            <Canvas state={currentProject?.canvasState} />
                        </div>
                    </div>

                    {/* Canvas Controls Overlay */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 glass p-2 rounded-[24px] border border-white/10 z-30 shadow-2xl">
                        <button className="p-4 text-white hover:bg-white/10 rounded-2xl transition-all"><Plus className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-white/10" />
                        <button className="p-4 text-white hover:bg-white/10 rounded-2xl transition-all"><MousePointer2 className="w-5 h-5" /></button>
                        <button className="p-4 text-white hover:bg-white/10 rounded-2xl transition-all"><Code className="w-5 h-5" /></button>
                        <div className="w-px h-6 bg-white/10" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest px-4">120% Zoom</span>
                    </div>
                </main>

                {/* Right Properties/Layers Panel */}
                <aside className="w-72 bg-dark-950 border-l border-white/5 flex flex-col z-40">
                    <div className="p-6 border-b border-white/5">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-6 italic">Configuration</h3>

                        {selectedComponent ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-dark-500 uppercase">Unit ID</label>
                                    <div className="p-3 bg-dark-900 rounded-xl border border-white/5 text-[10px] font-mono text-primary-400">{selectedComponent.id}</div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-dark-500 uppercase">Configuration Matrix</label>
                                    {Object.entries(selectedComponent.props || {}).map(([key, value]: [string, any]) => (
                                        <div key={key} className="space-y-2">
                                            <label className="text-[8px] font-bold text-dark-600 uppercase ml-1">{key}</label>
                                            <input
                                                type="text"
                                                value={typeof value === 'string' ? value : JSON.stringify(value)}
                                                onChange={(e) => {
                                                    const newProps = { ...selectedComponent.props, [key]: e.target.value }
                                                    const newComponents = currentProject!.canvasState.pages[0].components.map((c: any) =>
                                                        c.id === selectedId ? { ...c, props: newProps } : c
                                                    )
                                                    updateProject(projectId, {
                                                        canvasState: {
                                                            ...currentProject!.canvasState,
                                                            pages: [{
                                                                ...currentProject!.canvasState.pages[0],
                                                                components: newComponents
                                                            }]
                                                        }
                                                    })
                                                }}
                                                className="w-full bg-dark-900 border border-white/5 rounded-xl p-3 text-[10px] font-bold text-white focus:border-primary-500/30 outline-none transition-all"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <Box className="w-10 h-10 text-dark-800 mx-auto mb-4" />
                                <p className="text-[9px] font-black text-dark-600 uppercase tracking-widest italic">Awaiting target selection...</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-dark-500 mb-6 italic">Active Layers</h3>
                        <div className="space-y-2">
                            {currentProject?.canvasState?.pages?.[0]?.components.map((comp: any, i: number) => (
                                <div
                                    key={comp.id}
                                    onClick={() => setSelectedId(comp.id)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group",
                                        selectedId === comp.id ? "bg-primary-500/10 border border-primary-500/20" : "hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full transition-opacity",
                                            selectedId === comp.id ? "bg-primary-500 opacity-100" : "bg-primary-500 opacity-40 group-hover:opacity-100"
                                        )} />
                                        <span className={cn(
                                            "text-[10px] font-bold transition-colors",
                                            selectedId === comp.id ? "text-white" : "text-dark-400 group-hover:text-white"
                                        )}>{comp.type.charAt(0).toUpperCase() + comp.type.slice(1)}_{i + 1}</span>
                                    </div>
                                    <Eye className="w-3.5 h-3.5 text-dark-600 group-hover:text-dark-400" />
                                </div>
                            ))}
                            {(!currentProject?.canvasState?.pages?.[0]?.components || currentProject.canvasState.pages[0].components.length === 0) && (
                                <p className="text-[9px] font-bold text-dark-600 uppercase tracking-widest text-center py-4 italic">No Active Units</p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
