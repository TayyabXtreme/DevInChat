import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[6,"Email must be at least 6 characters"],
        maxLength:[50,"Email must be at most 50 characters"]
    },
    password:{
        type:String,
        select:false
    },
})

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

userSchema.statics.comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

userSchema.methods.generateJWT=async function(){
    return await jwt.sign({email:this.email},process.env.JWT_SECRET,{expiresIn:"1d"});
}

const User=mongoose.model("User",userSchema);

export default User;