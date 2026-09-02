import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { User } from '../models/User';

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  const [totalUsers, totalProjects, totalTasks, taskStatusDist] = await Promise.all([
    User.countDocuments(),
    Project.countDocuments(),
    Task.countDocuments(),
    Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);
  res.json({
    success: true,
    data: {
      totalUsers,
      totalProjects,
      totalTasks,
      taskStatusDist,
    }
  });
};
