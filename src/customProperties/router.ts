import { Router, Request, Response } from 'express';
import getAllProperties from './getAllProperties';
import createNewProperty from './createNew';
import IHubspotProperty from './IHubspotProperty';

const router = Router();

router.get('/customRoot', (req: Request, res: Response) => {
  const variable = 'this is a local variable';

  res.json({ message: 'The custom properties router is working' });
});

/*
  Responds with all default and custom properties
*/
router.get('/properties', async (req: Request, res: Response) => {
  const allProperties = await getAllProperties();
  res.json(allProperties);
});

/*
  Creates a new custom property
*/
router.post('/properties', async (req: Request, res: Response) => {
  try {
    const newProperty = await createNewProperty(<IHubspotProperty>req.body);
    res.json(newProperty);
  } catch (error) {
    res.json({ error: error.name, message: error.message });
  }
});

export default router;
