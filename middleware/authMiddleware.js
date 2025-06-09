import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticate=async(req,res,next)=>{
    try{
        const authHeader=req.headers.authorization;
        const tokenFromcookie=req.cookies?.accessToken;

        const token=authHeader?.startsWith('Bearer')?authHeader.split('')[1]:tokenFromcookie
        if(!token){
            return res.status(401).json({message:'Access Token missing'})
        }

        const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user=await User.findByPk(decoded.userId);
        if(!user){
            return res.status(401).json({ message: 'User not found' });
        }
        req.user=user;
        next();

    }catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access token expired' });
          }
          return res.status(401).json({ message: 'Invalid token', error: error.message });
        
    }
};