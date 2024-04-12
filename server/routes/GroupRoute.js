import express from 'express';
import { addMemberToGroup, createChatGroup, leaveGroup, memberGroups, removeMemberFromGroup, userChatGroups } from '../controllers/GroupController.js';

const router = express.Router();

router.post('/', createChatGroup);
router.get('/:userId', userChatGroups);
router.get('/members/:groupId', memberGroups);
router.post('/add-member', addMemberToGroup);
router.post('/remove-member', removeMemberFromGroup);
router.post('/leave-group', leaveGroup);


export default router;