require('dotenv').config({path:  './.env'})
require('express-async-errors');
const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
const userRouter = require('./routes/user.route')
require('./db')
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/errorHandler.middleware');
const { handleNotFound } = require('./utils/helper');

const PORT = process.env.PORT

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/api/user", userRouter);

app.use('/*',handleNotFound)

app.use(errorHandler)


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})