/* 
Project Name: Jomao 1.0.0
Description: Evrything about handling the Goal
Author: Salman Mokarrom
Date: 5 - 11 - 2026 - Library of ITU
*/

// dependencies
import express from "express";
import createGoal from "../controllers/goal-controller/createGoal";
import checkLogin from "../middleware/checkLogin"
import getGoal from "../controllers/goal-controller/getGoal"
import validateRequest from "../middleware/validate.middleware";
import { createGoalSchema } from "../schemas/validation-schema/goal-schema/validate.create.goal.schema";
import getAGoal from "../controllers/goal-controller/getAGoal";
import depositSchema from "../schemas/validation-schema/goal-schema/validate.transaction.schema";
import addMoney from "../controllers/goal-controller/addMoney";
import getTransactions from "../controllers/goal-controller/getTransactions";
import withdrawMoney from "../controllers/goal-controller/withdrawMoney";

// Initiate Route 
const router = express.Router()

// create a goal 
router.post("/create",checkLogin,validateRequest(createGoalSchema), createGoal)

// get goals
router.get("/goals",checkLogin, getGoal)

// get a goal
router.get("/singleGoal/:id", checkLogin, getAGoal)

// add money on goal
router.post("/deposit/:goalId", checkLogin,validateRequest(depositSchema), addMoney)

// get all the transaction
router.get("/transactions/:goalId",checkLogin, getTransactions)

// withdraw money
router.get("/withdraw/:goalId", checkLogin, withdrawMoney)

// export
export default router;
