import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getTasks, createTask, updateTaskStatus } from '../controllers/task.controller';
const router = Router();
router.use(authenticateJWT);
router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id/status', updateTaskStatus);
export default router;
