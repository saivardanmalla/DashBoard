import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
const router = Router();
router.use(authenticateJWT);
router.get('/channels/:channelId/messages', (req, res) => res.json({ success: true, data: [] }));
export default router;
