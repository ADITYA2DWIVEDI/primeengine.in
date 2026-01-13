"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, Github, ArrowRight, Chrome } from "lucide-react";
import { auth as firebaseAuth, googleProvider, githubProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSocialLogin = async (provider: string) => {
        setLoading(true);
        try {
            const fireProvider = provider === 'google' ? googleProvider : githubProvider;
            const result = await signInWithPopup(firebaseAuth, fireProvider);
            const idToken = await result.user.getIdToken();

            // Pass to NextAuth to establish local session
            await signIn("credentials", {
                idToken,
                redirect: true,
                callbackUrl: "/dashboard"
            });
        } catch (error) {
            console.error("Auth Failure:", error);
            alert("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // For now, credible auth is disabled/not primary. 
        // We focus on social login or just UI demo as per current auth setup.
        alert("Please use Social Login (Google/GitHub) for now.");
    };

    return (
        <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorative Elements (Solar Theme) */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-solar-red/20 via-solar-orange/20 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-solar-yellow/20 via-solar-orange/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Main Container */}
            <div className="relative w-full max-w-[1000px] min-h-[600px] bg-white/60 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden flex flex-col md:flex-row">

                {/* Left Panel - Sign In */}
                <div className={`flex-1 p-8 md:p-12 flex flex-col justify-center transition-all duration-500 ${isSignUp ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100 flex'} md:opacity-100 md:flex`}>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            {/* Logo Placeholder */}
                            <div className="w-8 h-8 bg-gradient-to-br from-solar-red to-solar-yellow rounded-lg flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Prime Engine</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Sign In</h1>
                        <p className="text-slate-500">Welcome back! Sign in to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-solar-orange transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-white/70 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-solar-orange/50 focus:border-solar-orange transition-all shadow-sm group-hover:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-solar-orange transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/70 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-solar-orange/50 focus:border-solar-orange transition-all shadow-sm group-hover:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Remember me</span>
                            <button type="button" className="text-solar-orange font-medium hover:text-solar-red transition-colors">Forgot password?</button>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-solar-red to-solar-orange hover:from-red-600 hover:to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-solar-orange/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 text-slate-400 bg-[#FAFAFA]/0 bg-opacity-0 backdrop-blur-xl">Continue with</span></div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={() => handleSocialLogin('google')} className="p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all group">
                            <Chrome className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <button onClick={() => handleSocialLogin('github')} className="p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all group">
                            <Github className="w-6 h-6 text-slate-600 group-hover:text-black transition-colors" />
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500 md:hidden">
                        No account? <button onClick={() => setIsSignUp(true)} className="text-solar-orange font-bold">Sign up!</button>
                    </div>
                </div>

                {/* Center/Divider Area (Desktop) - Could act as the 3D mascot area */}
                <div className="hidden md:flex w-[80px] items-center justify-center relative z-10">
                    <div className="absolute inset-y-8 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent left-1/2"></div>
                    <div className="w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center relative z-20">
                        <span className="text-solar-orange font-bold text-lg">OR</span>
                    </div>
                </div>

                {/* Right Panel - Sign Up */}
                <div className={`flex-1 p-8 md:p-12 flex flex-col justify-center transition-all duration-500 ${!isSignUp ? 'opacity-0 pointer-events-none hidden md:flex' : 'opacity-100 flex'} md:opacity-100 md:flex`}>
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            {/* Logo Placeholder */}
                            <div className="w-8 h-8 bg-gradient-to-br from-solar-red to-solar-yellow rounded-lg flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Prime Engine</span>
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">Sign Up</h1>
                        <p className="text-slate-500">Get started quickly—all from a single platform.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-solar-orange transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full bg-white/70 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-solar-orange/50 focus:border-solar-orange transition-all shadow-sm group-hover:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-solar-orange transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-white/70 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-solar-orange/50 focus:border-solar-orange transition-all shadow-sm group-hover:bg-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-solar-orange transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/70 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-700 outline-none focus:ring-2 focus:ring-solar-orange/50 focus:border-solar-orange transition-all shadow-sm group-hover:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-solar-orange to-solar-yellow hover:from-orange-500 hover:to-yellow-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-solar-orange/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-4 text-slate-400 bg-[#FAFAFA]/0 bg-opacity-0 backdrop-blur-xl">Continue with</span></div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button onClick={() => handleSocialLogin('google')} className="p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all group">
                            <Chrome className="w-6 h-6 text-slate-600 group-hover:text-blue-500 transition-colors" />
                        </button>
                        <button onClick={() => handleSocialLogin('github')} className="p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white transition-all group">
                            <Github className="w-6 h-6 text-slate-600 group-hover:text-black transition-colors" />
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-500 md:hidden">
                        Already have an account? <button onClick={() => setIsSignUp(false)} className="text-solar-orange font-bold">Sign in</button>
                    </div>
                </div>
            </div>

            {/* Mobile Toggle Button (Floating) - Optional if inline links are sufficient */}
            {/* 
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-full p-1 border border-slate-100 flex gap-1 z-50">
          <button onClick={() => setIsSignUp(false)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isSignUp ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>Sign In</button>
          <button onClick={() => setIsSignUp(true)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isSignUp ? 'bg-solar-orange text-white shadow-lg' : 'text-slate-500'}`}>Sign Up</button>
      </div> 
      */}
        </div>
    );
}
