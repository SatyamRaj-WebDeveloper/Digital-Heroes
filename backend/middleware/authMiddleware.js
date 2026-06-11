import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User record no longer exists' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, token token missing' });
  }
};


export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Administrator') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Requires administrator clearance' });
  }
};


export const requireActiveSubscription = (req, res, next) => {
  if (req.user && req.user.subscription && req.user.subscription.status === 'active') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Restricted access: An active subscription is required to perform this action.' 
    });
  }
};