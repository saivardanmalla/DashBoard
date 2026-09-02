import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';
import { Activity } from '../models/Activity';

export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const [
      totalProjects,
      totalTasks,
      totalMembers,
      tasksByStatus,
      tasksByPriority,
      myTasks,
    ] = await Promise.all([
      Project.countDocuments({ 'members.user': userId }),
      Task.countDocuments(),
      User.countDocuments(),
      Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
      Task.countDocuments({ assignees: userId, status: { $ne: 'DONE' } }),
    ]);

    const statusMap: Record<string, number> = {};
    tasksByStatus.forEach((s: any) => { statusMap[s._id] = s.count; });

    const priorityMap: Record<string, number> = {};
    tasksByPriority.forEach((p: any) => { priorityMap[p._id] = p.count; });

    const activeTasks = (statusMap['TODO'] || 0) + (statusMap['IN_PROGRESS'] || 0) + (statusMap['REVIEW'] || 0);
    const completedTasks = statusMap['DONE'] || 0;
    const backlogTasks = statusMap['BACKLOG'] || 0;

    // Overdue tasks (tasks not done that were created > 7 days ago as a heuristic)
    const overdueThreshold = new Date(Date.now() - 7 * 86400000);
    const overdueTasks = await Task.countDocuments({
      status: { $nin: ['DONE'] },
      createdAt: { $lt: overdueThreshold },
    });

    res.json({
      success: true,
      data: {
        totalProjects,
        totalTasks,
        activeTasks,
        completedTasks,
        backlogTasks,
        overdueTasks,
        totalMembers,
        myTasks,
        tasksByStatus: statusMap,
        tasksByPriority: priorityMap,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyWork = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const myTasks = await Task.find({ assignees: userId })
      .populate('project', 'title key')
      .sort({ priority: -1, createdAt: -1 })
      .lean();

    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const weekEnd = new Date(now.getTime() + 7 * 86400000);

    const today = myTasks.filter(
      (t: any) => t.status !== 'DONE' && t.status !== 'BACKLOG'
    ).slice(0, 5);

    const upcoming = myTasks.filter(
      (t: any) => t.status === 'BACKLOG' || t.status === 'TODO'
    ).slice(0, 5);

    const completed = myTasks.filter(
      (t: any) => t.status === 'DONE'
    ).slice(0, 5);

    const overdue = myTasks.filter((t: any) => {
      const age = now.getTime() - new Date(t.createdAt).getTime();
      return t.status !== 'DONE' && age > 7 * 86400000;
    });

    res.json({
      success: true,
      data: { today, upcoming, completed, overdue },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getRecentActivity = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const activity = await Activity.find()
      .populate('user', 'name avatarUrl')
      .populate('project', 'title key')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: activity });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProjectsOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const projects = await Project.find({ 'members.user': userId })
      .populate('members.user', 'name avatarUrl role')
      .lean();

    // Enrich with task counts
    const enriched = await Promise.all(
      projects.map(async (p: any) => {
        const [total, completed, overdue] = await Promise.all([
          Task.countDocuments({ project: p._id }),
          Task.countDocuments({ project: p._id, status: 'DONE' }),
          Task.countDocuments({
            project: p._id,
            status: { $nin: ['DONE'] },
            createdAt: { $lt: new Date(Date.now() - 7 * 86400000) },
          }),
        ]);
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const health = overdue > 2 ? 'AT_RISK' : overdue > 0 ? 'WARNING' : 'HEALTHY';
        return { ...p, taskCount: total, completedCount: completed, overdueCount: overdue, progress, health };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTeamOverview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash -refreshToken').lean();

    const enriched = await Promise.all(
      users.map(async (u: any) => {
        const [assignedTasks, completedTasks, overdueTasks] = await Promise.all([
          Task.countDocuments({ assignees: u._id, status: { $ne: 'DONE' } }),
          Task.countDocuments({ assignees: u._id, status: 'DONE' }),
          Task.countDocuments({
            assignees: u._id,
            status: { $nin: ['DONE'] },
            createdAt: { $lt: new Date(Date.now() - 7 * 86400000) },
          }),
        ]);
        const totalTasks = assignedTasks + completedTasks;
        const workload = Math.min(100, Math.round((assignedTasks / 8) * 100)); // 8 tasks = 100% capacity
        return { ...u, assignedTasks, completedTasks, overdueTasks, totalTasks, workload };
      })
    );

    res.json({ success: true, data: enriched });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
