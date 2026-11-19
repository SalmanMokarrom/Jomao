// Import Dependencies
import Goal from "../../models/Goal";
import {
  type Request,
  type Response
} from "express";
import { type CreateGoalInput } from "../../schemas/validation-schema/goal-schema/validate.create.goal.schema";

import calculateMaturity from "../../utilities/calculateMaturity";
// Initiate Variables


export default async function createGoal(req:Request<{},{},CreateGoalInput>, res:Response){
    try{
        const {title, targetAmount, durationMonths} = req.body
        const maturityDate = calculateMaturity(durationMonths)
        const goal = await Goal.create({
            user: req.user!.userId,
            title,
            targetAmount,
            durationMonths,
            maturityDate
        })
        res.status(201).json({
            msg:"the goal has been created successfully",
            status: "success!!",
            goal: goal
        })

    }catch(er){
res.status(500).json({
            msg:"failed to create a goal!",
            status: "failed!!",
            error:er
        })
    }
}