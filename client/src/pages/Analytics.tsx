import React from 'react';
import { BarChart3 } from 'lucide-react';

export const Analytics: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Project Analytics & Performance</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Task Completion by Priority</h3>
          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Critical</span> <span>100%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>High</span> <span>75%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
