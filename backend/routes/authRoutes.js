import express from 'express';
import { registerUser, loginUser, updateSubscription ,getMe} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/subscription', protect, updateSubscription);
router.get('/me', protect, getMe);

export default router;