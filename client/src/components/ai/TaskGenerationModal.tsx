import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Check, X, ArrowRight, Loader2 } from 'lucide-react';

export const TaskGenerationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}> = ({ isOpen, onClose }) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<{ milestone: string; tasks: any[] } | null>(null);

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setPlan({
        milestone: 'Sprint - Feature Architecture Breakdown',
        tasks: [
          {
            title: 'Design API Gateway & Webhook Contracts',
            description: promptText,
            priority: 'HIGH',
            subtasks: ['Setup Express Routers', 'Define Zod Validators', 'Unit Tests'],
          },
          {
            title: 'Implement Framer Motion Layout State Machine',
            description: 'Coordinate UI state synchronization with Socket.IO project rooms.',
            priority: 'MEDIUM',
            subtasks: ['Kanban Board animations', 'Command palette shortcut handlers'],
          },
        ],
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 text-sm">AI Task & Sprint Generator</h3>
                  <p className="text-xs text-slate-400">Context-aware milestone breakdown</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {!plan ? (
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-slate-300">
                    Describe the feature or component requirements:
                  </label>
                  <textarea
                    rows={4}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    placeholder="e.g. Build an AI-driven automated attendance recognition microservice..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    disabled={isLoading || !promptText.trim()}
                    onClick={handleGenerate}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synthesizing Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Generate Structured Tasks
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-indigo-400 tracking-wider">Milestone</span>
                    <h4 className="font-semibold text-slate-100 text-sm">{plan.milestone}</h4>
                  </div>
                  {plan.tasks.map((t, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs text-slate-200">{t.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {t.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{t.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {plan && (
              <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setPlan(null)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" /> Back
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & Save
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
