import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { universalSearch } from '../controllers/search.controller';

const router = Router();
router.use(authenticateJWT);
router.get('/', universalSearch);

export default router;
