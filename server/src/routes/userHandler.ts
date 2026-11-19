// Import Dependencies
import express from "express";
import createUser from "../controllers/goal-controller/createGoal";
import updateUser from "../controllers/updateUser";
import deleteUser from "../controllers/deleteUser"
import signupUser from "../controllers/user-controller/signupUser";
import { signupSchema } from "../schemas/validation-schema/user-schema/validate.signup.schema";
import validateRequest  from "../middleware/validate.middleware";
import loginUser from "../controllers/user-controller/loginUser";
import { loginSchema } from "../schemas/validation-schema/user-schema/validate.login.schema";

// Initialize Routes
const router = express.Router();


// Managing Routes

// create a user
router.post("/",createUser)

// get a user by id
//router.get("/:id", getUser)

// update a user by id
router.put("/:id", updateUser)

// delete a user by id
router.delete("/:id", deleteUser)

// signup user
router.post("/signup",validateRequest(signupSchema),  signupUser)

// login user
router.post("/login", validateRequest(loginSchema), loginUser)

export default router;




