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


app.use("/api/user", userRouter);

app.post("/sign-in",
  (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password)
      return res.json({ error: 'email/ password missing!' })
    next()
  },
  (req, res) => {
    res.send("<h1>Hello I am from your backend about</h1>");
});


app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})