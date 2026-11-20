// Import Dependencies
import Goal from "../../models/Goal";
import {
  type Request,
  type Response
} from "express";

import { mongoIdSchema } from "../../utilities/common.validator";

export default async function getAGoal(req: Request, res:Response){
    try{
        const result = mongoIdSchema.safeParse(req.params.id)
        if(!result.success){
            return res.status(400).json({
                status:"failed!",
                message:"Goal id is invalid"
            })
        }
        const goal = await Goal.findOne({
            _id:result.data,
            user:req.user!.userId
        }).populate({
  path: "transactions",
  options: { sort: { createdAt: -1 }, limit: 50 },
});

        if(!goal){
        return res.status(404).json({
        status: "failed",
        message: "Goal not found"
        })}
            const progressPercentage =(goal.currentAmount / goal.targetAmount) * 100;
    
        return res.status(200).json({
        status: "success",
        goal,
        progressPercentage: `${progressPercentage}%`
        });
    }catch(err){
        res.status(500).json({
            msg:"something is wrong, unable to get goal",
            status: "failed!!",
            error:err
        })
    }
}