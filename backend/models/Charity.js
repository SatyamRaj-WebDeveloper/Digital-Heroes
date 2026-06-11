import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },
  upcomingEvents: [{
    title: { type: String }, 
    date: { type: Date }
  }],
  isFeatured: { type: Boolean, default: false } 
}, { timestamps: true });

export default mongoose.model('Charity', charitySchema);