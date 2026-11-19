import {
  type Request,
  type Response,
  type NextFunction
} from "express";

export default function errorHandler(err: Error, req: Request, res: Response, next:NextFunction){
    if(res.headersSent){
        return next(err)
    }
    res.status(500).json({
        error: err,
        message:"There is an internal server error"
    })
}