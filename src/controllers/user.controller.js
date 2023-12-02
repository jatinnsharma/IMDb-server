const User = require('../models/user.model')

exports.create = async (req,res)=>{
    const {name,email,password} = req.body;

    const oldUser = await User.findOne({email})

    if(oldUser) return res.status(401),json({error:"This email is already in use!"})

    // create new user inside our database 
    const newUser = new User({name,email,password})

    // save inside our database which async task
    await newUser.save() 

    res.status(201).json({user:newUser})

}