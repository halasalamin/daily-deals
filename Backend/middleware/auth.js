import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {

    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please login"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        if (decoded.role === 'admin') {
          req.user = await userModel.findById(decoded.id); // Always get from DB
          return next();
        }
        const user = await userModel.findById(req.userId);


        req.user = user.toObject();
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
              success: false,
              message: "Token expired, please login again"
            });
          }
          if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
              success: false,
              message: "Invalid token"
            });
          }  res.status(401).json({
            success: false,
            message: "Invalid token, please login again"
        });
    }
};

export default authUser;  
