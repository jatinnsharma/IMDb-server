const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false,
    }
 })

 userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    
    this.password = await bcrypt.hash(this.password,10);
    next()
 })

module.exports = mongoose.model('User',userSchema)