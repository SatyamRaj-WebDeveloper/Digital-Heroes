
import express from 'express';
import { addScore, getUserScores, modifyScore } from '../controllers/scoreController.js';
import { protect, requireActiveSubscription } from '../middleware/authMiddleware.js';

const router = express.Router();


router.use(protect); 


router.post('/', requireActiveSubscription, addScore); 
router.get('/', getUserScores);
router.put('/:id', modifyScore);

export default router;