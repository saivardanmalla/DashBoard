import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// ─── Dashboard ──────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data.data;
    },
  });
}

export function useMyWork() {
  return useQuery({
    queryKey: ['dashboard', 'my-work'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/my-work');
      return data.data;
    },
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/activity');
      return data.data;
    },
  });
}

// ─── Projects ───────────────────────────────────────────
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/projects');
      return data.data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: { title: string; key: string; description: string; priority: string }) => {
      const { data } = await api.post('/projects', project);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Tasks ──────────────────────────────────────────────
export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const params = projectId ? `?projectId=${projectId}` : '';
      const { data } = await api.get(`/tasks${params}`);
      return data.data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: any) => {
      const { data } = await api.post('/tasks', task);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, order }: { id: string; status: string; order?: number }) => {
      const { data } = await api.patch(`/tasks/${id}/status`, { status, order });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Team ───────────────────────────────────────────────
export function useTeam() {
  return useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/team');
      return data.data;
    },
  });
}

// ─── Search ─────────────────────────────────────────────
export function useSearch(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
      return data.data;
    },
    enabled: query.length >= 2,
  });
}

// ─── AI Memory ──────────────────────────────────────────
export function useProjectMemories(projectId?: string, category?: string) {
  return useQuery({
    queryKey: ['memories', projectId, category],
    queryFn: async () => {
      const params = category ? `?category=${category}` : '';
      const { data } = await api.get(`/memory/projects/${projectId}/memory${params}`);
      return data.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, ...memory }: any) => {
      const { data } = await api.post(`/memory/projects/${projectId}/memory`, memory);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

// ─── Risk ───────────────────────────────────────────────
export function useProjectRisk(projectId?: string) {
  return useQuery({
    queryKey: ['risk', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/risk/projects/${projectId}/risk`);
      return data.data;
    },
    enabled: !!projectId,
  });
}

export function useProjectHealth(projectId?: string) {
  return useQuery({
    queryKey: ['health', projectId],
    queryFn: async () => {
      const { data } = await api.get(`/risk/projects/${projectId}/health`);
      return data.data;
    },
    enabled: !!projectId,
  });
}

// ─── AI Copilot ─────────────────────────────────────────
export function useAICopilot() {
  return useMutation({
    mutationFn: async ({ projectId, query, history }: { projectId: string; query: string; history?: any[] }) => {
      const { data } = await api.post(`/ai/projects/${projectId}/chat`, { query, history });
      return data.data;
    },
  });
}

export function useAIGenerateTasks() {
  return useMutation({
    mutationFn: async ({ projectId, promptText }: { projectId: string; promptText: string }) => {
      const { data } = await api.post(`/ai/projects/${projectId}/generate-tasks`, { promptText });
      return data.data;
    },
  });
}
