'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Sparkles, Mic, MicOff, ArrowRight, Loader2,
    Lightbulb, Wand2, LayoutGrid, Code2
} from 'lucide-react'
import { projectsAPI } from '@/lib/api'
import { useProjectStore } from '@/store/projectStore'
import toast from 'react-hot-toast'

const promptSuggestions = [
    {
        icon: LayoutGrid,
        title: 'SaaS Dashboard',
        prompt: 'Build a modern SaaS analytics dashboard with user authentication, team management, and subscription billing using Stripe.'
    },
    {
        icon: Code2,
        title: 'Task Manager',
        prompt: 'Create a task management app with kanban boards, drag-and-drop, team collaboration, and due date reminders.'
    },
    {
        icon: Wand2,
        title: 'AI Chatbot',
        prompt: 'Build an AI-powered customer support chatbot with conversation history, knowledge base, and human handoff features.'
    },
    {
        icon: Lightbulb,
        title: 'Portfolio Site',
        prompt: 'Design a creative portfolio website with project showcase, blog, contact form, and smooth animations.'
    },
]

export default function CreatePage() {
    const router = useRouter()
    const { addProject } = useProjectStore()
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [isListening, setIsListening] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Please describe your app')
            return
        }

        setIsGenerating(true)
        try {
            const response = await projectsAPI.generate(prompt)
            addProject(response.data.project)
            toast.success('App generated successfully!')
            router.push(`/editor/${response.data.project.id}`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Generation failed')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            toast.error('Voice input not supported in this browser')
            return
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = false

        recognition.onstart = () => setIsListening(true)
        recognition.onend = () => setIsListening(false)
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setPrompt((prev) => prev + ' ' + transcript)
        }
        recognition.onerror = () => {
            setIsListening(false)
            toast.error('Voice recognition error')
        }

        recognition.start()
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-sm text-dark-200">AI-Powered Generation</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-white">Describe Your </span>
                        <span className="gradient-text">Dream App</span>
                    </h1>
                    <p className="text-xl text-dark-300 max-w-2xl mx-auto">
                        Tell us what you want to build in plain English. Our AI will generate
                        a complete full-stack application for you.
                    </p>
                </motion.div>

                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card mb-8"
                >
                    <div className="relative">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Example: Build a project management app with team collaboration, task boards, real-time updates, and role-based access control..."
                            rows={6}
                            className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-dark-500 resize-none focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                        />
                        <button
                            onClick={handleVoiceInput}
                            className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all ${isListening
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-dark-700 text-dark-400 hover:text-white hover:bg-dark-600'
                                }`}
                        >
                            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                        <p className="text-sm text-dark-500">
                            {prompt.length} characters
                            {prompt.length > 50 && <span className="text-green-400 ml-2">✓ Good detail</span>}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt.trim()}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate App
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-dark-300 mb-4">Need inspiration? Try these:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {promptSuggestions.map((suggestion, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setPrompt(suggestion.prompt)}
                                className="card text-left hover:border-primary-500/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
                                        <suggestion.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">{suggestion.title}</h4>
                                        <p className="text-sm text-dark-400 line-clamp-2">{suggestion.prompt}</p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Generation Progress (shown when generating) */}
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 card"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Generating your app...</h4>
                                <p className="text-sm text-dark-400">This usually takes 30-60 seconds</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {['Analyzing requirements', 'Designing architecture', 'Generating components', 'Creating API routes'].map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary-500 animate-pulse' : 'bg-dark-600'}`} />
                                    <span className={`text-sm ${i === 0 ? 'text-white' : 'text-dark-500'}`}>{step}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
