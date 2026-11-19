// Import Dependencies
import User from "../../models/User";
import {
  type Request,
  type Response,
  type NextFunction
} from "express";
import argon2 from "argon2"
import { type loginInput } from "../../schemas/validation-schema/user-schema/validate.login.schema";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";


export default async function loginUser(req:Request<{},{},loginInput>, res: Response, next: NextFunction){
    try{
        
        const user = await User.findOne({email:req.body.email})
        if(user){
            const isValidPassword = await argon2.verify(user.password, req.body.password)
            console.log(isValidPassword)
            if(isValidPassword){
                // generate token
                const token = jwt.sign({
                    email: user.email,
                    userId:user._id
                },env.JWT_SECRET,{
                    expiresIn:"1h"
                })

                // provide login success response
                res.setHeader("Authorization", `Bearer ${token}`);
                res.status(200).json({
                message:"brooo, Login is successfull",
                token:token
                })
            }else{
                res.status(401).json({
                message:"brooo, your password is wrong"
            })
            }
        }else{
            res.status(404).json({
                message:"brooo, this user doesnt exist."
            })
        }
    }catch (er){
        next(er)
    }
}