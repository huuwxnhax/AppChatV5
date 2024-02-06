import express from 'express';
import { createChatGroup, userChatGroups } from '../controllers/GroupController.js';

const router = express.Router();

router.post('/', createChatGroup);
router.get('/:userId', userChatGroups);

export default router;