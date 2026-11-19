// Import Dependencies
import User from "../../models/User";
import {
  type Request,
  type Response,
  type NextFunction
} from "express";
import argon2 from "argon2"
import { type SignupInput } from "../../schemas/validation-schema/user-schema/validate.signup.schema";


export default async function signupUser(req: Request<{},{},SignupInput>, res:Response, next:NextFunction){
  
    try{

      const userExist = await User.findOne({email:req.body.email})

      if(userExist){
        res.status(401).json({
          message:"User already exist"
        })
      }else{
      const {name, email, password} = req.body
      // hash the password
      const hashedPassword = await argon2.hash(password,{
        type:argon2.argon2id
      })

      // create the user
      const user = await User.create(
        {
          name,
          email,
          password: hashedPassword
        }
      )

      // provide response
      return res.status(201).json(
        {
          success: true,
          message: "User created successfully",
          user:{
            id: user._id,
            name: user.name,
            email: user.email

          }
        }
      )
      }
      

      
    } catch(er){
      res.status(500).json({
        message: "there is an internel server error"
      })
    }
}