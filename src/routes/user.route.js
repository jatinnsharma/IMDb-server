const express = require('express')
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn } = require('../controllers/user.controller');
const { validate, userValidtor, validatePassword, signInValidator } = require('../middlewares/validator.middleware');
const { isValidPasswordResetToken } = require('../middlewares/user.middleware');

const router = express.Router()

router.post('/create', userValidtor, validate, create);
router.post('/sign-in', signInValidator, validate, signIn);
router.post('/verify-email', verifyEmail);
router.post('/resend-email-verification-token', resendEmailVerificationToken);
router.post('/forget-password', forgetPassword);
router.post('/verify-password-reset-token', isValidPasswordResetToken, sendResetPasswordTokenStatus);
router.post('/reset-password', validatePassword, validate, isValidPasswordResetToken, resetPassword);

module.exports = router;

