'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Zap, LayoutDashboard, FolderPlus, Layers, Settings,
    LogOut, HelpCircle, CreditCard, ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/create', icon: FolderPlus, label: 'Create App' },
    { href: '/templates', icon: Layers, label: 'Templates' },
    { href: '/settings', icon: Settings, label: 'Settings' },
]

const bottomItems = [
    { href: '/settings/billing', icon: CreditCard, label: 'Billing' },
    { href: '/help', icon: HelpCircle, label: 'Help & Support' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const { user, logout } = useAuthStore()

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-dark-900 border-r border-dark-800 flex flex-col">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-dark-800">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Prime Engine</span>
                </Link>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 2 }}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                                                : 'text-dark-300 hover:text-white hover:bg-dark-800'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-dark-800 space-y-1">
                        {bottomItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Card */}
                <div className="p-4 border-t border-dark-800">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-dark-800/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
