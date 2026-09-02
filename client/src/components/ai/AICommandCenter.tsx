import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sparkles, X, ArrowRight, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { ActionPreview } from './ActionPreview';

export const AICommandCenter: React.FC = () => {
  const { isCommandCenterOpen, setCommandCenter } = useUIStore();
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setIsProcessing(true);
    setPreview(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/ai/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      if (data.success) {
        setPreview(data.data);
      }
    } catch (error) {
      console.error('Failed to process command', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecute = () => {
    setPreview(null);
    setCommand('');
    setCommandCenter(false);
  };

  return (
    <AnimatePresence>
      {isCommandCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="relative w-full max-w-4xl h-[80vh] bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-semibold text-slate-100">AI Command Center</h2>
              </div>
              <button
                onClick={() => setCommandCenter(false)}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-slate-300 mb-2">What would you like to do?</h3>
                <p className="text-slate-500 text-sm">Control the entire authorized workspace using natural language.</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs text-slate-400">
                  <span className="px-3 py-1.5 bg-slate-800/50 rounded-full">"Show all projects at risk"</span>
                  <span className="px-3 py-1.5 bg-slate-800/50 rounded-full">"Create a sprint for next Monday"</span>
                  <span className="px-3 py-1.5 bg-slate-800/50 rounded-full">"Find tasks blocked by authentication"</span>
                </div>
              </div>

              {preview && (
                <div className="max-w-2xl mx-auto">
                  <ActionPreview preview={preview} onExecute={handleExecute} onCancel={() => setPreview(null)} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-xl">
              <form onSubmit={handleCommandSubmit} className="relative max-w-3xl mx-auto flex items-center">
                <Sparkles className="absolute left-4 w-5 h-5 text-brand-400" />
                <input
                  autoFocus
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Type a command..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 rounded-xl pl-12 pr-14 py-4 focus:outline-none focus:border-brand-500/50 focus:bg-slate-800 transition-all text-lg shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!command.trim() || isProcessing}
                  className="absolute right-3 p-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
