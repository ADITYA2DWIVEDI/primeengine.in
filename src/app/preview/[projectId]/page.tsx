"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PreviewPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.projectId;
    const theme = searchParams.get("theme") || "solar";

    const [projectData, setProjectData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/projects?id=${projectId}`);
                const data = await res.json();
                setProjectData(data);
            } catch (err) {
                console.error("Failed to fetch project for preview:", err);
            } finally {
                setLoading(false);
            }
        };
        if (projectId) fetchProject();
    }, [projectId]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-solar-orange" />
            </div>
        );
    }

    if (!projectData) {
        return (
            <div className="h-screen flex items-center justify-center bg-background text-foreground/40 font-mono text-[10px] uppercase tracking-widest">
                Neural Link Not Found
            </div>
        );
    }

    const mainPage = projectData.pages?.[0];
    if (!mainPage) {
        return (
            <div className="h-screen flex items-center justify-center bg-background text-foreground/40 font-mono text-[10px] uppercase tracking-widest">
                No Pages Found
            </div>
        );
    }

    const inspectorActive = searchParams.get("inspector") === "true";

    // Prepare components code map
    const componentsCode = projectData.components?.map((c: any) => {
        return `// component: ${c.name}\n${c.code.replace(/export default/g, `const ${c.name} =`)}`;
    }).join("\n\n");

    const srcDoc = `
        <!DOCTYPE html>
        <html class="${theme}">
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://unpkg.com/lucide@latest"></script>
                <script src="https://unpkg.com/framer-motion/dist/framer-motion.js"></script>
                <style>
                    body { font-family: 'Inter', sans-serif; margin: 0; }
                    ::-webkit-scrollbar { width: 4px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
                    .solar body { background: #000; color: #fff; }
                    
                    .inspector-active * { cursor: crosshair !important; }
                    .inspector-hover { outline: 2px solid #ff944d !important; outline-offset: -2px; }
                </style>
            </head>
            <body class="${inspectorActive ? 'inspector-active' : ''}">
                <div id="root"></div>
                <script type="text/babel">
                    // Global dependencies
                    const { ArrowRight, Check, Star, Menu, X, Github, Twitter, Linkedin, Mail, Zap, Rocket, Globe, Layers, Code, Play } = window.lucide;
                    const { motion, AnimatePresence } = window.Motion;

                    // Mock imports for components
                    ${componentsCode}

                    // Main Page
                    ${mainPage.code.replace(/import .* from .*/g, (match: string) => {
        // Try to resolve internal components
        const compMatch = match.match(/import (\w+) from ['"]@\/components\/(\w+)['"]/);
        if (compMatch) return ""; // Handled by injecting all components
        return ""; // For now, strip other imports
    }).replace(/export default/g, "const App =")}

                    const root = ReactDOM.createRoot(document.getElementById('root'));
                    root.render(<App />);
                    
                    // Inspector Logic
                    if (${inspectorActive}) {
                        document.addEventListener('mouseover', (e) => {
                            e.stopPropagation();
                            if (e.target.classList) e.target.classList.add('inspector-hover');
                        });
                        document.addEventListener('mouseout', (e) => {
                            e.stopPropagation();
                            if (e.target.classList) e.target.classList.remove('inspector-hover');
                        });
                        document.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Report click to parent
                            window.parent.postMessage({ 
                                type: 'INSPECTOR_CLICK', 
                                fileName: '${mainPage.name}' 
                            }, '*');
                        }, true);
                    }

                    // Trigger Lucide icons
                    setTimeout(() => {
                         if (window.lucide) window.lucide.createIcons();
                    }, 100);
                </script>
            </body>
        </html>
    `;

    return (
        <iframe
            srcDoc={srcDoc}
            className="w-full h-full border-none"
            title="Project Preview"
        />
    );
}
