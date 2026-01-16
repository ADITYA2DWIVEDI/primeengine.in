'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    User, Mail, Lock, Bell, CreditCard, Shield,
    Loader2, Camera, ChevronRight, CheckCircle2,
    Activity, Eye, EyeOff, Key, Zap
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const { user } = useAuthStore()
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        name: user?.name || 'Construct Architect',
        email: user?.email || 'architect@prime-engine.ai',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        emailNotifications: true,
        pushNotifications: false,
    })

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.success('Core configuration synchronized.')
        } catch (error) {
            toast.error('Sync failed. Terminal error.')
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'profile', label: 'Identity', icon: User, desc: 'Public and private profile data' },
        { id: 'security', label: 'Security', icon: Shield, desc: 'Encryption and access control' },
        { id: 'notifications', label: 'Alerts', icon: Bell, desc: 'Real-time event synchronization' },
        { id: 'billing', label: 'Resource', icon: Zap, desc: 'Subscription and credit allocation' },
    ]

    return (
        <div className="min-h-screen p-8 md:p-12 relative overflow-hidden bg-dark-950">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <Activity className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">System Configuration</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-white tracking-tight"
                    >
                        User <span className="text-white/40">Nexus</span>
                    </motion.h1>
                </header>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:w-72 shrink-0">
                        <nav className="space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group text-left",
                                        activeTab === tab.id
                                            ? "bg-primary-500/10 border border-primary-500/20 text-white shadow-xl shadow-primary-500/5"
                                            : "text-dark-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                                            activeTab === tab.id ? "bg-primary-500 text-white" : "bg-dark-900 text-dark-500 group-hover:text-white group-hover:bg-dark-800"
                                        )}>
                                            <tab.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-black uppercase tracking-widest">{tab.label}</span>
                                            <span className="text-[10px] font-bold text-dark-500 uppercase tracking-tighter transition-all group-hover:text-dark-400">{tab.desc}</span>
                                        </div>
                                    </div>
                                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-primary-400" />}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1">
                        <AnimatePresence mode='wait'>
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="glass p-10 rounded-[40px] border border-white/5"
                                >
                                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl relative overflow-hidden">
                                                {formData.name.charAt(0)}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <Camera className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-xl border-4 border-dark-950 shadow-xl">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h2 className="text-2xl font-black text-white mb-2 italic">Architect Profile</h2>
                                            <p className="text-dark-400 max-w-sm font-medium leading-relaxed">
                                                Your digital identity and credentials used across all generated applications.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-dark-500 ml-1">Full Identity</label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="input-field pl-14 h-14 bg-dark-900 border-white/5 focus:border-primary-500/30 font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.2em] text-dark-500 ml-1">Terminal Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500 group-focus-within:text-primary-500 transition-colors" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="input-field pl-14 h-14 bg-dark-900 border-white/5 focus:border-primary-500/30 font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="btn-primary flex items-center gap-3 px-10 py-5 text-lg font-black"
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sync Profile"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="glass p-10 rounded-[40px] border border-white/5"
                                >
                                    <div className="mb-12">
                                        <h2 className="text-2xl font-black text-white mb-4 italic">Security Protocols</h2>
                                        <p className="text-dark-400 font-medium max-w-lg mb-10">
                                            Manage your encryption layers and workspace access security.
                                        </p>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="relative group">
                                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Current Verification Key"
                                                        className="input-field pl-14 h-14 bg-dark-900 border-white/5 focus:border-primary-500/30"
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="New Access Sequence"
                                                        className="input-field pl-14 h-14 bg-dark-900 border-white/5 focus:border-primary-500/30"
                                                    />
                                                    <button
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl flex items-center gap-6 group hover:bg-emerald-500/10 transition-colors">
                                                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                                                    <Shield className="w-8 h-8 text-emerald-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-black text-white italic mb-1 uppercase tracking-tight">Multi-Factor Lock</h4>
                                                    <p className="text-sm font-bold text-dark-400">Increase account integrity by 300% with hardware-backed auth.</p>
                                                </div>
                                                <button className="px-6 py-3 bg-white text-dark-950 text-xs font-black rounded-xl uppercase tracking-widest hover:scale-105 transition-transform">Activate</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 flex justify-end">
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="btn-primary flex items-center gap-3 px-10 py-5 text-lg font-black"
                                        >
                                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update Credentials"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'billing' && (
                                <motion.div
                                    key="billing"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="glass p-10 rounded-[40px] border border-white/5"
                                >
                                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                                        <div>
                                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400 mb-2 block italic">Usage Quota</span>
                                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Architect <span className="text-white/40">Tier</span></h2>
                                            <p className="text-dark-400 font-medium">Billed annually, next cycle ends Dec 12, 2026.</p>
                                        </div>
                                        <Link href="/pricing" className="btn-secondary px-8 py-4 text-xs font-black uppercase tracking-widest bg-white/5 border-white/10">
                                            View Plans
                                        </Link>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                                        <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-xs font-black uppercase tracking-widest text-dark-400 italic">AI Computes</span>
                                                <span className="text-sm font-black text-white">42 / 100</span>
                                            </div>
                                            <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "42%" }}
                                                    className="h-full bg-gradient-to-r from-primary-500 to-purple-600 rounded-full"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mt-4 italic">Resets in 18 days</p>
                                        </div>
                                        <div className="p-8 rounded-3xl bg-dark-900/60 border border-white/5">
                                            <div className="flex items-center justify-between mb-6">
                                                <span className="text-xs font-black uppercase tracking-widest text-dark-400 italic">Deployments</span>
                                                <span className="text-sm font-black text-white">8 / Unlimited</span>
                                            </div>
                                            <div className="w-full h-3 bg-dark-800 rounded-full overflow-hidden border border-white/5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "100%" }}
                                                    className="h-full bg-emerald-500 rounded-full"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black text-dark-500 uppercase tracking-widest mt-4 italic">No constraints active</p>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center grayscale">
                                                <CreditCard className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-tighter">Visa ending in •••• 4242</p>
                                                <p className="text-[10px] font-bold text-dark-500">EXPIRES 12/28</p>
                                            </div>
                                        </div>
                                        <button className="text-xs font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors">
                                            Change Billing Method
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}
