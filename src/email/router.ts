import { Router, Request, Response } from 'express';

import MailGun from './MailGun';
import Gmail from './Gmail';

import envTyped from '../shared/envVariablesTyped';
import AwsSes from './AwsSes';

const { FROM_EMAIL, MAILGUN_SENDER } = envTyped;

const router = Router();
const mailgun = new MailGun();
const gmail = new Gmail();
const awsSes = new AwsSes();

router.get('/validate', async (req: Request, res: Response) => {
  const suspectEmail = req.query.email;
  if (typeof suspectEmail === 'undefined') { res.json({ error: 'no req.query.email' }); }
  const validated = await mailgun.validate((suspectEmail as string));
  res.json(validated);
});

router.post('/send/mailgun', async (req: Request, res: Response) => {
  const {
    firstName,
    companyName,
    email: toEmail,
    employeeRoleCode,
    completeIntroSentence: introCompliment,
  } = req.body;

  const prospectCategory = mailgun.convertToProspectCategory(employeeRoleCode);
  try {
    const message = mailgun
      .formattedMessage(firstName, companyName, MAILGUN_SENDER,
        toEmail, prospectCategory, introCompliment);
    await mailgun.sendMessage(message)
    res.status(200).json({ message: "Message Sent successfully" });
  } catch (mailgunError) {
    res.status(500).json({ message: mailgunError.error });
  }

});

router.post('/send/gmail', (req: Request, res: Response) => {
  const {
    firstName,
    companyName,
    email: toEmail,
    employeeRoleCode,
    completeIntroSentence: introCompliment,
  } = req.body;

  const prospectCategory = gmail.convertToProspectCategory(employeeRoleCode);
  
  try {
    const message = gmail.makeBody(gmail
      .formattedMessage(firstName, companyName, FROM_EMAIL,
        toEmail, prospectCategory, introCompliment));
    gmail.sendMessage(message)
    res.status(200).json({ message: "Message Sent successfully" });
  } catch (gmailError) {
    res.status(500).json({ message: gmailError.message });
  }

});

router.post('/send', (req: Request, res: Response) => {
  const {
    firstName,
    companyName,
    email: toEmail,
    employeeRoleCode,
    completeIntroSentence: introCompliment,
  } = req.body;

  const prospectCategory = awsSes.convertToProspectCategory(employeeRoleCode);
  
  try {
    const message = awsSes
      .formattedMessage(firstName, companyName, FROM_EMAIL,
        toEmail, prospectCategory, introCompliment);
    awsSes.sendMessage(message)
    res.status(200).json({ message: "Message Sent successfully" });
  } catch (awsSesError) {
    res.status(500).json({ message: awsSesError.message });
  }
  
});
export default router;
