import { Router, Request, Response } from 'express';
import authorize from './oauth';

const router = Router();
router.post('/send', (req: Request, res: Response) => {
  res.json({ message: 'check terminal to see if logs were created on gmail labels' });
});
export default router;
