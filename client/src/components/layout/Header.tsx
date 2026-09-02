import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const Header: React.FC = () => {
  const { setCommandPalette } = useUIStore();

  return (
    <header className="h-16 border-b border-glass-border bg-base-100/40 backdrop-blur-glass-lg px-8 flex items-center justify-between relative z-20">
      
      {/* Decorative top glow */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-500/20 to-transparent" />

      {/* Search Bar */}
      <button
        onClick={() => setCommandPalette(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-glass-medium border border-glass-border text-gray-400 text-sm hover:border-accent-500/30 hover:bg-glass-strong hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all duration-300 w-96 group"
      >
        <Search className="w-4 h-4 group-hover:text-accent-400 transition-colors" />
        <span className="flex-1 text-left">Search students, courses, faculty...</span>
        <div className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 rounded bg-base-300/80 text-gray-400 font-mono text-[10px] border border-glass-border shadow-inner-glow">⌘</kbd>
          <kbd className="px-2 py-0.5 rounded bg-base-300/80 text-gray-400 font-mono text-[10px] border border-glass-border shadow-inner-glow">K</kbd>
        </div>
      </button>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl text-gray-400 hover:text-accent-400 hover:bg-glass-medium border border-transparent hover:border-glass-border transition-all duration-300">
          <HelpCircle className="w-5 h-5" />
        </button>

        <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-glass-medium border border-transparent hover:border-glass-border transition-all duration-300 relative group">
          <Bell className="w-5 h-5 group-hover:text-white transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </button>
      </div>
    </header>
  );
};
