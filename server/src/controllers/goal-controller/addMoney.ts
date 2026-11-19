
import mongoose from "mongoose";
import Goal from "../../models/Goal";
import Transaction from "../../models/Transaction";
import { mongoIdSchema } from "../../utilities/common.validator";
import { type Request, type Response } from "express";

export default async function addMoney(req: Request, res: Response) {
  let session: mongoose.ClientSession | undefined;

  let userId: string | undefined;
  let goalId: string | undefined;
  let amount: number | undefined;
  let idempotencyKey: string | undefined;

  try {
    // 1. Validate goal ID
    const result = mongoIdSchema.safeParse(req.params.goalId);

    if (!result.success) {
      return res.status(400).json({
        status: "failed",
        message: "Goal ID is invalid"
      });
    }

    // 2. Get request data
    const { amount: depositAmount, idempotencyKey: key } = req.body;

    userId = req.user!.userId;
    goalId = result.data;
    amount = depositAmount;
    idempotencyKey = key;

    // 3. Validate idempotency key
    if (
      typeof idempotencyKey !== "string" ||
      !idempotencyKey.trim()
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Idempotency key is required"
      });
    }

    // 4. Check for an already processed deposit
    const existingTransaction = await Transaction.findOne({
      user: userId,
      idempotencyKey
    });

    if (existingTransaction) {
      if (
        existingTransaction.goal.toString() !== goalId ||
        existingTransaction.amount !== amount ||
        existingTransaction.type !== "deposit"
      ) {
        return res.status(409).json({
          status: "failed",
          message: "Idempotency key was already used for another operation"
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Deposit already processed",
        transaction: existingTransaction
      });
    }

    // 5. Start database session
    session = await mongoose.startSession();

    // 6. Update goal and create transaction atomically
    const updatedGoal = await session.withTransaction(async () => {

      const goal = await Goal.findOneAndUpdate(
        {
          _id: goalId,
          user: userId,
          status: "active"
        },
        [
          {
            $set: {
              currentAmount: {
                $add: [
                  { $ifNull: ["$currentAmount", 0] },
                  amount
                ]
              }
            }
          },
          {
            $set: {
              status: {
                $cond: [
                  { $gte: ["$currentAmount", "$targetAmount"] },
                  "complete",
                  "active"
                ]
              }
            }
          }
        ],
        {
          returnDocument: "after",
          session,
          updatePipeline: true
        }
      );

      if (!goal) {
        throw new Error("GOAL_NOT_FOUND");
      }

      await Transaction.create(
        [{
          user: userId,
          goal: goalId,
          amount,
          type: "deposit",
          idempotencyKey
        }],
        { session }
      );

      return goal;
    });

    // 7. Success response
    return res.status(200).json({
      status: "success",
      message: "Deposit recorded successfully",
      goal: updatedGoal
    });

  } catch (error: any) {

    // 8. Recover from duplicate/concurrent requests
    if (userId && goalId && idempotencyKey) {
      try {
        const existingTransaction = await Transaction.findOne({
          user: userId,
          idempotencyKey
        });

        if (existingTransaction) {
          if (
            existingTransaction.goal.toString() === goalId &&
            existingTransaction.amount === amount &&
            existingTransaction.type === "deposit"
          ) {
            return res.status(200).json({
              status: "success",
              message: "Deposit already processed",
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

    // 9. Handle unavailable or ineligible goal
    if (
      error instanceof Error &&
      error.message === "GOAL_NOT_FOUND"
    ) {
      return res.status(404).json({
        status: "failed",
        message: "Goal not found or is no longer active"
      });
    }

    console.error("Deposit error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Unable to process deposit"
    });

  } finally {
    await session?.endSession();
  }
}
