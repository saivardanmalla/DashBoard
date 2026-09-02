import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { MyDay } from './pages/MyDay';
import { Tasks } from './pages/Tasks';
import { Projects } from './pages/Projects';
import { Team } from './pages/Team';
import { Chat } from './pages/Chat';
import { Documents } from './pages/Documents';
import { Analytics } from './pages/Analytics';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { PlaceholderIntelligence } from './pages/intelligence/PlaceholderIntelligence';
import { ProjectHealth } from './pages/intelligence/ProjectHealth';
import { useAuthStore } from './store/authStore';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="my-day" element={<MyDay />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="team" element={<Team />} />
        <Route path="chat" element={<Chat />} />
        <Route path="documents" element={<Documents />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="admin" element={<AdminDashboard />} />
        
        {/* Project Intelligence Routes */}
        <Route path="intelligence" element={<PlaceholderIntelligence title="AI Manager" />} />
        <Route path="intelligence/health" element={<ProjectHealth />} />
        <Route path="intelligence/risks" element={<PlaceholderIntelligence title="Risk Center" />} />
        <Route path="intelligence/predictions" element={<PlaceholderIntelligence title="Predictions" />} />
        <Route path="intelligence/sprint" element={<PlaceholderIntelligence title="Sprint Planner" />} />
        <Route path="intelligence/dependencies" element={<PlaceholderIntelligence title="Dependency Graph" />} />
        <Route path="intelligence/knowledge" element={<PlaceholderIntelligence title="Knowledge Graph" />} />
        <Route path="intelligence/automation" element={<PlaceholderIntelligence title="Workflow Automation" />} />
        <Route path="intelligence/history" element={<PlaceholderIntelligence title="Time Machine" />} />
      </Route>
    </Routes>
  );
}
