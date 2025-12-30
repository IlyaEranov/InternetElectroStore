const { Router } = require("express")
const UserController = require("../controller/user.controller")
const { body } = require("express-validator")

const userRouter = Router()

userRouter.get("/register", 
    body("email").isEmail(),
    body("name").isLength({min: 2, max: 32}),
    body("password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[^a-z0-9])(?!.*\s).{7,}$/g),
    UserController.register
)

module.exports = userRouter