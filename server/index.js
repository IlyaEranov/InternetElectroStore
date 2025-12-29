const express = require("express")
require("dotenv").config()

const port = process.env.PORT || 5000
const app = express()

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