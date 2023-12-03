const nodemailer = require('nodemailer')


// generate 6 digit otp. 
exports.generateOTP = (OTP_LENGTH = 6) => {
    let OTP = ''
    for (let i = 1; i <= OTP_LENGTH; i++) {
        // Math.random() * 9 // 4.4234234234
        let randomNumber = Math.round(Math.random() * 9) // 4
        OTP += randomNumber;
    }
    return OTP;
}


exports.generateMailTransporter = () =>
    nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });