import { createUser } from "../services/user.service.js"
import {validationResult} from "express-validator"
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

