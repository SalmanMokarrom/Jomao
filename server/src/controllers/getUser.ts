import User from "../models/User";
import {
  type Request,
  type Response
} from "express";

export default async function updateUser(req: Request, res: Response){
    try{
        const user = await User.findOne({_id:req.params.id})
        res.status(200).json(user)
    }catch{
        res.status(500).json({
            message:"such user does not exist"
        })
    }
}