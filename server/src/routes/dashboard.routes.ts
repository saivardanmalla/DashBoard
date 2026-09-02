import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  getDashboardStats,
  getMyWork,
  getRecentActivity,
  getProjectsOverview,
  getTeamOverview,
} from '../controllers/dashboard.controller';

const router = Router();
router.use(authenticateJWT);

router.get('/stats', getDashboardStats);
router.get('/my-work', getMyWork);
router.get('/activity', getRecentActivity);
router.get('/projects', getProjectsOverview);
router.get('/team', getTeamOverview);

export default router;
