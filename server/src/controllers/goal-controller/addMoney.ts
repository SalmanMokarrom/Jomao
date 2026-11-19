
import mongoose from "mongoose";
import Goal from "../../models/Goal";
import Transaction from "../../models/Transaction";
import { mongoIdSchema } from "../../utilities/common.validator";
import { type Request, type Response } from "express";

export default async function addMoney(req: Request, res: Response) {
  const session = await mongoose.startSession();

  try {
    const result = mongoIdSchema.safeParse(req.params.goalId);

    if (!result.success) {
      return res.status(400).json({
        status: "failed",
        message: "Goal ID is invalid"
      });
    }

    const { amount, idempotencyKey } = req.body;
    const userId = req.user!.userId;
    const goalId = result.data;

    // 1. Check for an already processed deposit
    const existingTransaction = await Transaction.findOne({
      user: userId,
      idempotencyKey
    });

    if (existingTransaction) {
      // Prevent reusing the same key for a different deposit
      if (
        existingTransaction.goal.toString() !== goalId ||
        existingTransaction.amount !== amount
      ) {
        return res.status(409).json({
          status: "failed",
          message: "Idempotency key was already used for another deposit"
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Deposit already processed",
        transaction: existingTransaction
      });
    }

    let updatedGoal;

    // 2. Update goal and create transaction atomically
    await session.withTransaction(async () => {
      updatedGoal = await Goal.findOneAndUpdate(
        {
          _id: goalId,
          user: userId,
          status: "active"
        },
        [
          {
            $set: {
              currentAmount: {
                $add: ["$currentAmount", amount]
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
          returnDocument:"after",
          session,
          updatePipeline: true
        }
      );

      if (!updatedGoal) {
        throw new Error("Goal not found or is no longer active");
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
    });

    return res.status(200).json({
      status: "success",
      message: "Deposit recorded successfully",
      goal: updatedGoal
    });

  } catch (err: any) {
    // 3. Handle concurrent duplicate requests
    if (err.code === 11000) {
      const existingTransaction = await Transaction.findOne({
        user: req.user!.userId,
        idempotencyKey: req.body.idempotencyKey
      });

      if (existingTransaction) {
        if (
          existingTransaction.goal.toString() === req.params.goalId &&
          existingTransaction.amount === req.body.amount
        ) {
          return res.status(200).json({
            status: "success",
            message: "Deposit already processed",
            transaction: existingTransaction
          });
        }

        return res.status(409).json({
          status: "failed",
          message: "Idempotency key was already used for another deposit"
        });
      }
    }

    console.error(err);

    return res.status(500).json({
      status: "failed",
      message: "Unable to process deposit"
    });

  } finally {
    await session.endSession();
  }
}
