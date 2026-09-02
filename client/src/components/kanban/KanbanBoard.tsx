import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { TaskGenerationModal } from '../ai/TaskGenerationModal';
import { useTasks, useUpdateTaskStatus } from '../../hooks/useApi';

export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'BACKLOG', title: 'Backlog', color: 'bg-slate-500' },
  { id: 'TODO', title: 'To Do', color: 'bg-blue-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-amber-500' },
  { id: 'REVIEW', title: 'In Review', color: 'bg-purple-500' },
  { id: 'DONE', title: 'Completed', color: 'bg-emerald-500' },
];

const priorityStyles: Record<string, string> = {
  CRITICAL: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  HIGH: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  MEDIUM: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  LOW: 'bg-slate-700 text-slate-300 border border-slate-600',
};

export const KanbanBoard: React.FC = () => {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const { data: tasks, isLoading, error } = useTasks();
  const updateStatus = useUpdateTaskStatus();

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    updateStatus.mutate({ id: taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="p-6 h-full flex flex-col bg-navy-950 text-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="animate-pulse bg-slate-800/60 rounded-lg h-8 w-64" />
            <div className="animate-pulse bg-slate-800/60 rounded-lg h-4 w-96 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-slate-900/60 rounded-xl h-96" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col bg-navy-950 text-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks & Sprint Board</h1>
          <p className="text-sm text-slate-400 mt-1">
            {tasks?.length || 0} task{(tasks?.length || 0) !== 1 ? 's' : ''} · Drag between columns to update status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-brand-600/20 border border-brand-500/30 hover:bg-brand-600/30 text-brand-300 rounded-xl text-sm font-medium transition-colors"
          >
            ✨ AI Task Generator
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      <LayoutGroup>
        <div className="grid grid-cols-5 gap-4 flex-1 items-start overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colTasks = (tasks || []).filter((t: any) => t.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-3 flex flex-col max-h-[calc(100vh-180px)]"
              >
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.color}`} />
                    <span className="font-semibold text-sm text-slate-200">{col.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  <AnimatePresence mode="popLayout">
                    {colTasks.map((task: any) => (
                      <motion.div
                        key={task._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                        whileHover={{ y: -2, transition: { duration: 0.1 } }}
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-3.5 shadow-sm hover:border-slate-600/60 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-medium text-slate-400">
                            #{task.taskNumber}
                          </span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${priorityStyles[task.priority] || priorityStyles.MEDIUM}`}>
                            {task.priority}
                          </span>
                        </div>

                        <h4 className="font-medium text-sm text-slate-100 leading-snug">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{task.description}</p>
                        )}

                        {/* Subtasks + Tags */}
                        <div className="mt-3 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs text-slate-400">
                          {task.subtasks?.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>
                                {task.subtasks.filter((s: any) => s.isCompleted).length}/{task.subtasks.length}
                              </span>
                            </div>
                          )}
                          <div className="flex gap-1 flex-wrap">
                            {task.tags?.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Move buttons */}
                        <div className="mt-2 pt-2 flex justify-between gap-1 text-[10px]">
                          {col.id !== 'TODO' && (
                            <button
                              onClick={() => moveTask(task._id, 'TODO')}
                              className="text-slate-400 hover:text-blue-400 transition-colors"
                            >
                              ← To Do
                            </button>
                          )}
                          {col.id !== 'IN_PROGRESS' && (
                            <button
                              onClick={() => moveTask(task._id, 'IN_PROGRESS')}
                              className="text-slate-400 hover:text-amber-400 transition-colors"
                            >
                              ⚡ In Progress
                            </button>
                          )}
                          {col.id !== 'DONE' && (
                            <button
                              onClick={() => moveTask(task._id, 'DONE')}
                              className="text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              Done →
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-slate-600">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </LayoutGroup>

      <TaskGenerationModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        projectId="default"
      />
    </div>
  );
};
