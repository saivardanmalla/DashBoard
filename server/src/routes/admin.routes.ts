import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/rbac.middleware';
import { getDashboardAnalytics } from '../controllers/admin.controller';
const router = Router();
router.use(authenticateJWT, authorizeRoles('SUPER_ADMIN', 'ADMIN'));
router.get('/analytics', getDashboardAnalytics);
export default router;
