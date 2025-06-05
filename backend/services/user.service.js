import userModel from "../models/user.model.js";


export const createUser=async({email,password})=>{

    if(!email || !password){
        throw new Error("Email and password are required");
    }

    const existingUser=await userModel.findOne({email});
    if(existingUser){
        throw new Error("User already exists");
    }
    
   
    
    const hashedPassword=await userModel.hashPassword(password);
    const user=await userModel.create({email,password:hashedPassword});

    return user;

}