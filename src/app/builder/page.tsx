"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Code, Monitor, Play, Check, X, Github, Cloud } from "lucide-react";
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
            } else if (data.error) {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error("Generation failed", error);
            alert(`Generation Failed: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar / Prompt Area */}
            <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shadow-xl z-20 relative">
                {/* Decorative Gradient Background */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-solar-red via-solar-orange to-solar-yellow" />
                <div className="absolute top-0 right-0 p-20 bg-solar-red/5 blur-3xl rounded-full translate-x-10 -translate-y-10 pointer-events-none" />

                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <button onClick={() => router.push("/dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-semibold text-slate-700">Gemini Flash 1.5</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Instruction</label>
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe your dream app... (e.g. 'A landing page for a coffee shop with a hero section and menu grid')"
                                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-solar-orange focus:border-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400 transition-all group-hover:bg-white group-hover:shadow-md"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                                <span className="text-xs text-slate-400">{prompt.length} chars</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className="w-full py-4 bg-gradient-to-r from-zinc-900 to-black hover:from-solar-red hover:to-solar-orange disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-solar-orange/20 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Generating Magic...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 group-hover:text-white transition-colors" />
                                Generate Website
                            </>
                        )}
                    </button>

                    {generatedCode && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800 text-sm">Generation Complete</h4>
                                <p className="text-xs text-green-600">Ready to deploy.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <p className="text-xs text-center text-slate-400">
                        Powered by <span className="font-bold text-slate-600">Prime Engine AI</span>
                    </p>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-solar-red/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-70 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-solar-yellow/5 rounded-full blur-3xl pointer-events-none mix-blend-multiply opacity-70 animate-pulse delay-700" />

                <header className="h-16 border-b border-white/20 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm z-20">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200/50">
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
                                <Cloud className="w-4 h-4 text-white" />
                                Deploy to Vercel
                            </a>
                        </div>
                    </div>
                )}

                {/* Main Preview Content */}
                <div className="flex-1 bg-slate-50/50 p-8 flex items-center justify-center overflow-auto relative z-10">
                    {!generatedCode && !loading && (
                        <div className="text-center max-w-md text-slate-400">
                            <div className="w-16 h-16 bg-white border border-slate-200 rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm">
                                <Monitor className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-600 mb-1">Ready to build</h3>
                            <p>Enter a prompt on the left to generate your React application.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 border-4 border-solar-orange/30 border-t-solar-orange rounded-full animate-spin"></div>
                            <p className="mt-4 font-medium text-solar-orange animate-pulse">Designing your app...</p>
                        </div>
                    )}

                    {generatedCode && (
                        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative ring-1 ring-black/5">
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
                            const { ArrowRight, Check, Star, Menu, X, Github, Twitter, Linkedin, Mail } = window;
                            const motion = {
                              div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
                              button: ({ children, className, ...props }) => <button className={className} {...props}>{children}</button>,
                              h1: ({ children, className, ...props }) => <h1 className={className} {...props}>{children}</h1>,
                              p: ({ children, className, ...props }) => <p className={className} {...props}>{children}</p>,
                            };
                            ${generatedCode.replace(/import .* from .*/g, "").replace(/export default/g, "const App =")} 
                            const root = ReactDOM.createRoot(document.getElementById('root'));
                            root.render(<App />);
                          </script>
                          <script>
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
