const userRouter = require("./user.router");
const { Router } = require("express")

const rootRouter = Router()
rootRouter.use("/users", userRouter) 

module.exports = rootRouter