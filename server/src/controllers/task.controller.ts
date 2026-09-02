import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Task } from '../models/Task';

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.query;
  const tasks = await Task.find(projectId ? { project: projectId } : {}).sort({ order: 1 });
  res.json({ success: true, data: tasks });
};

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
  const count = await Task.countDocuments({ project: req.body.project });
  const task = await Task.create({
    ...req.body,
    taskNumber: count + 1,
    creator: req.user?._id,
  });
  res.status(201).json({ success: true, data: task });
};

export const updateTaskStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status, order } = req.body;
  const task = await Task.findByIdAndUpdate(id, { status, order }, { new: true });
  res.json({ success: true, data: task });
};
