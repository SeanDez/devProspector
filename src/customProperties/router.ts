import { Router, Request, Response } from 'express';
import getAllProperties from './getAllProperties';

const router = Router();

router.get('/properties/', async (req: Request, res: Response) => {
  const allProperties = await getAllProperties;

  res.json(allProperties);
});

// router.post('/properties', (req: Request, res: Response) => {});

export default router;
