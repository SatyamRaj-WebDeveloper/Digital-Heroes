import mongoose from 'mongoose';

const golfScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true, min: 1, max: 45 }, 
  scoreDate: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});


golfScoreSchema.index({ userId: 1, scoreDate: 1 }, { unique: true });

export default mongoose.model('GolfScore', golfScoreSchema);