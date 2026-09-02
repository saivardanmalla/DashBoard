import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Clock, Users, AlertTriangle } from 'lucide-react';

export const ProjectHealth: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-accent-400" />
              Project Health
            </h1>
            <p className="text-gray-400 mt-2">AI-driven analysis of your project's overall health and performance.</p>
          </div>
          <div className="bg-glass-medium border border-glass-border rounded-2xl p-4 flex items-center gap-4 shadow-glass-md">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
              <span className="text-2xl font-bold text-emerald-500">82</span>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Health Score</p>
              <p className="text-xl font-bold text-white">HEALTHY</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthCard title="Task Completion" score={90} icon={CheckCircle} color="text-emerald-400" />
          <HealthCard title="Deadline Performance" score={85} icon={Clock} color="text-amber-400" />
          <HealthCard title="Team Workload" score={75} icon={Users} color="text-blue-400" />
          <HealthCard title="Risk Factors" score={95} icon={AlertTriangle} color="text-rose-400" />
        </div>

        <div className="bg-glass-medium border border-glass-border rounded-2xl p-6 shadow-glass-lg mt-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-accent-400">✨</span> AI Insights
          </h2>
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-emerald-300 font-medium">Your team is performing well. Task completion velocity is up 15% from last week.</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-blue-300 font-medium">Workload is balanced, though two team members are approaching maximum capacity.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HealthCard = ({ title, score, icon: Icon, color }: any) => (
  <div className="bg-glass-medium border border-glass-border rounded-2xl p-5 shadow-glass-md flex flex-col gap-4">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-glass-light ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-semibold text-gray-200">{title}</h3>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex-1 h-2 bg-glass-light rounded-full overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${score}%` }} />
      </div>
      <span className="font-bold text-white">{score}</span>
    </div>
  </div>
);
