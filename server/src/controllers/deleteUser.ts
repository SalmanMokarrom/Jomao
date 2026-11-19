// Import Dependencies
import User from "../models/User"
import {
  type Request,
  type Response
} from "express";

export default async function updateUser(req: Request, res:Response){
    try{
        await User.findByIdAndDelete({_id:req.params.id})
        res.status(200).json({
            message: "User data has been deleted successfully"
        })
    }catch{
        res.status(500).json({
            message: "There is a problem during deleting the user account"
        })
    }
}