import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Public', 'Subscriber', 'Administrator'], 
    default: 'Subscriber' 
  },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'lapsed'], default: 'inactive' },
    planType: { type: String, enum: ['monthly', 'yearly'] },
    renewalDate: { type: Date },
    charityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Charity' },
    charityPercentage: { type: Number, default: 10, min: 10 } 
  },
  localization: {
    countryCode: { type: String, default: 'IN' }, 
    preferredCurrency: { type: String, default: 'INR' } 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);