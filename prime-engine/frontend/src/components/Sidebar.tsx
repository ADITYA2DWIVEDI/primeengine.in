'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Home,
    Layers,
    Box,
    MessageSquare,
    BarChart3,
    HelpCircle,
    Settings,
    CreditCard,
    Zap,
    Info
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
    { icon: Home, label: 'Landing', href: '/' },
    { icon: Layers, label: 'Dashboard', href: '/dashboard' },
    { icon: Box, label: 'Templates', href: '/templates' },
    { icon: Zap, label: 'Pricing', href: '/pricing' },
    { icon: Info, label: 'About & FAQ', href: '/about' },
]

const bottomItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-8 glass-indigo z-50 border-r border-white/5">
            {/* Logo */}
            <Link href="/" className="mb-12 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Box className="w-7 h-7 text-white" />
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-5">
                {navItems.map((item, i) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={i} href={item.href} className="group relative">
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                    isActive
                                        ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20"
                                        : "text-dark-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                            </motion.div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-6 px-4 py-2 bg-dark-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-[60] border border-white/5 shadow-2xl italic">
                                {item.label}
                            </div>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute -left-6 w-1.5 h-8 bg-primary-500 rounded-r-full shadow-[2px_0_10px_rgba(99,102,241,0.5)]"
                                />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom Section */}
            <div className="flex flex-col gap-5 mt-auto">
                {bottomItems.map((item, i) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={i} href={item.href} className="group relative">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                                isActive
                                    ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20"
                                    : "text-dark-500 hover:text-white hover:bg-white/5"
                            )}>
                                <item.icon className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            </div>
                            <div className="absolute left-full ml-6 px-4 py-2 bg-dark-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-[60] border border-white/5 shadow-2xl italic">
                                {item.label}
                            </div>
                        </Link>
                    )
                })}

                {/* Profile Placeholder (Link to Settings for now) */}
                <Link href="/settings" className="group relative mt-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-950 border border-white/5 flex items-center justify-center overflow-hidden hover:border-primary-500/50 transition-all hover:scale-105">
                        <span className="text-xs font-black text-primary-400 group-hover:text-white transition-colors">US</span>
                    </div>
                </Link>
            </div>
        </aside>
    )
}
