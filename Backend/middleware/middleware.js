import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = {
      id: user._id,
      role: user.role,
      companyId: user.companyId || null,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
