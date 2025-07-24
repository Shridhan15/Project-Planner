import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 

const authUser = async (req, res, next) => {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");  
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next(); 

  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};

export default authUser;
