/* 
Project Name: Jomao 1.0.0
Description: Getting all the transactions related to a single goal
Author: Salman Mokarrom
Date: 9 - 11 - 2026 - Library of ITU (12:42)
*/

import {
  type Request,
  type Response,
  type NextFunction
} from "express";
import Transaction from "../../models/Transaction";

export default async function getTransactions(req: Request, res:Response){
try{
    const transactions = await Transaction.find({
        user:req.user!.userId,
        goal: req.params.goalId
    }).lean().sort({ createdAt: -1 })
    if(!transactions){
        return res.status(501).json({
        msg:"user is not valid "
    })}
    
    if(transactions.length<1){
       return res.status(403).json({
        msg:"this goal dont have any transaction "
    })}
    res.status(200).json({
        msg:"the transactions related to this goal has been received succcessfully ",
        transactions
    })
}catch(er){
    res.status(500).json({
        msg:"there is some prblm regarding getting transaction history",
        err:er
    })
}
}