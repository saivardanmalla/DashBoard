import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Clock, ShieldAlert, AlertCircle } from 'lucide-react';

export const PriorityQueue: React.FC = () => {
  const priorities = [
    {
      id: 1,
      title: 'Fix authentication blocker',
      urgency: 'CRITICAL',
      reason: 'Blocking 4 team members',
      icon: ShieldAlert,
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20'
    },
    {
      id: 2,
      title: 'Review payment API',
      urgency: 'HIGH',
      reason: 'Dependency for release tomorrow',
      icon: AlertCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20'
    },
    {
      id: 3,
      title: 'Update documentation',
      urgency: 'MEDIUM',
      reason: 'Standard maintenance',
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10 border-blue-400/20'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-400" />
          AI Priority Queue
        </h3>
        <button className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          View All <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 space-y-3">
        {priorities.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-lg border ${item.bg} flex flex-col gap-3 group`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.reason}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${item.bg} ${item.color}`}>
                {item.urgency}
              </span>
            </div>
            
            <div className="flex items-center justify-end gap-2 mt-2 border-t border-slate-700/50 pt-3">
              <button className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1">Dismiss</button>
              <button className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1">Reorder</button>
              <button className="text-xs bg-brand-500/20 text-brand-300 hover:bg-brand-500 hover:text-white transition-colors px-3 py-1 rounded">Accept</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
