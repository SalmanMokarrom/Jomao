// import dependencies
import {
  type Request,
  type Response,
  type NextFunction
} from "express";
import jwt from "jsonwebtoken"
import { env } from "../config/env";
const  checkLogin = (req:Request, res:Response, next:NextFunction)=>{
    const {authorization} = req.headers
    try{
        if (!authorization) {
      throw new Error("Authorization header is missing");
    }
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, env.JWT_SECRET )
        const {email, userId} = decoded as {
      email: string;
      userId: string;
    };
        req.user = {
            email: email,
            userId: userId
        };
        next()
    }catch(err){
        next(err)
    }
}

export default checkLogin