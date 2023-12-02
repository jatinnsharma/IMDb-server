const { isValidObjectId } = require("mongoose");
const { sendError } = require("../utils/helper");
const PasswordResetToken = require('../models/passwordResetToken.schema')


exports.isValidPasswordResetToken = async (req,res,next)=>{
    const {token,userId} = req.body;

    if(!token.trim() || !isValidObjectId(userId)) return sendError(res,'Invalid request!')

    const resetToken = await PasswordResetToken.findOne({owner:userId})
    if(!resetToken) return sendError(res,"Unauthorized access , invalid request!")

    const match =await resetToken.compareToken(token)
    if(!match) return sendError(res,'Unauthorized access , invalid request!')

    req.resetToken = resetToken;
    next()
}