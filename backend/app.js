
import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import UserRouter from "./routes/user.routes.js";
connectDB();

const app=express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/v1/user",UserRouter);

app.get("/",(req,res)=>{
    res.send("Hello World");
});

export default app;