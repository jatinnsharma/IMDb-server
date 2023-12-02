const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI,{
    family: 4,    
}).then(()=>{
    console.log('db is connected!')
}).catch((error)=>{
    console.log(`Database connection failed ${error}`)
})