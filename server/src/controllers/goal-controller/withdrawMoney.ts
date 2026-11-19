/* 
Project Name: Jomao 1.0.0
Description: Withdrawing money from goals if they reach their targeted amount
Author: Salman Mokarrom
Date: 19 - 11 - 2026 - Omer Ozterk Dorm (11:17pm)
*/

import {
  type Request,
  type Response
} from "express";

import mongoose from "mongoose";
import { z } from "zod";

import Goal from "../../models/Goal";
import Transaction from "../../models/Transaction";
import { mongoIdSchema } from "../../utilities/common.validator";

export default async function withdrawMoney(
  req: Request,
  res: Response
) {
  let userId: string | undefined;
  let goalId: string | undefined;
  let idempotencyKey: string | undefined;

  const session = await mongoose.startSession();

  try {
    // 1. Validate goal ID
    const result = mongoIdSchema.safeParse(req.params.goalId);

    if (!result.success) {
      return res.status(400).json({
        status: "failed",
        message: "Goal ID is invalid"
      });
    }

    // 2. Get authenticated user
    userId = req.user!.userId;
    goalId = result.data;

    // 3. Validate idempotency key
   const idempotencyKey = req.headers["idempotency-key"];

if (
  typeof idempotencyKey !== "string" ||
  idempotencyKey.length === 0
) {
  return res.status(400).json({
    status: "failed",
    message: "Idempotency key is required"
  });
}


    // 4. Check whether this request was already processed
    const existingTransaction = await Transaction.findOne({
      user: userId,
      idempotencyKey
    });

    if (existingTransaction) {
      if (
        existingTransaction.goal.toString() !== goalId ||
        existingTransaction.type !== "withdraw"
      ) {
        return res.status(409).json({
          status: "failed",
          message: "Idempotency key was already used for another operation"
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Withdrawal already processed",
        transaction: existingTransaction
      });
    }

    // 5. Update goal and create transaction atomically
    const updatedGoal = await session.withTransaction(async () => {

      const goal = await Goal.findOneAndUpdate(
        {
          _id: goalId,
          user: userId,
          status: "complete"
        },
        {
          $set: {
            status: "withdrawn"
          }
        },
        {
          returnDocument: "after",
          session
        }
      );

      if (!goal) {
        throw new Error("GOAL_NOT_FOUND");
      }

      await Transaction.create(
        [{
          user: userId,
          goal: goalId,
          amount: goal.currentAmount,
          type: "withdraw",
          idempotencyKey
        }],
        { session }
      );

      return goal;
    });

    // 6. Success response
    return res.status(200).json({
      status: "success",
      message: "Money withdrawn successfully",
      goal: updatedGoal
    });

  } catch (error) {

    // 7. Recover from concurrent duplicate requests
    if (userId && goalId && idempotencyKey) {
      try {
        const existingTransaction = await Transaction.findOne({
          user: userId,
          idempotencyKey
        });

        if (existingTransaction) {
          if (
            existingTransaction.goal.toString() === goalId &&
            existingTransaction.type === "withdraw"
          ) {
            return res.status(200).json({
              status: "success",
              message: "Withdrawal already processed",
              transaction: existingTransaction
            });
          }

          return res.status(409).json({
            status: "failed",
            message: "Idempotency key was already used for another operation"
          });
        }
      } catch (lookupError) {
        console.error("Idempotency recovery error:", lookupError);
      }
    }

    // 8. Handle goal not found or ineligible
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      return res.status(404).json({
        status: "failed",
        message: "Goal not found or not eligible for withdrawal"
      });
    }

    console.error("Withdrawal error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to process withdrawal"
    });

  } finally {
    await session.endSession();
  }
}
