// Import Dependencies
import Goal from "../../models/Goal";
import {
  type Request,
  type Response
} from "express";

export default async function getGoal(req: Request, res:Response){
    try{
        const goals = await Goal.find({
            user:req.user!.userId
        }).lean().sort({ createdAt: -1 })
        if(goals.length<1){
            res.status(201).json({
            status: "success!!",
            msg:"user has no goals"
        })
        }else{
            res.status(201).json({
            status: "success!!",
            goal: goals
        })
        }

    }catch(err){
        res.status(201).json({
            msg:"something is wrong, unable to get goals",
            status: "failed!!",
            error:err
        })

    }
}