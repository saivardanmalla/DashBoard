import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckSquare, Users, Calendar, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const MorningGreeting: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-emerald-400 to-cyan-400" />
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-2">GOOD MORNING</h2>
          <p className="text-slate-400 mb-6">Your workspace requires attention in 4 areas.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
              <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">PROJECT RISKS</h4>
                <p className="text-xs text-slate-400 mt-1">2 projects require attention</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">TASKS</h4>
                <p className="text-xs text-slate-400 mt-1">6 tasks due today</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">TEAM</h4>
                <p className="text-xs text-slate-400 mt-1">1 member overloaded</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-start gap-4">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">MEETINGS</h4>
                <p className="text-xs text-slate-400 mt-1">2 meetings today</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-72 bg-brand-900/20 border border-brand-500/20 rounded-xl p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
            <Sparkles className="w-24 h-24 text-brand-400" />
          </div>
          <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-2 flex items-center gap-2 relative z-10">
            <Sparkles className="w-4 h-4" /> AI PRIORITY
          </h3>
          <p className="text-sm text-slate-300 relative z-10 mb-6 leading-relaxed">
            Complete API integration first. It is blocking 3 other dependent tasks in the Nexus project.
          </p>
          <button 
            onClick={() => useUIStore.getState().toggleAICopilot()}
            className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors relative z-10 shadow-lg shadow-brand-500/20">
            [START MY DAY]
          </button>
        </div>
      </div>
    </motion.div>
  );
};
