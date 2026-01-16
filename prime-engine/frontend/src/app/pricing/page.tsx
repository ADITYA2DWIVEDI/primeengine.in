'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Sparkles, Rocket, Globe, Shield, ArrowRight, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

const tiers = [
    {
        name: 'Initiator',
        id: 'tier-initiator',
        price: { monthly: '$0', yearly: '$0' },
        description: 'Perfect for exploring the possibilities of AI-driven construction.',
        features: [
            '3 Active Projects',
            '10 AI Generations / mo',
            'Standard Preview URL',
            'Community Support',
            'Basic Templates',
        ],
        cta: 'Start Building',
        mostPopular: false,
        variant: 'glass',
        icon: Zap
    },
    {
        name: 'Architect',
        id: 'tier-architect',
        price: { monthly: '$29', yearly: '$240' },
        description: 'Advanced tools for serious builders and high-performance apps.',
        features: [
            'Unlimited Projects',
            '100 AI Generations / mo',
            'Custom Domain Support',
            'Priority AI Models (GPT-4)',
            'Advanced Template Library',
            '24/7 Priority Support',
        ],
        cta: 'Transform Workflow',
        mostPopular: true,
        variant: 'glass-indigo',
        icon: Sparkles
    },
    {
        name: 'Enterprise',
        id: 'tier-enterprise',
        price: { monthly: 'Custom', yearly: 'Custom' },
        description: 'Bespoke infrastructure and scaling for organizations.',
        features: [
            'Dedicated AI Instance',
            'Unlimited AI Generations',
            'White-label Deployment',
            'SSO & Advanced Security',
            'SLA & Uptime Guarantees',
            'Dedicated Architect Support',
        ],
        cta: 'Contact Sales',
        mostPopular: false,
        variant: 'glass',
        icon: Shield
    },
]

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const { user } = useAuthStore()

    const handleSubscribe = async (tier: any) => {
        if (!user) {
            toast.error('Please login to subscribe')
            return
        }

        if (tier.id === 'tier-initiator') {
            toast.success('You are already on the Free plan!')
            return
        }

        if (tier.id === 'tier-enterprise') {
            toast.success('Our sales team will contact you soon!')
            return
        }

        const loadingToast = toast.loading('Initiating secure payment...')

        try {
            const amount = billingCycle === 'monthly' ? parseInt(tier.price.monthly.replace('$', '')) : parseInt(tier.price.yearly.replace('$', ''))

            const { data: order } = await api.post('/billing/order', {
                amount: amount,
                planId: tier.id,
                currency: 'USD'
            })

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Prime Engine',
                description: `Upgrade to ${tier.name}`,
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const { data } = await api.post('/billing/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                        if (data.success) {
                            toast.success('Welcome to the Architect tier!', { id: loadingToast })
                            window.location.href = '/dashboard'
                        }
                    } catch (error) {
                        toast.error('Payment verification failed', { id: loadingToast })
                    }
                },
                prefill: {
                    email: user.email,
                },
                theme: {
                    color: '#6366f1',
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
            toast.dismiss(loadingToast)
        } catch (error) {
            console.error('Subscription error:', error)
            toast.error('Failed to initiate subscription', { id: loadingToast })
        }
    }

    return (
        <div className="min-h-screen py-24 px-6 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-20 italic">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3 mb-4"
                    >
                        <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                            <Activity className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Resource Allocation</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6"
                    >
                        Choose your <span className="gradient-text">Velocity.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Transparent pricing designed to scale with your ambition.
                        No hidden mechanics, just raw construction power.
                    </motion.p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="p-1 bg-dark-900 border border-white/5 rounded-2xl flex items-center shadow-2xl">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={cn(
                                "px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                                billingCycle === 'monthly' ? "bg-white/10 text-white shadow-lg" : "text-dark-400 hover:text-dark-200"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={cn(
                                "px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                billingCycle === 'yearly' ? "bg-white/10 text-white shadow-lg" : "text-dark-400 hover:text-dark-200"
                            )}
                        >
                            Yearly
                            <span className="text-[10px] bg-primary-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative p-10 rounded-[40px] border flex flex-col group transition-all duration-500",
                                tier.variant === 'glass-indigo'
                                    ? "glass-indigo border-primary-500/30 shadow-2xl shadow-primary-500/10 scale-105 z-10"
                                    : "bg-dark-900/40 border-white/5 hover:border-white/10"
                            )}
                        >
                            {tier.mostPopular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full shadow-2xl">
                                    Most Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-2xl",
                                    tier.variant === 'glass-indigo' ? "bg-white/10" : "bg-dark-800"
                                )}>
                                    <tier.icon className={cn(
                                        "w-7 h-7",
                                        tier.variant === 'glass-indigo' ? "text-white" : "text-primary-500"
                                    )} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-2">{tier.name}</h3>
                                <p className="text-sm font-medium text-dark-400 leading-relaxed italic">{tier.description}</p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">
                                    {billingCycle === 'monthly' ? tier.price.monthly : tier.price.yearly}
                                </span>
                                {tier.price.monthly !== 'Custom' && (
                                    <span className="text-dark-500 font-bold uppercase tracking-widest text-xs">
                                        / {billingCycle === 'monthly' ? 'month' : 'year'}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3">
                                        <div className={cn(
                                            "mt-1 p-0.5 rounded-full shrink-0",
                                            tier.variant === 'glass-indigo' ? "bg-white/20" : "bg-primary-500/20"
                                        )}>
                                            <Check className={cn(
                                                "w-3 h-3",
                                                tier.variant === 'glass-indigo' ? "text-white" : "text-primary-400"
                                            )} />
                                        </div>
                                        <span className="text-sm font-bold text-dark-300 tracking-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSubscribe(tier)}
                                className={cn(
                                    "w-full py-5 rounded-[20px] text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3",
                                    tier.variant === 'glass-indigo'
                                        ? "bg-white text-dark-950 hover:bg-gray-100 shadow-xl"
                                        : "bg-dark-800 text-white hover:bg-dark-700 border border-white/5"
                                )}
                            >
                                {tier.cta}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ / Trust Footer */}
                <div className="mt-32 pt-20 border-t border-white/5 text-center">
                    <p className="text-dark-500 font-black uppercase tracking-[0.3em] text-xs mb-8">Trusted by innovators at</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
                        <div className="text-2xl font-black text-white tracking-tighter italic">VECTRA</div>
                        <div className="text-2xl font-black text-white tracking-tighter italic">AURORA</div>
                        <div className="text-2xl font-black text-white tracking-tighter italic">NEXUS</div>
                        <div className="text-2xl font-black text-white tracking-tighter italic">KINETIC</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
