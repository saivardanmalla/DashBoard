import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { OpenAIProvider } from '../services/ai.service';
import { ProjectMemory } from '../models/ProjectMemory';

const ai = new OpenAIProvider();

export const askProjectCopilot = async (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;
  const { query, history } = req.body;
  const memories = await ProjectMemory.find({ project: projectId }).limit(5);
  const memContext = memories.map((m) => `[${m.category}] ${m.title}: ${m.content}`).join('\n');

  const answer = await ai.generateCompletion([
    { role: 'system', content: `You are NexusCopilot. Memory Context:
${memContext}` },
    ...(history || []),
    { role: 'user', content: query }
  ]);
  res.json({ success: true, data: { answer } });
};

export const generateTasks = async (req: AuthenticatedRequest, res: Response) => {
  const { promptText } = req.body;
  const response = await ai.generateCompletion([
    {
      role: 'system',
      content: 'Output JSON ONLY: {"milestone": string, "tasks": [{"title": string, "description": string, "priority": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "subtasks": [string]}]}'
    },
    { role: 'user', content: `Break down into tasks: ${promptText}` }
  ]);
  try {
    const match = response.match(/\{[\s\S]*\}/);
    const plan = match ? JSON.parse(match[0]) : JSON.parse(response);
    res.json({ success: true, data: plan });
  } catch {
    res.json({
      success: true,
      data: {
        milestone: 'Sprint 1 - Core Setup',
        tasks: [
          { title: 'Project Initialization', description: promptText, priority: 'HIGH', subtasks: ['Setup DB', 'Configure API'] }
        ]
      }
    });
  }
};

export const parseCommand = async (req: AuthenticatedRequest, res: Response) => {
  const { command } = req.body;
  const response = await ai.generateCompletion([
    {
      role: 'system',
      content: 'Output JSON ONLY. You are an AI command parser for a project management tool. Parse the user\'s command into an action preview. Format: {"action": "CREATE_TASK" | "CREATE_PROJECT" | "UPDATE_TASK" | "SUMMARIZE", "preview": {"title"?: string, "description"?: string, "assignee"?: string, "project"?: string, "summary"?: string}, "confidence": number}. If uncertain, set confidence low. Example: {"action": "CREATE_TASK", "preview": {"title": "Fix bug", "description": "Fix auth bug"}, "confidence": 0.9}'
    },
    { role: 'user', content: command }
  ]);
  try {
    const match = response.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : JSON.parse(response);
    res.json({ success: true, data: parsed });
  } catch {
    res.json({
      success: false,
      error: 'Failed to parse command'
    });
  }
};
