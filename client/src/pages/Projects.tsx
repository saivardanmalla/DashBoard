import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Plus, Users, Search, Filter, X, Loader2 } from 'lucide-react';
import { useProjects, useCreateProject } from '../hooks/useApi';

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  PLANNING: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  ON_HOLD: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  ARCHIVED: 'bg-slate-600/15 text-slate-500 border-slate-600/20',
};

const healthColors: Record<string, { bg: string; text: string; label: string }> = {
  HEALTHY: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: '● Healthy' },
  WARNING: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: '● Warning' },
  AT_RISK: { bg: 'bg-red-500/10', text: 'text-red-400', label: '● At Risk' },
};

export const Projects: React.FC = () => {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', key: '', description: '', priority: 'MEDIUM' });

  const filtered = (projects || []).filter((p: any) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.key.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = async () => {
    if (!newProject.title || !newProject.key) return;
    await createProject.mutateAsync(newProject);
    setShowCreateModal(false);
    setNewProject({ title: '', key: '', description: '', priority: 'MEDIUM' });
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            {projects?.length || 0} project{(projects?.length || 0) !== 1 ? 's' : ''} across your workspace
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-brand-600/15"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-slate-900/70 border border-slate-800/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500/50 transition-all"
          />
        </div>
        <div className="flex gap-1.5 bg-slate-900/70 border border-slate-800/60 rounded-xl p-1">
          {['ALL', 'ACTIVE', 'PLANNING', 'COMPLETED'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-900/60 rounded-xl h-52" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p: any, idx: number) => {
            const health = healthColors[p.health] || healthColors.HEALTHY;
            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-slate-900/70 border border-slate-800/60 p-5 rounded-xl hover:border-slate-700/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    {p.key}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${statusColors[p.status] || statusColors.ACTIVE}`}>
                    {p.status}
                  </span>
                </div>

                <h3 className="font-semibold text-white text-base group-hover:text-brand-300 transition-colors">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{p.description}</p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span className="font-medium text-slate-300">{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>

                {/* Health + Meta */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.members?.length || 0}</span>
                    <span>{p.taskCount} tasks</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${health.bg} ${health.text}`}>
                    {health.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-300">No projects found</h3>
          <p className="text-sm text-slate-500 mt-1">
            {search ? 'Try adjusting your search.' : 'Create your first project to get started.'}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4 inline mr-1" /> Create Project
            </button>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Create Project</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Project Name</label>
                  <input
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. SYNORA Platform"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Project Key</label>
                  <input
                    value={newProject.key}
                    onChange={(e) => setNewProject({ ...newProject, key: e.target.value.toUpperCase() })}
                    placeholder="e.g. SYN"
                    maxLength={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300 mb-1 block">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={!newProject.title || !newProject.key || createProject.isPending}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createProject.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Project</>}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
