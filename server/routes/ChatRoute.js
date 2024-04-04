import express from 'express'
import { createChat, findChat, findChatsByUserFullNameBody, userChats } from '../controllers/ChatController.js';
const router = express.Router()

router.post('/', createChat);
router.get('/:userId', userChats);
router.get('/find/:firstId/:secondId', findChat);
router.post('/findChat', findChatsByUserFullNameBody);

export default router