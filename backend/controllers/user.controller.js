import { createUser } from "../services/user.service.js"
import {validationResult} from "express-validator"
import userModel from "../models/user.model.js"
import redisClient from "../services/radis.service.js"

export const createUserController=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try {
        const {email,password}=req.body;
        const user=await createUser({email,password});
        if(!user){
            return res.status(400).json({message:"User already exists"});
        }
        const token=await user.generateJWT();

        res.status(201).json({user,token});


    } catch (error) {
        res.status(500).json({message:error.message});
    }

}


export const loginController=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
        try {
            const {email,password}=req.body;
            const user = await userModel.findOne({ email }).select("+password");
            if(!user){
                return res.status(400).json({message:"User not found"});
            }
            const isMatch = await userModel.comparePassword(password, user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid credentials"});
            }
            const token=await user.generateJWT();
            //in user object password remove
            user.password=undefined;


            res.status(200).json({user,token});
            
        } catch (error) {
            
        }
}



export const profileController=async(req,res)=>{
    console.log(req.user)
    res.status(200).json({user:req.user});
}

export const logoutController=async(req,res)=>{
    try {
        const token=req.cookies.token || req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(400).json({message:"Token not found"});
        }
        redisClient.set(token,'logout',"EX",60*60*24);
        res.status(200).json({message:"Logout successfully"});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}