import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export const Chat: React.FC = () => {
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-950 text-slate-100">
      <div className="w-64 border-r border-slate-800 p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase text-slate-400 px-2">Project Channels</h3>
        <div className="space-y-1 text-xs">
          <div className="p-2 bg-indigo-600/20 text-indigo-300 rounded-lg font-medium"># general</div>
          <div className="p-2 text-slate-400 hover:bg-slate-900 rounded-lg"># development</div>
          <div className="p-2 text-slate-400 hover:bg-slate-900 rounded-lg"># ai-agents</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2 text-sm font-semibold">
          <MessageSquare className="w-4 h-4 text-indigo-400" /> # general
        </div>
        <div className="flex-1 p-6 space-y-4 overflow-y-auto text-xs">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl max-w-md">
            <span className="font-semibold text-indigo-400">Sai Vardhan</span>
            <p className="mt-1 text-slate-200">Socket.IO real-time channel connected and listening for events.</p>
          </div>
        </div>
        <div className="p-4 border-t border-slate-800 flex gap-2">
          <input
            placeholder="Type message in #general..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
