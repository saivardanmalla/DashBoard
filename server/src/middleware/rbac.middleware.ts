import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden: Insufficient role permissions' });
      return;
    }
    next();
  };
};
