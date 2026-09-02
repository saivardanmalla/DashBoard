import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { askProjectCopilot, generateTasks, parseCommand } from '../controllers/ai.controller';
const router = Router();
router.use(authenticateJWT);
router.post('/projects/:projectId/chat', askProjectCopilot);
router.post('/projects/:projectId/generate-tasks', generateTasks);
router.post('/command', parseCommand);
export default router;
