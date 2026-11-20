/* 
Project Name: Jomao 1.0.0
Description: Evrything about handling the dashboard info
Author: Salman Mokarrom
Date: 20 - 11 - 2026 - Omer Ozterk Dorm (11:18)
*/

// import dependencies
import mongoose from "mongoose"
import { type Request, type Response } from "express";
import Goal from "../../models/Goal";
import Transaction from "../../models/Transaction";

// dashboard function

export default async function dashboard(req: Request, res: Response){
    const userId = req.user!.userId;
    try{

        const goalStats = await Goal.aggregate([
                        {
                            $match: {
                            user: new mongoose.Types.ObjectId(userId)
                            }
                        },
                        {
                            $group: {
                            _id: null,

                            activeGoals: {
                                $sum: {
                                $cond: [{ $eq: ["$status", "active"] }, 1, 0]
                                }
                            },

                            completedGoals: {
                                $sum: {
                                $cond: [{ $eq: ["$status", "complete"] }, 1, 0]
                                }
                            },

                            withdrawnGoals: {
                                $sum: {
                                $cond: [{ $eq: ["$status", "withdrawn"] }, 1, 0]
                                }
                            }
                            }
                        }
                        ]);

        const stats = goalStats[0] || { activeGoals: 0, completedGoals: 0, withdrawnGoals: 0 };
        const recentTransactions = await Transaction.find({
                                user: userId
                                })
                                .sort({ createdAt: -1 })
                                .limit(5)
                                .lean();
        const depositStats = await Transaction.aggregate([
                            {
                                $match: {
                                user: new mongoose.Types.ObjectId(userId),
                                type: "deposit"
                                }
                            },
                            {
                                $group: {
                                _id: null,
                                totalDeposits: { $sum: "$amount" }
                                }
                            }
                            ]);
        res.status(200).json({
            status:"success",
            data:{
                goals:{
                    active:stats.activeGoals,
                    complete: stats.completedGoals,
                    withdraw: stats.withdrawnGoals
                },
                totalDeposit:depositStats[0].totalDeposits,
                recentTransactions:[recentTransactions]
            }
        })
    }catch{
      return res.status(500).json({
      status: "failed",
      message: "Unable to get the dashboard info, some server side error"
    });
    }
}