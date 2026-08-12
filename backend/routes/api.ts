import { Router } from 'express';
import { handleChat, handleIngest } from '../controllers/chatController';

export const router = Router();

router.post('/chat', handleChat);
router.post('/ingest-docs', handleIngest);
