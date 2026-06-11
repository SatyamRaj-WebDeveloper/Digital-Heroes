import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema({
  drawMonth: { type: String, required: true }, 
  winningNumbers: { 
    type: [Number], 
    validate: [val => val.length === 5, 'Draw must contain exactly 5 numbers'] 
  },
  prizePoolTotal: { type: Number, required: true },
  isPublished: { type: Boolean, default: false }, 
  winners: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchTier: { type: Number, enum: [3, 4, 5] },
    prizeAllocated: { type: Number },
    proofImageUrl: { type: String }, 
    verificationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    payoutStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }
  }]
}, { timestamps: true });

export default mongoose.model('Draw', drawSchema);