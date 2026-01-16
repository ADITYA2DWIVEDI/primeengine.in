'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import { authAPI } from '@/lib/api'
import toast from 'react-hot-toast'

export default function SignupPage() {
    const router = useRouter()
    const { setUser } = useAuthStore()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, { displayName: name })
            const idToken = await userCredential.user.getIdToken()

            const response = await authAPI.signup(email, password, name)
            setUser(response.data.user, idToken)

            toast.success('Your Prime Engine journey begins now!')
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error.message || 'Creation failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setIsLoading(true)
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const idToken = await result.user.getIdToken()

            const response = await authAPI.googleAuth(idToken)
            setUser(response.data.user, idToken)

            toast.success('Welcome to the workspace!')
            router.push('/dashboard')
        } catch (error: any) {
            toast.error(error.message || 'Google signup failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-dark-950">
            {/* Immersive Background */}
            <div className="absolute inset-0 mesh-bg opacity-40 rotate-180" />
            <div className="absolute top-0 left-0 w-full h-full grid-pattern opacity-20 pointer-events-none" />

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-dark-400 hover:text-white transition-colors group z-20">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-primary-600 items-center justify-center shadow-2xl shadow-primary-500/20 mb-6 mx-auto glow">
                        <Zap className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Join Prime Engine</h1>
                    <p className="text-dark-400 font-medium text-lg">Build the apps you visioned, today.</p>
                </div>

                {/* Main Auth Card */}
                <div className="glass p-10 rounded-[40px] border border-white/10 shadow-2xl">
                    {/* Google OAuth */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-4 px-6 py-4 bg-white text-dark-950 font-bold rounded-2xl hover:bg-gray-100 transition-all mb-8 shadow-lg shadow-white/5"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Get Started with Google
                    </motion.button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-dark-900/60 backdrop-blur-md rounded-full text-dark-500 font-bold uppercase tracking-widest py-1 border border-white/5">
                                design your identity
                            </span>
                        </div>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark-300 uppercase tracking-widest ml-1 italic">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Builder Name"
                                    required
                                    className="input-field pl-14 h-14 bg-dark-950/50 border-white/10 focus:border-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark-300 uppercase tracking-widest ml-1 italic">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="builder@craft.com"
                                    required
                                    className="input-field pl-14 h-14 bg-dark-950/50 border-white/10 focus:border-purple-500/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark-300 uppercase tracking-widest ml-1 italic">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-purple-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mix symbols, numbers, letters"
                                    required
                                    minLength={8}
                                    className="input-field pl-14 pr-14 h-14 bg-dark-950/50 border-white/10 focus:border-purple-500/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full h-14 bg-gradient-to-r from-purple-600 to-primary-600 flex items-center justify-center gap-3 text-lg font-black shadow-xl shadow-purple-500/10"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-dark-400 font-bold tracking-tight">
                            Already have an account?{' '}
                            <Link href="/login" title="Sign In" className="text-secondary-400 hover:text-secondary-300 text-purple-400 transition-all underline decoration-2 underline-offset-4">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest leading-relaxed">
                            By continuing, you consent to our <br />
                            <Link href="/terms" className="text-dark-400 underline underline-offset-2">Terms</Link> & <Link href="/privacy" className="text-dark-400 underline underline-offset-2">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
