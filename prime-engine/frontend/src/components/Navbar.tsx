'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isAuthenticated } = useAuthStore()

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">Prime Engine</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/templates" className="text-dark-300 hover:text-white transition-colors">
                            Templates
                        </Link>
                        <Link href="/pricing" className="text-dark-300 hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link href="/docs" className="text-dark-300 hover:text-white transition-colors">
                            Docs
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn-primary"
                                >
                                    Dashboard
                                </motion.button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login">
                                    <button className="btn-ghost">Log In</button>
                                </Link>
                                <Link href="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="btn-primary"
                                    >
                                        Get Started
                                    </motion.button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-dark-300 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden mt-4 pb-4"
                        >
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/templates"
                                    className="text-dark-300 hover:text-white transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Templates
                                </Link>
                                <Link
                                    href="/pricing"
                                    className="text-dark-300 hover:text-white transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/docs"
                                    className="text-dark-300 hover:text-white transition-colors py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Docs
                                </Link>
                                <div className="flex flex-col gap-3 pt-4 border-t border-dark-700">
                                    {isAuthenticated ? (
                                        <Link href="/dashboard">
                                            <button className="btn-primary w-full">Dashboard</button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href="/login">
                                                <button className="btn-secondary w-full">Log In</button>
                                            </Link>
                                            <Link href="/signup">
                                                <button className="btn-primary w-full">Get Started</button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}
