require('dotenv').config({path:  './.env'})
const express = require('express')
const app = express()
const PORT = process.env.PORT
const cors = require('cors')
app.use(cors())
app.use(express.json())
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
const userRouter = require('./routes/user.route')
require('./db')

app.use("/api/user", userRouter);



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})