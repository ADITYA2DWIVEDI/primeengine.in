"use client";

import { motion } from "framer-motion";
import { Plus, Folder } from "lucide-react";

export default function DashboardPage() {
    const projects = [
        // Placeholder data
        { id: 1, name: "E-commerce Platform", updatedAt: "2h ago", type: "Web App" },
        { id: 2, name: "Portfolio Site", updatedAt: "1d ago", type: "Landing Page" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                    <p className="text-zinc-400 text-sm mt-1">Manage and deploy your AI-generated applications.</p>
                </div>
                <button className="bg-solar-gradient text-black font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Create Card */}
                <button className="group h-48 rounded-xl border border-dashed border-white/10 hover:border-solar-orange/50 hover:bg-solar-orange/5 transition-all flex flex-col items-center justify-center gap-4 text-zinc-400 hover:text-solar-orange">
                    <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-solar-orange/20 flex items-center justify-center transition-colors">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="font-medium">Create new project</span>
                </button>

                {/* Project Cards */}
                {projects.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="h-48 rounded-xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
                    >
                        <div className="flex items-start justify-between">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                <Folder className="w-5 h-5" />
                            </div>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg group-hover:text-solar-orange transition-colors">{project.name}</h3>
                            <p className="text-xs text-zinc-500 mt-1">{project.type} • {project.updatedAt}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
