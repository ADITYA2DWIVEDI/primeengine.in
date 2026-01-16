'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Search, Folder, Clock, MoreVertical,
    Trash2, Edit3, ExternalLink, Loader2, Sparkles,
    LayoutGrid, List, Filter, ArrowUpRight, Activity
} from 'lucide-react'
import { useProjectStore, Project } from '@/store/projectStore'
import { projectsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
    const { projects, setProjects, deleteProject, isLoading, setLoading } = useProjectStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [menuOpen, setMenuOpen] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        try {
            const response = await projectsAPI.getAll()
            setProjects(response.data.projects)
        } catch (error) {
            toast.error('Session sync failed. Check your connection.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vision? This cannot be undone.')) return

        try {
            await projectsAPI.delete(id)
            deleteProject(id)
            toast.success('Project dismantled successfully')
        } catch (error) {
            toast.error('Deconstruction failed')
        }
        setMenuOpen(null)
    }

    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'deployed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            case 'ready': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'generating': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            default: return 'bg-white/5 text-dark-400 border-white/5'
        }
    }

    return (
        <div className="min-h-screen p-8 md:p-12 relative overflow-hidden">
            {/* Background Grain/Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] pointer-events-none" />

            {/* Dashboard Header */}
            <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <Activity className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Workspace Overview</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-black text-white tracking-tight"
                    >
                        Project <span className="text-white/40">Nexus</span>
                    </motion.h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex p-1 bg-dark-900 border border-white/5 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'grid' ? "bg-white/10 text-white shadow-lg" : "text-dark-400 hover:text-dark-200"
                            )}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                viewMode === 'list' ? "bg-white/10 text-white shadow-lg" : "text-dark-400 hover:text-dark-200"
                            )}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                    <Link href="/create">
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-primary flex items-center gap-3 px-8 py-4 text-lg font-black shadow-2xl shadow-primary-500/20"
                        >
                            <Plus className="w-6 h-6" />
                            Launch New Vision
                        </motion.button>
                    </Link>
                </div>
            </header>

            {/* Controls Bar */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div className="relative w-full sm:max-w-md group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter through your applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field pl-14 h-14 bg-dark-900/50 border-white/5 focus:border-primary-500/30"
                    />
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-6 h-14 bg-dark-900/50 border border-white/5 rounded-2xl text-dark-400 font-bold hover:text-white transition-colors w-full sm:w-auto">
                        <Filter className="w-4 h-4" />
                        Sort by: Recent
                    </button>
                </div>
            </div>

            {/* Projects Content */}
            <div className="relative z-10">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-500 opacity-50" />
                        <span className="text-sm font-bold text-dark-500 uppercase tracking-widest animate-pulse">Syncing Cloud Workspace...</span>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-indigo p-20 text-center rounded-[40px] border border-white/5"
                    >
                        <div className="w-24 h-24 rounded-3xl bg-dark-900 flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/5">
                            <Sparkles className="w-12 h-12 text-primary-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-4 italic">Your canvas is empty.</h3>
                        <p className="text-dark-400 text-lg mb-10 max-w-md mx-auto">
                            The space between ideas and reality is just one prompt away. Start building your next breakthrough.
                        </p>
                        <Link href="/create">
                            <button className="btn-primary px-10 py-5 text-xl font-black shadow-primary-500/20">Initialize First App</button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className={cn(
                        "transition-all duration-500",
                        viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "flex flex-col gap-4"
                    )}>
                        <AnimatePresence mode='popLayout'>
                            {filteredProjects.map((project, i) => (
                                <motion.div
                                    layout
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={cn(
                                        "group relative bg-dark-900/40 border border-white/5 transition-all duration-500",
                                        viewMode === 'grid' ? "rounded-[32px] overflow-hidden p-6 card-hover" : "rounded-2xl flex items-center p-4 gap-6"
                                    )}
                                >
                                    {/* Project Preview Visualization */}
                                    <div className={cn(
                                        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800 to-dark-950 border border-white/5",
                                        viewMode === 'grid' ? "aspect-video mb-6" : "w-16 h-16 shrink-0"
                                    )}>
                                        <div className="absolute inset-0 grid-pattern opacity-10" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Folder className={cn(
                                                "text-primary-500/20 group-hover:text-primary-500/40 transition-colors",
                                                viewMode === 'grid' ? "w-24 h-24" : "w-8 h-8"
                                            )} />
                                        </div>
                                        {project.deployedUrl && viewMode === 'grid' && (
                                            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="p-2 glass rounded-lg border-white/10 text-white">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-xl font-black text-white truncate leading-tight group-hover:text-primary-400 transition-colors">
                                                {project.name}
                                            </h3>

                                            <div className="relative shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setMenuOpen(menuOpen === project.id ? null : project.id);
                                                    }}
                                                    className="p-2 text-dark-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                <AnimatePresence>
                                                    {menuOpen === project.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute right-0 top-12 w-48 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20 shadow-black/50"
                                                        >
                                                            <Link href={`/editor/${project.id}`}>
                                                                <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-dark-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                                                                    <Edit3 className="w-4 h-4" /> Open Editor
                                                                </button>
                                                            </Link>
                                                            {project.deployedUrl && (
                                                                <a href={project.deployedUrl} target="_blank" rel="noopener noreferrer">
                                                                    <button className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-dark-300 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                                                                        <ExternalLink className="w-4 h-4" /> View Deploy
                                                                    </button>
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(project.id)}
                                                                className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Delete Vision
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <p className="text-sm font-medium text-dark-400 line-clamp-2 leading-relaxed mb-6">
                                            {project.description || 'System-ready application structure awaiting configuration.'}
                                        </p>

                                        {/* Project Footer Meta */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border",
                                                getStatusStyles(project.status)
                                            )}>
                                                {project.status}
                                            </span>
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-dark-500 uppercase tracking-wider italic">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Master Link (except menu) */}
                                    <Link href={`/editor/${project.id}`} className="absolute inset-0 z-0" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Global Overlay to close menus */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-[15]"
                    onClick={() => setMenuOpen(null)}
                />
            )}
        </div>
    )
}
