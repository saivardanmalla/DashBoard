import React from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle2, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { useTeam } from '../hooks/useApi';

const workloadColor = (pct: number) => {
  if (pct >= 80) return 'bg-red-500';
  if (pct >= 60) return 'bg-amber-500';
  return 'bg-emerald-500';
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-brand-500/20 text-brand-400 border-brand-500/30',
  ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  PROJECT_MANAGER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  TEAM_MEMBER: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  VIEWER: 'bg-slate-600/20 text-slate-500 border-slate-600/30',
};

export const Team: React.FC = () => {
  const { data: team, isLoading } = useTeam();

  const totalMembers = team?.length || 0;
  const totalAssigned = team?.reduce((s: number, m: any) => s + m.assignedTasks, 0) || 0;
  const totalCompleted = team?.reduce((s: number, m: any) => s + m.completedTasks, 0) || 0;
  const avgWorkload = totalMembers > 0
    ? Math.round(team.reduce((s: number, m: any) => s + m.workload, 0) / totalMembers)
    : 0;

  const topStats = [
    { title: 'Members', value: totalMembers, icon: Users, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { title: 'Active Tasks', value: totalAssigned, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Completed', value: totalCompleted, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Avg Workload', value: `${avgWorkload}%`, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Team Members & Capacity</h1>
        <p className="text-sm text-slate-400 mt-1">Monitor workloads, roles, and task distribution.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">{s.title}</span>
                <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Team Table */}
      <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-slate-800/40 rounded-lg h-14" />
            ))}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-xs text-slate-400 border-b border-slate-800/60">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Active</th>
                <th className="p-4 text-center">Completed</th>
                <th className="p-4 text-center">Overdue</th>
                <th className="p-4">Workload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {team?.map((member: any, idx: number) => (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="hover:bg-slate-800/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-medium text-brand-400 border border-slate-700/50 text-sm">
                        {member.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${roleColors[member.role] || roleColors.TEAM_MEMBER}`}>
                      {member.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm font-medium text-slate-200">{member.assignedTasks}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm font-medium text-emerald-400">{member.completedTasks}</span>
                  </td>
                  <td className="p-4 text-center">
                    {member.overdueTasks > 0 ? (
                      <span className="text-sm font-medium text-red-400 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {member.overdueTasks}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500">0</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${workloadColor(member.workload)}`}
                          style={{ width: `${member.workload}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium min-w-[36px] text-right ${
                        member.workload >= 80 ? 'text-red-400' : member.workload >= 60 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {member.workload}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
