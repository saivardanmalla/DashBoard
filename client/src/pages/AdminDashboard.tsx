import React from 'react';
import { ShieldCheck, Activity, Database, Server } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-7 h-7 text-rose-400" />
        <div>
          <h1 className="text-2xl font-bold text-slate-100">System Administration Console</h1>
          <p className="text-xs text-slate-400 mt-1">Multi-tenant management, user roles, and database cluster health.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Database Node</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-slate-100">MongoDB ReplicaSet</p>
          <span className="text-[10px] text-emerald-400">● 100% Healthy</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>WebSocket Cluster</span>
            <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-lg font-bold text-slate-100">Socket.IO Gateway</p>
          <span className="text-[10px] text-indigo-400">● 4 active rooms</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>AI Token Consumption</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg font-bold text-slate-100">142.5k Tokens</p>
          <span className="text-[10px] text-purple-400">Monthly quota: 85% remaining</span>
        </div>
      </div>
    </div>
  );
};
