import jwt from "jsonwebtoken";
import redisClient from "../services/radis.service.js";
import userModel from "../models/user.model.js"
export const authUser=async(req,res,next)=>{
    try {
        const token=req.cookies.token ||  req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(400).json({message:"Invalid credentials"});
        }
       


        const isBlacklisted=await redisClient.get(token);
        if(isBlacklisted){
            res.cookie('token','')
            return res.status(400).json({message:"Invalid credentials"});
        }
        const decoded=await jwt.verify(token,process.env.JWT_SECRET); 
        const user=await userModel.findOne({email:decoded.email})
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        req.user=decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"Invalid credentials"});
        
    }
}