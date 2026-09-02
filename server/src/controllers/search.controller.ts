import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { ProjectMemory } from '../models/ProjectMemory';
import { Activity } from '../models/Activity';

export const universalSearch = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { q, type } = req.query;
    if (!q) {
      res.status(400).json({ success: false, message: 'Search query required' });
      return;
    }

    const regex = new RegExp(String(q), 'i');
    const userId = req.user?._id;
    const results: any[] = [];

    // Search Projects (only user's projects)
    if (!type || type === 'projects') {
      const projects = await Project.find({
        'members.user': userId,
        $or: [{ title: regex }, { key: regex }, { description: regex }],
      }).select('title key status description').limit(5).lean();
      projects.forEach((p: any) => {
        results.push({ type: 'project', id: p._id, title: p.title, subtitle: p.key, status: p.status });
      });
    }

    // Search Tasks
    if (!type || type === 'tasks') {
      const tasks = await Task.find({
        $or: [{ title: regex }, { description: regex }, { tags: regex }],
      }).populate('project', 'title key').select('title taskNumber status priority project').limit(8).lean();
      tasks.forEach((t: any) => {
        results.push({
          type: 'task', id: t._id, title: t.title,
          subtitle: `#${t.taskNumber} · ${(t.project as any)?.key || ''}`,
          status: t.status, priority: t.priority,
        });
      });
    }

    // Search Users
    if (!type || type === 'members') {
      const users = await User.find({
        $or: [{ name: regex }, { email: regex }],
      }).select('name email role').limit(5).lean();
      users.forEach((u: any) => {
        results.push({ type: 'member', id: u._id, title: u.name, subtitle: u.email, role: u.role });
      });
    }

    // Search Memories
    if (!type || type === 'memories') {
      const memories = await ProjectMemory.find({
        $or: [{ title: regex }, { content: regex }, { tags: regex }],
      }).populate('project', 'title key').limit(5).lean();
      memories.forEach((m: any) => {
        results.push({
          type: 'memory', id: m._id, title: m.title,
          subtitle: m.category, content: m.content?.slice(0, 120),
        });
      });
    }

    res.json({ success: true, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
