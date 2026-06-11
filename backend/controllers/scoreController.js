
import GolfScore from '../models/GolfScore.js';
import User from '../models/User.js';




export const addScore = async (req, res) => {
  const { score, scoreDate, session_id } = req.body;

  try {
    
    if (session_id) {
      await User.findByIdAndUpdate(req.user.id, {
        $set: { 'subscription.status': 'active' }
      });
    }

    
    const activeUserCheck = await User.findById(req.user.id);
    if (!activeUserCheck || activeUserCheck.subscription?.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Restricted access: An active subscription is required to perform this action.' 
      });
    }

    
    const numericScore = parseInt(score);
    if (numericScore < 1 || numericScore > 45) {
      return res.status(400).json({ success: false, message: 'Stableford score constraint error: Value must sit strictly between 1 and 45.' });
    }

    
    
    const duplicateGuard = await GolfScore.findOne({ userId: req.user.id, scoreDate });
    if (duplicateGuard) {
      return res.status(400).json({ success: false, message: 'Duplicate scores for the same date are not allowed. An existing score entry for a date may only be edited or deleted.' });
    }

    
    
    const userScores = await GolfScore.find({ userId: req.user.id }).sort({ scoreDate: -1 });

    if (userScores.length >= 5) {
      
      const oldestScore = userScores[userScores.length - 1];
      await GolfScore.findByIdAndDelete(oldestScore._id);
    }

    
    
    const newScore = await GolfScore.create({
      userId: req.user.id,
      score: numericScore,
      scoreDate
    });

    res.status(201).json({ success: true, data: newScore });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getUserScores = async (req, res) => {
  try {
    const scores = await GolfScore.find({ userId: req.user.id }).sort({ scoreDate: -1 }); 
    res.status(200).json({ success: true, count: scores.length, data: scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const modifyScore = async (req, res) => {
  const { score } = req.body;
  try {
    let scoreRecord = await GolfScore.findById(req.params.id);
    if (!scoreRecord) return res.status(404).json({ success: false, message: 'Target score file matching ID cannot be located' });

    if (scoreRecord.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this score entry record' });
    }

    
    const numericScore = parseInt(score);
    if (numericScore < 1 || numericScore > 45) {
      return res.status(400).json({ success: false, message: 'Stableford score constraint error: Value must sit strictly between 1 and 45.' });
    }

    scoreRecord.score = numericScore;
    await scoreRecord.save();

    res.status(200).json({ success: true, data: scoreRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};