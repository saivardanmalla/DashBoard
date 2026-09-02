import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { Project } from '../models/Project';

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  const projects = await Project.find({ 'members.user': req.user?._id });
  res.json({ success: true, data: projects });
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  const { title, key, description, priority } = req.body;
  const project = await Project.create({
    title,
    key,
    description,
    priority,
    owner: req.user?._id,
    members: [{ user: req.user?._id, role: 'MANAGER' }],
  });
  res.status(201).json({ success: true, data: project });
};
