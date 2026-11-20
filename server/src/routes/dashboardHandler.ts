/* 
Project Name: Jomao 1.0.0
Description: Evrything about handling the dashboard info
Author: Salman Mokarrom
Date: 20 - 11 - 2026 - Omer Ozterk Dorm (11:05)
*/

// dependencies
import express from "express"
import checkLogin from "../middleware/checkLogin"
import dashboard from "../controllers/dashboard-controller/dashboard"

// initiate the router
const dashboardRouter = express.Router()


// initiate the routes
dashboardRouter.get("/", checkLogin, dashboard)

export default dashboardRouter