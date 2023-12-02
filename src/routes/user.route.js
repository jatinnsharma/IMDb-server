const express = require('express')
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword } = require('../controllers/user.controller');
const { validate, userValidtor } = require('../middlewares/validator.middleware');
const { isValidPasswordResetToken } = require('../middlewares/user.middleware');

const router = express.Router()

router.post('/create',userValidtor,validate,create);
router.post('/verify-email',verifyEmail);
router.post('/resend-email-verification-token',resendEmailVerificationToken);
router.post('/forget-password',forgetPassword);
router.post('/verify-password-reset-token',isValidPasswordResetToken,(req,res)=>{
    res.json({valid:true});
});

module.exports=router;

