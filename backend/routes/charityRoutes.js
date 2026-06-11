import express from 'express';
import Charity from '../models/Charity.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const list = await Charity.find(filter);
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.post('/', protect, authorizeAdmin, async (req, res) => {
  const { name, description, imageUrl, upcomingEvents, isFeatured } = req.body;
  try {
    const charity = await Charity.create({ name, description, imageUrl, upcomingEvents, isFeatured });
    res.status(201).json({ success: true, data: charity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;