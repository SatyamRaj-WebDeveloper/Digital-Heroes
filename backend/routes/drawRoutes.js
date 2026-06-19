import express from 'express';
import { 
  executeDrawSimulation, 
  publishDrawResults, 
  getCurrentDrawStats,
  submitWinnerProof,     // FIX: Imported
  reviewWinnerProof      // FIX: Imported
} from '../controllers/drawController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/current', protect, getCurrentDrawStats);
router.post('/simulate', protect, authorizeAdmin, executeDrawSimulation);
router.post('/publish', protect, authorizeAdmin, publishDrawResults);

// FIX: Establish live endpoint channels for tracking proofs and payout state evaluations
router.post('/submit-proof', protect, submitWinnerProof);
router.post('/review-proof', protect, authorizeAdmin, reviewWinnerProof);

export default router;