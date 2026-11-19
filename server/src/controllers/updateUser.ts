// Import Dependencies
import User from "../models/User"
import {
  type Request,
  type Response
} from "express";

export default async function updateUser(req: Request, res:Response){
    try{
        const user = await User.findByIdAndUpdate({_id:req.params.id},{$set:req.body},{returnDocument:"after"})
        res.status(200).json({
            message: "User data has been updated successfully",
            userInfo: user
        })
    }catch{
        res.status(500).json({
            message: "There is a problem during updating the user account"
        })
    }
}