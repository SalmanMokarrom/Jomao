/* 
Project Name: Jomao 1.0.0
Author: Salman Mokarrom
Date: 1 - 11 - 2026 - Library of ITU
*/

// install Dependencies

import express from "express";
import errorHandler from "./middleware/errorHandler";
import userHandler from "./routes/userHandler"
import goalHandler from "./routes/goalHandler"
import dashboardHandler from "./routes/dashboardHandler"


// Initialize App Object

const app = express()

// Middlewares

app.use(express.json())
app.get("/health",(req,res)=>{
    res.status(200).json({
        status: "ok",
        message: "Jomao API is running"
    })
})
// User signup and Login
app.use("/user", userHandler)

// Goal CRUD with validation, Authentication and Authorization
app.use("/goal", goalHandler)

// all of the dashboard info
app.use("/dashboard", dashboardHandler)


// Default Error Handling Middleware
app.use(errorHandler)



export default app;

