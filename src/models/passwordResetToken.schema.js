const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const passwordResetTokenSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        expires:3600, // 60 mins x 60 mins 
        default:Date.now() // start when token is saved into database
    },
})

passwordResetTokenSchema.pre('save',async function(next){
    if(this.isModified('token')){
    this.token = await bcrypt.hash(this.token,10)
    }
    next();
})

passwordResetTokenSchema.methods.compareToken = async function(token){
    const result = await bcrypt.compare(token,this.token)
    return result;
}

module.exports = mongoose.model('PasswordResetToken',passwordResetTokenSchema)