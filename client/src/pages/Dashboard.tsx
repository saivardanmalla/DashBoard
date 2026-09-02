import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { MorningGreeting } from '../components/dashboard/MorningGreeting';
import { PriorityQueue } from '../components/dashboard/PriorityQueue';
import { FolderKanban, CheckSquare, Users, Activity, TrendingUp } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen relative z-10">
      
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-emerald-500/5 blur-[150px] mix-blend-screen" />
      </div>

      <MorningGreeting />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          { title: 'Active Projects', value: '12', trend: '+2 this week', icon: FolderKanban, color: 'text-brand-400', glow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' },
          { title: 'Tasks Completed', value: '145', trend: '+12% from last week', icon: CheckSquare, color: 'text-emerald-400', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]' },
          { title: 'Team Capacity', value: '82%', trend: 'Optimal', icon: Users, color: 'text-cyan-400', glow: 'shadow-[0_0_30px_rgba(34,211,238,0.15)]' },
          { title: 'System Health', value: '99.9%', trend: 'Stable', icon: Activity, color: 'text-purple-400', glow: 'shadow-[0_0_30px_rgba(192,132,252,0.15)]' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-slate-900 border border-slate-800 p-6 rounded-xl group cursor-pointer hover:border-brand-500/30 transition-all duration-500 hover:-translate-y-1 ${kpi.glow}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
              
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700 ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-bold text-white tracking-tight">{kpi.value}</p>
                <p className="text-sm text-slate-500 mt-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  {kpi.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Main workspace activity, to be expanded */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full min-h-[400px] flex items-center justify-center">
            <p className="text-slate-500">Workspace Activity View (Phase 2)</p>
          </div>
        </div>
        <div>
          <PriorityQueue />
        </div>
      </div>
    </div>
  );
};
