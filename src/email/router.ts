import { Router, Request, Response } from 'express';

import Emailer from './Emailer';

import envTyped from '../shared/envVariablesTyped';

const { MAILGUN_PRIVATE_API_KEY, FROM_EMAIL } = envTyped;

const router = Router();

router.get('/validate', async (req: Request, res: Response) => {
  const suspectEmail = req.query.email;
  if (typeof suspectEmail === 'undefined') { res.json({ error: 'no req.query.email' }); }

  const emailer = Emailer();
  const validated = await emailer.validate((suspectEmail as string));
  res.json(validated);
});

router.post('/send', async (req: Request, res: Response) => {
  const {
    firstName,
    companyName,
    email: toEmail,
    prospectCategory,
    completeIntroSentence: introCompliment,
  } = req.body;

  const emailer = Emailer();
  try {
    const message = await emailer
      .send(firstName, companyName, FROM_EMAIL, toEmail, prospectCategory, introCompliment);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error });
  }
});
export default router;
