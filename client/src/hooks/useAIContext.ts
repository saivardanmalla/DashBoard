import { useLocation } from 'react-router-dom';

export interface AIContext {
  type: 'project' | 'task' | 'team' | 'global' | 'document';
  id?: string;
  name?: string;
}

export function useAIContext(): AIContext {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/projects')) {
    // Currently relying on path to infer, you could pull ID if path is /projects/:id
    return { type: 'project', name: 'Projects' };
  }
  
  if (path.startsWith('/tasks')) {
    return { type: 'task', name: 'Tasks' };
  }

  if (path.startsWith('/team')) {
    return { type: 'team', name: 'Team Capacity' };
  }

  if (path.startsWith('/documents')) {
    return { type: 'document', name: 'Knowledge Hub' };
  }

  return { type: 'global', name: 'Global Workspace' };
}
