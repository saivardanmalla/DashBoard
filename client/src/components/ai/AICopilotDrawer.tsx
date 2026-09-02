import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, User, Loader2 } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAICopilot } from '../../hooks/useApi';
import { useProjects } from '../../hooks/useApi';
import { useAIContext } from '../../hooks/useAIContext';

export const AICopilotDrawer: React.FC = () => {
  const { isAICopilotOpen, toggleAICopilot } = useUIStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your SYNORA AI Copilot. I can access your project memory, tasks, documents, and team data. What can I help you with?',
    },
  ]);

  const copilotMutation = useAICopilot();
  const { data: projects } = useProjects();
  const aiContext = useAIContext();
  const defaultProjectId = projects?.[0]?._id;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);

    if (!defaultProjectId) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'No project found. Please create a project first to use the AI Copilot.' },
      ]);
      return;
    }

    try {
      const history = messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      }));

      const result = await copilotMutation.mutateAsync({
        projectId: defaultProjectId,
        query: userMsg,
        history: history.slice(-6), // Keep last 6 messages for context
      });

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: result.answer },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I encountered an error processing your request. Please try again.' },
      ]);
    }
  };

  return (
    <AnimatePresence>
      {isAICopilotOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAICopilot}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-slate-900 border-l border-slate-800/80 z-50 flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">SYNORA AI Copilot</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                    </p>
                    <p className="text-[10px] text-brand-300 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 truncate max-w-[140px]">
                      Context: {aiContext.name}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={toggleAICopilot} className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center flex-shrink-0 text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {copilotMutation.isPending && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-brand-600/30 text-brand-400 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700/60 rounded-xl rounded-tl-none p-3">
                    <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-800/80 bg-slate-900/80">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-brand-500 transition-colors">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !copilotMutation.isPending && handleSend()}
                  placeholder={`Ask about ${aiContext.name}...`}
                  className="w-full bg-transparent text-xs text-slate-100 focus:outline-none placeholder-slate-500"
                  disabled={copilotMutation.isPending}
                />
                <button
                  onClick={handleSend}
                  disabled={copilotMutation.isPending || !input.trim()}
                  className="p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500 disabled:opacity-40 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
