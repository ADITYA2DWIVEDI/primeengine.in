'use client'

import React from 'react'
import { Sparkles, Zap, Code2, Rocket, Layers, Globe, Mail, Lock, CheckCircle2 } from 'lucide-react'

const Components: Record<string, React.FC<any>> = {
    navbar: ({ props }) => (
        <nav className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg" />
                {props.logo || 'PRIME'}
            </div>
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500">
                {(props.links || ['Home', 'About', 'Contact']).map((link: string) => (
                    <span key={link}>{link}</span>
                ))}
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Portal</button>
            </div>
        </nav>
    ),
    hero: ({ props }) => (
        <div className="py-24 px-12 text-center bg-white">
            <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-[0.9] mb-8 uppercase italic">
                {props.title || 'Imagine the Future.'}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
                {props.subtitle || 'Synthesized architecture for the modern web.'}
            </p>
            <div className="flex justify-center gap-4">
                <button className="px-10 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-xl">Initialize</button>
                <button className="px-10 py-5 border-2 border-gray-100 font-black uppercase tracking-widest text-xs rounded-xl">Explore</button>
            </div>
        </div>
    ),
    features: ({ props }) => (
        <div className="py-20 px-12 grid md:grid-cols-3 gap-8 bg-gray-50">
            {(props.items || [1, 2, 3]).map((item: any, i: number) => (
                <div key={i} className="p-10 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-gray-900 italic">Core Module {i + 1}</h3>
                    <p className="text-gray-500 font-medium mb-6">High-frequency integration matrix for scalable growth.</p>
                </div>
            ))}
        </div>
    ),
    footer: () => (
        <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm font-bold uppercase tracking-widest bg-white">
            © 2026 Prime Generated Unit
        </footer>
    ),
    container: ({ children, styles }) => (
        <div style={styles} className="p-8">
            {children}
        </div>
    ),
    text: ({ props, styles }) => {
        const Tag = props.variant || 'p'
        return <Tag style={styles} className={Tag === 'h1' ? 'text-4xl font-bold' : ''}>{props.content}</Tag>
    }
}

export default function Canvas({ state }: { state: any }) {
    if (!state?.pages?.[0]) return <div className="p-20 text-center text-gray-300 font-black italic uppercase tracking-widest">Awaiting Synthesis...</div>

    const page = state.pages[0]

    return (
        <div className="w-full h-full bg-white overflow-auto scrollbar-hide">
            {page.components.map((comp: any) => {
                const Component = Components[comp.type]
                if (!Component) return null
                return <Component key={comp.id} props={comp.props} styles={comp.styles} />
            })}
        </div>
    )
}
