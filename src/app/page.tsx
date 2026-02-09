'use client';

import { useState, useEffect } from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";
import { generateCodeFromImage } from './actions';
import { PenTool, Monitor, Loader2, Upload, Sparkles } from 'lucide-react';

export default function Home() {
  const [code, setCode] = useState('export default function App() { return <div className="p-10 text-center text-slate-400">Your ScribbleScript will appear here...</div> }');
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "ScribbleScript | Sketch to React";
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreviewImage(base64);
      setLoading(true);
      try {
        const result = await generateCodeFromImage(base64);
        setCode(result);
      } catch (err) {
        console.error("AI Error:", err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 selection:bg-amber-500/30 font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-500/20">
            <PenTool size={22} className="text-slate-900" />
          </div>
          <span className="font-black text-2xl tracking-tighter">
            Scribble<span className="text-amber-400">Script</span>
          </span>
        </div>
        
        <label className="group flex items-center gap-2 bg-amber-400 text-slate-950 px-6 py-2 rounded-full font-bold cursor-pointer hover:bg-amber-300 transition-all active:scale-95 shadow-lg shadow-amber-500/20">
          <Upload size={18} />
          Upload Image
          <input type="file" onChange={handleUpload} className="hidden" accept="image/*" />
        </label>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-80px)]">
        {/* Left Panel: Input View */}
        <div className="lg:col-span-3 border-r border-slate-800 p-6 bg-slate-900/30 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 text-slate-400">
            <Monitor size={16} />
            <h2 className="text-xs font-bold uppercase tracking-widest">Input Source</h2>
          </div>
          
          {previewImage ? (
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl transition-transform hover:rotate-1">
              <img src={previewImage} alt="Sketch" className="w-full object-cover" />
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-center p-6 bg-slate-950/50">
              <PenTool className="mb-4 opacity-10" size={48} />
              <p className="text-sm">Upload a sketch to<br/>start the magic.</p>
            </div>
          )}

          <div className="mt-10 p-5 rounded-2xl bg-amber-400/5 border border-amber-400/10">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Sparkles size={14} />
              <h3 className="text-xs font-bold uppercase">AI Engine</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by <strong>Gemini 3 Flash</strong>. ScribbleScript converts hand-drawn shapes and labels into production-ready React components instantly.
            </p>
          </div>
        </div>

        {/* Right Panel: Code Execution */}
        <div className="lg:col-span-9 relative bg-[#020617]">
          {loading && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center">
              <div className="relative">
                <Loader2 className="animate-spin text-amber-400" size={64} />
              </div>
              <p className="mt-6 text-xl font-bold tracking-tight text-white">Inking your code...</p>
              <p className="text-slate-400 text-sm mt-2">Gemini 3 is interpreting your sketch</p>
            </div>
          )}
          
          <div className="h-full">
             <Sandpack 
              template="react" 
              theme="dark"
              files={{ "/App.js": code }}
              options={{ 
                externalResources: ["https://cdn.tailwindcss.com"],
                showConsole: false,
                editorHeight: "100%" 
              }}
              customSetup={{
                dependencies: {
                  "lucide-react": "latest",
                  "framer-motion": "latest",
                  "clsx": "latest",
                  "tailwind-merge": "latest"
                }
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}