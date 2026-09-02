import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ProjectMemory } from '../models/ProjectMemory';

export const getMemories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { category } = req.query;
    const filter: any = { project: projectId };
    if (category) filter.category = category;
    const memories = await ProjectMemory.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: memories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createMemory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { category, title, content, tags } = req.body;
    const memory = await ProjectMemory.create({
      project: projectId,
      category,
      title,
      content,
      tags: tags || [],
    });
    res.status(201).json({ success: true, data: memory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMemory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags } = req.body;
    const memory = await ProjectMemory.findByIdAndUpdate(
      id,
      { title, content, category, tags },
      { new: true }
    );
    if (!memory) {
      res.status(404).json({ success: false, message: 'Memory not found' });
      return;
    }
    res.json({ success: true, data: memory });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMemory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await ProjectMemory.findByIdAndDelete(id);
    res.json({ success: true, message: 'Memory deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const searchMemories = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { q } = req.query;
    if (!q) {
      res.status(400).json({ success: false, message: 'Search query required' });
      return;
    }
    const regex = new RegExp(String(q), 'i');
    const memories = await ProjectMemory.find({
      project: projectId,
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex },
      ],
    }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: memories });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
