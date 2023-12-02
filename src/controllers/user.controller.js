const User = require('../models/user.schema')
const EmailVerificationToken = require('../models/emailVerificationToken.schema');
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError } = require('../utils/helper');
const passwordResetToken = require('../models/passwordResetToken.schema');
const {generateRandomByte }= require('../utils/helper')
const PasswordResetToken = require('../models/passwordResetToken.schema')

exports.create = async (req,res)=>{
    const {name,email,password} = req.body;

    const oldUser = await User.findOne({email});

    if(oldUser) return sendError(res,"This email is already in use!")
    // create new user inside our database 
    const newUser = new User({name,email,password})

    // save inside our database which async task
    await newUser.save() 

    // generate 6 digit otp. 
    let OTP= generateOTP()

    // store otp inside our database.  
    const newEmailVerificationToken = new EmailVerificationToken({
        owner:newUser._id,
        token:OTP
    })

    await newEmailVerificationToken.save()

    // send that otp to our user.
    // nodemailer webside data
    const transport = generateMailTransporter()

      // sending mail for otp 
      transport.sendMail({
        from:"verification@imdb.com",
        to:newUser.email,
        subject:'Email Verification',
        html:`
        <p>Your Verification OTP</p>
        <h1>${OTP}</h1>
        `
      })
    
    res.status(201).json({message:"Please verify your email. OTP has been sent to your email account!"})

}

exports.verifyEmail = async (req,res)=>{
    const {userId,OTP} = req.body;

    if(!isValidObjectId(userId)) return res.json({error:'Invalid user'})

    // check user is existing in database or not
    const user = await User.findById(userId);
    if(!user) return sendError(res,"user not found",404);

    // check if user already verified or not
    if(user.isVerified) return sendError(res,"user is already verified");

    //check token is present or not
    const token = await EmailVerificationToken.findOne({owner:userId})
    if(!token) return sendError(res,"token not found"); 

    const isMatched = await token.compareToken(OTP)
    if(!isMatched) return sendError(res,"Please submit a valid OTP");

    user.isVerified = true;
    await user.save();

    // delete email token from database 
    await EmailVerificationToken.findByIdAndDelete(token._id)

    
    const transport = generateMailTransporter()

      // sending mail for otp 
      transport.sendMail({
        from:"verification@imdb.com",
        to:user.email,
        subject:'Welcome Email',
        html:`
        <h1>Welcome to our app and thanks for choosing us.</h1>
        `
    })
     
    res.json({message:"Your email is verified."})
}


exports.resendEmailVerificationToken= async(req,res)=>{
  const {userId} = req.body;
  const user = await User.findById(userId)
  if(!user) return sendError(res,'user not found!') 

  if(user.isVerified) return sendError(res,'This email Id is already verified!') 

  const alreadyHasToken = await EmailVerificationToken.findOne({owner: userId});

  if(alreadyHasToken) return sendError(res,'Only after one hour after you can request for another token!') 

   // generate 6 digit otp. 
   let OTP=generateOTP()

   // store otp inside our database.  
   const newEmailVerificationToken = new EmailVerificationToken({
       owner:user._id,
       token:OTP
   })

   await newEmailVerificationToken.save()

   // send that otp to our user.
   // nodemailer webside data
   const transport = generateMailTransporter()

     // sending mail for otp 
     transport.sendMail({
       from:"verification@imdb.com",
       to:user.email,
       subject:'Email Verification',
       html:`
       <p>Your Verification OTP</p>
       <h1>${OTP}</h1>
       `
     })
   
   res.status(201).json({message:"New OTP has been sent to your registered email account!"})

}


exports.forgetPassword = async (req,res)=>{
  const {email} = req.body;

  if(!email) return sendError(res,'Email is missing!');

  const user = await User.findOne({email})
  if(!user) return sendError(res,'User not found!',404)

  const alreadyHasToken = await passwordResetToken.findOne({owner:user._id})
  if(alreadyHasToken) return sendError(res,"Only after one hour you can request for another token!")

  const token = await generateRandomByte()
  const newPasswordResetToken = await PasswordResetToken({owner:user._id,token});

  await newPasswordResetToken.save()

  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`

  const transport = generateMailTransporter()

  transport.sendMail({
    from:"security@imdb.com",
    to:user.email,
    subject:"Reset Password Link",
    html:`
    <p>Click here to reset password</p>
    <a href='${resetPasswordUrl}'>Change Password</a>

    `
  });

  res.json({message:'Link send to your email'})

}