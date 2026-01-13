"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Code, Monitor, Play, Check, X, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function BuilderPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [prompt, setPrompt] = useState("");
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [deploying, setDeploying] = useState(false);
    const [deployResult, setDeployResult] = useState<{ repoUrl: string, deployUrl: string } | null>(null);
    const [view, setView] = useState<"preview" | "code">("preview");

    const handleDeploy = async () => {
        if (!generatedCode) return;
        setDeploying(true);
        try {
            const res = await fetch("/api/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: generatedCode, prompt }),
            });

            if (res.status === 401) {
                alert("Please login with GitHub to deploy!");
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Deployment failed");
            }

            if (data.repoUrl) {
                setDeployResult(data);
            }
        } catch (error: any) {
            console.error("Deploy failed", error);
            alert(`Deployment Failed: ${error.message || "Unknown error"}`);
        } finally {
            setDeploying(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setLoading(true);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data = await res.json();
            if (data.code) {
                setGeneratedCode(data.code);
            }
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b bg-white flex items-center justify-between px-6 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="font-semibold text-slate-800">AI Builder</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setView("preview")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-shadow ${view === "preview" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Preview
                        </div>
                    </button>
                    <button
                        onClick={() => setView("code")}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-shadow ${view === "code" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                    >
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            Code
                        </div>
                    </button>
                </div>

                {!session?.user ? (
                    <button
                        onClick={() => signIn('github')}
                        className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Github className="w-4 h-4" />
                        Login to Deploy
                    </button>
                ) : (
                    // @ts-ignore
                    !session.user.githubAccessToken ? (
                        <button
                            onClick={() => signIn('github')}
                            className="bg-[#24292e] hover:bg-[#1b1f23] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Github className="w-4 h-4" />
                            Connect GitHub
                        </button>
                    ) : (
                        <button
                            onClick={handleDeploy}
                            disabled={deploying || !generatedCode}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            {deploying ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Pushing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Deploy
                                </>
                            )}
                        </button>
                    )
                )}
            </header>

            {deployResult && (
                <div className="absolute top-20 right-6 z-50 p-4 bg-white rounded-xl shadow-2xl border border-green-100 w-80 animate-in slide-in-from-top-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-green-600 flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            Deployed Successfully!
                        </h3>
                        <button onClick={() => setDeployResult(null)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">Your app has been pushed to GitHub.</p>
                    <div className="space-y-2">
                        <a href={deployResult.repoUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                            View GitHub Repo
                        </a>
                        <a href={deployResult.deployUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-white" viewBox="0 0 1155 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
                            </svg>
                            Deploy to Vercel
                        </a>
                    </div>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar / Prompt Area */}
                <div className="w-[400px] border-r bg-white flex flex-col z-10">
                    <div className="p-6 flex-1 overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            Describe your app
                        </h2>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. A landing page for a coffee shop with a hero section, features list, and a newsletter form."
                            className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-slate-800 placeholder:text-slate-400 text-sm leading-relaxed"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Sparkles className="w-4 h-4 animate-spin" />
                                    Generating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Website
                                </>
                            )}
                        </button>

                        {generatedCode && (
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">History</h3>
                                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600 truncate">
                                    {prompt}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Preview Area */}
                <div className="flex-1 bg-slate-100 p-8 flex items-center justify-center overflow-auto relative">
                    {!generatedCode && !loading && (
                        <div className="text-center max-w-md text-slate-400">
                            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto flex items-center justify-center mb-4">
                                <Monitor className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-600 mb-1">Ready to build</h3>
                            <p>Enter a prompt on the left to generate your React application.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <p className="mt-4 font-medium text-blue-600 animate-pulse">Writing code...</p>
                        </div>
                    )}

                    {generatedCode && (
                        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative">
                            {view === "preview" ? (
                                <iframe
                                    srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <script src="https://cdn.tailwindcss.com"></script>
                              <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
                              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
                              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                              <script src="https://unpkg.com/lucide@latest"></script>
                              <style>body { font-family: 'Inter', sans-serif; }</style>
                            </head>
                            <body>
                              <div id="root"></div>
                              <script type="text/babel">
                                // Mock lucide-react since it's used in generated code
                                const { ArrowRight, Check, Star, Menu, X, Github, Twitter, Linkedin, Mail } = window;
                                
                                // Mock framer-motion (basic)
                                const motion = {
                                  div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
                                  button: ({ children, className, ...props }) => <button className={className} {...props}>{children}</button>,
                                  h1: ({ children, className, ...props }) => <h1 className={className} {...props}>{children}</h1>,
                                  p: ({ children, className, ...props }) => <p className={className} {...props}>{children}</p>,
                                };

                                ${generatedCode.replace(/import .* from .*/g, "") // Remove imports 
                                            .replace(/export default/g, "const App =")} 
                                
                                const root = ReactDOM.createRoot(document.getElementById('root'));
                                root.render(<App />);
                              </script>
                              <script>
                                // Post-render Lucide handling
                                setTimeout(() => lucide.createIcons(), 100);
                              </script>
                            </body>
                          </html>
                        `}
                                    className="w-full h-full"
                                    title="Preview"
                                />
                            ) : (
                                <div className="w-full h-full overflow-auto bg-[#1e1e1e] p-4">
                                    <pre className="text-sm font-mono text-zinc-300">
                                        {generatedCode}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
