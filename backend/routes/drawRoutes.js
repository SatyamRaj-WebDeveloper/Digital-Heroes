import express from 'express';
import { executeDrawSimulation, publishDrawResults, getCurrentDrawStats } from '../controllers/drawController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', protect, getCurrentDrawStats);
router.post('/simulate', protect, authorizeAdmin, executeDrawSimulation);
router.post('/publish', protect, authorizeAdmin, publishDrawResults);

export default router;