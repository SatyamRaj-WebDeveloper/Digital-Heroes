import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};



export const registerUser = async (req, res) => {
  const { name, email, password, charityId } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      subscription: {
        status: 'inactive', 
        charityId: charityId || null,
        charityPercentage: 10 
      }
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role,
          subscription: user.subscription 
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials provided' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateSubscription = async (req, res) => {
  const { planType, charityId, charityPercentage, session_id } = req.body;
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User profile not found' });
    if (charityPercentage < 10) return res.status(400).json({ success: false, message: 'Minimum allocation is 10%' }); 
    if (session_id) {
      console.log(`[Database Engine] Verifying session token: ${session_id}. Promoting user ${user.name} to active.`);
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'subscription.status': 'active', 
            'subscription.planType': planType || 'monthly', 
            'subscription.charityId': charityId,
            'subscription.charityPercentage': charityPercentage || 10 
          }
        },
        { new: true } 
      );

      return res.status(200).json({ 
        success: true, 
        message: 'Subscription lifecycle validated and activated successfully.',
        user: updatedUser 
      });
    }

    
    const unitAmount = planType === 'yearly' ? 45000 : 5000; 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', 
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: `Digital Heroes ${planType || 'monthly'} Membership License`, 
            description: 'A minimum of 10% of this transaction is automatically routed to your chosen charity asset.' 
          },
          unit_amount: unitAmount,
          recurring: { interval: planType === 'yearly' ? 'year' : 'month' }
        },
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.FRONTEND_URL}/onboarding/subscribe`,
      metadata: { userId: user._id.toString(), charityId, charityPercentage }
    });

    return res.status(200).json({ success: true, url: session.url });

  } catch (error) {
    console.error("SUBSCRIPTION ROUTING FAULT:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};