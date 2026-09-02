import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { getProjects, createProject } from '../controllers/project.controller';
const router = Router();
router.use(authenticateJWT);
router.get('/', getProjects);
router.post('/', createProject);
export default router;
