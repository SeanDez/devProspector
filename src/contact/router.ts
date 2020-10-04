import { Router, Request, Response } from 'express';
import createNewContact from './createNewContact';

const router = Router();
router.post('/new', createNewContact);
export default router;
