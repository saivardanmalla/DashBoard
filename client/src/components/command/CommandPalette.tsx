import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, CheckSquare, Bot, MessageSquare, FileUp, FolderKanban,
  Users, BarChart3, Plus, Sparkles, Brain, ArrowRight, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useSearch } from '../../hooks/useApi';

const typeIcons: Record<string, any> = {
  project: FolderKanban,
  task: CheckSquare,
  member: Users,
  memory: Brain,
};

const typeColors: Record<string, string> = {
  project: 'text-brand-400',
  task: 'text-emerald-400',
  member: 'text-cyan-400',
  memory: 'text-purple-400',
};

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPalette, toggleAICopilot } = useUIStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: searchResults, isLoading } = useSearch(query);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPalette]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const quickActions = [
    { label: 'Create Project', icon: Plus, action: () => { navigate('/projects'); setCommandPalette(false); } },
    { label: 'View Tasks & Kanban', icon: CheckSquare, action: () => { navigate('/tasks'); setCommandPalette(false); } },
    { label: 'Open AI Copilot', icon: Bot, action: () => { toggleAICopilot(); setCommandPalette(false); } },
    { label: 'Open Chat', icon: MessageSquare, action: () => { navigate('/chat'); setCommandPalette(false); } },
    { label: 'Upload Documents', icon: FileUp, action: () => { navigate('/documents'); setCommandPalette(false); } },
    { label: 'View Analytics', icon: BarChart3, action: () => { navigate('/analytics'); setCommandPalette(false); } },
    { label: 'Team Overview', icon: Users, action: () => { navigate('/team'); setCommandPalette(false); } },
  ];

  const filteredActions = query.length < 2
    ? quickActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleResultClick = (result: any) => {
    setCommandPalette(false);
    if (result.type === 'project') navigate('/projects');
    else if (result.type === 'task') navigate('/tasks');
    else if (result.type === 'member') navigate('/team');
  };

  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    const totalItems = (searchResults?.length || 0) + filteredActions.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, totalItems - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Escape') {
      setCommandPalette(false);
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPalette(false)}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-800/80 gap-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyNavigation}
                placeholder="Search projects, tasks, members, or run a command..."
                className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
              {isLoading && <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono text-[10px] flex-shrink-0">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <div className="p-2">
                  <span className="px-3 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Results</span>
                  <div className="mt-1 space-y-0.5">
                    {searchResults.map((result: any, idx: number) => {
                      const Icon = typeIcons[result.type] || Search;
                      const color = typeColors[result.type] || 'text-slate-400';
                      return (
                        <button
                          key={`${result.type}-${result.id}-${idx}`}
                          onClick={() => handleResultClick(result)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                            selectedIndex === idx ? 'bg-brand-600/15 text-brand-300' : 'text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="truncate font-medium">{result.title}</p>
                            {result.subtitle && <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>}
                          </div>
                          <span className="text-[10px] text-slate-500 uppercase font-medium flex-shrink-0">{result.type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              {filteredActions.length > 0 && (
                <div className="p-2">
                  <span className="px-3 text-[10px] font-semibold uppercase text-slate-500 tracking-wider">Quick Actions</span>
                  <div className="mt-1 space-y-0.5">
                    {filteredActions.map((item, idx) => {
                      const Icon = item.icon;
                      const absIdx = (searchResults?.length || 0) + idx;
                      return (
                        <button
                          key={idx}
                          onClick={item.action}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                            selectedIndex === absIdx ? 'bg-brand-600/15 text-brand-300' : 'text-slate-200 hover:bg-slate-800/60'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                          <span className="flex-1">{item.label}</span>
                          <ArrowRight className="w-3 h-3 text-slate-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {query.length >= 2 && !isLoading && (!searchResults || searchResults.length === 0) && (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No results for "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
