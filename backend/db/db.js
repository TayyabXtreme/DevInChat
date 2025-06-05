import mongoose from 'mongoose';

function connectDB() {
    const DBURI=process.env.MONGO_URL;
    mongoose.connect(DBURI).then(()=>{
        console.log("Connected to MongoDB");
    }).catch((err)=>{
        console.log(err);
    });
}

export default connectDB;