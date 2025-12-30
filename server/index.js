const express = require("express")
const router = require("./router/index")
require("dotenv").config()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(router)

const startApp = async () => {
    try{
        app.listen(port, () => {
            console.log(`Server started on port: ${port}`)
        })
    } catch(e){
        console.log(e)
    }
}

startApp()