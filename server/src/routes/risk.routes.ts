import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { calculateProjectRisk, calculateProjectHealth } from '../services/risk.service';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateJWT);

router.get('/projects/:projectId/risk', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await calculateProjectRisk(req.params.projectId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/projects/:projectId/health', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await calculateProjectHealth(req.params.projectId);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
