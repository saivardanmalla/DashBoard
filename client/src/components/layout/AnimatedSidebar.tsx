import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  MessageSquare, Files, BarChart3, Settings, LogOut,
  Sparkles, Calendar,
  Bot, Activity, AlertTriangle, Lightbulb, Target, Network, Share2, Workflow, History
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const navSections = [
  {
    title: 'WORKSPACE',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'My Day', path: '/my-day', icon: Calendar },
      { name: 'Projects', path: '/projects', icon: FolderKanban },
      { name: 'Tasks', path: '/tasks', icon: CheckSquare },
      { name: 'Team Capacity', path: '/team', icon: Users },
    ],
  },
  {
    title: 'PROJECT INTELLIGENCE',
    items: [
      { name: 'AI Manager', path: '/intelligence', icon: Bot },
      { name: 'Project Health', path: '/intelligence/health', icon: Activity },
      { name: 'Risk Center', path: '/intelligence/risks', icon: AlertTriangle },
      { name: 'Predictions', path: '/intelligence/predictions', icon: Lightbulb },
      { name: 'Sprint Planner', path: '/intelligence/sprint', icon: Target },
      { name: 'Dependency Graph', path: '/intelligence/dependencies', icon: Network },
      { name: 'Knowledge Graph', path: '/intelligence/knowledge', icon: Share2 },
      { name: 'Automation', path: '/intelligence/automation', icon: Workflow },
      { name: 'Time Machine', path: '/intelligence/history', icon: History },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { name: 'Chat Copilot', path: '/chat', icon: MessageSquare },
      { name: 'Knowledge Hub', path: '/documents', icon: Files },
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    ],
  },
];

export const AnimatedSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { setCommandCenter } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-64 bg-glass-light backdrop-blur-glass-lg border-r border-glass-border flex flex-col h-screen relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-accent-900/20 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-glass-border relative z-10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-600 to-accent-400 flex items-center justify-center font-bold text-white shadow-glass-glow">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white leading-tight">SYNORA</span>
          <span className="text-[10px] font-medium text-accent-400 uppercase tracking-widest leading-tight">AI Workspace</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6 relative z-10">
        <div className="mb-4">
          <button
            onClick={() => setCommandCenter(true)}
            className="w-full relative flex items-center justify-between gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 bg-brand-500/10 text-brand-300 hover:bg-brand-500/20 border border-brand-500/30"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Command Center</span>
            </div>
            <kbd className="hidden group-hover:block px-1.5 py-0.5 rounded bg-brand-500/20 text-[10px] font-mono">⌘ K</kbd>
          </button>
        </div>

        {navSections.map((section) => (
          <div key={section.title}>
            <span className="px-3 text-[10px] font-semibold uppercase text-gray-500 tracking-widest">
              {section.title}
            </span>
            <div className="mt-3 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-glass-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-4 h-4 z-10 transition-colors duration-300 ${isActive ? 'text-accent-400' : ''}`} />
                        <span className="z-10">{item.name}</span>
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute inset-0 bg-glass-amber border border-glass-border-light rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile + Logout */}
      <div className="p-4 border-t border-glass-border bg-base-100/50 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-glass-medium flex items-center justify-center font-medium text-accent-400 border border-glass-border shadow-inner-glow">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-gray-400 truncate">{user?.role?.replace('_', ' ') || 'System Admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-gray-400 hover:text-accent-400 hover:bg-glass-medium transition-all duration-300"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
