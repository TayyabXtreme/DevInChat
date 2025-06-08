
import express from "express";
import morgan from "morgan";
import connectDB from "./db/db.js";
import UserRoutes from "./routes/user.routes.js";
import ProjectRoutes from "./routes/project.routes.js";
import AiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

connectDB();

const app=express();
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/users",UserRoutes);
app.use('/projects',ProjectRoutes);
app.use('/ai',AiRoutes);


app.get("/",(req,res)=>{
    res.send("Hello World");
});

export default app;