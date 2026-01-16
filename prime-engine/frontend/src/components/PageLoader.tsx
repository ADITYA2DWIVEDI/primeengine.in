'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'

export default function PageLoader() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        y: '-100%',
                        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
                    }}
                    className="fixed inset-0 z-[10000] bg-dark-950 flex flex-col items-center justify-center"
                >
                    <div className="relative">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-4xl md:text-6xl font-black gradient-text tracking-tighter mb-8"
                        >
                            PRIME ENGINE
                        </motion.div>
                        <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden">
                            <motion.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-primary-500"
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 text-dark-400 font-black uppercase tracking-[0.4em] text-xs"
                    >
                        Initializing AI Clusters...
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
