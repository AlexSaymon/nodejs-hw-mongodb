import { Router } from 'express';
import contactsRouter from './contacts.js';

export const router = Router();

router.use('/contacts', contactsRouter);
