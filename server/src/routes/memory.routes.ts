import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  searchMemories,
} from '../controllers/memory.controller';

const router = Router();
router.use(authenticateJWT);

router.get('/projects/:projectId/memory', getMemories);
router.post('/projects/:projectId/memory', createMemory);
router.get('/projects/:projectId/memory/search', searchMemories);
router.put('/memory/:id', updateMemory);
router.delete('/memory/:id', deleteMemory);

export default router;
