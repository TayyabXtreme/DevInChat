import { generateResult } from "../services/ai.service.js";


export const getResult=async(req,res)=>{
    try {
        const {prompt}=req.query;
    let result=await generateResult(prompt);
    //the result make that \n replace with actual new line not come \n  for the markdown i want

    result=result.replace(/\n/g," ");

    res.json(result);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}