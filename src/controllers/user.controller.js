const User = require('../models/user.schema')
const nodemailer = require('nodemailer')
const EmailVerificationToken = require('../models/emailVerificationToken.schema');
const { isValidObjectId } = require('mongoose');
exports.create = async (req,res)=>{
    const {name,email,password} = req.body;

    const oldUser = await User.findOne({email});

    if(oldUser) return res.status(401),json({error:"This email is already in use!"})

    // create new user inside our database 
    const newUser = new User({name,email,password})

    // save inside our database which async task
    await newUser.save() 

    // generate 6 digit otp. 
    let OTP=''
    for(let i=0;i<=5;i++){
        // Math.random() * 9 // 4.4234234234
         let randomNumber  =Math.round(Math.random() * 9 ) // 4
         OTP+= randomNumber;
    }

    // store otp inside our database.  
    const newEmailVerificationToken = new EmailVerificationToken({
        owner:newUser._id,
        token:OTP
    })

    await newEmailVerificationToken.save()

    // send that otp to our user.
    // nodemailer webside data
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "596002148130f3",
          pass: "cebd3db9c31d88"
        }
      });

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
    if(!user) return res.json({error:"user not found!"})

    // check if user already verified or not
    if(user.isVerified) return res.json({error:"user is already verified"});

    //check token is present or not
    const token = await EmailVerificationToken.findOne({owner:userId})
    if(!token) return res.json({error:"token not found! "})

    const isMatched = await token.compaireToken(OTP)
    if(!isMatched) return res.json({error:"Please submit a valid OTP"})

    user.isVerified = true;
    await user.save();

    // delete email token from database 
    await EmailVerificationToken.findByIdAndDelete(token._id)

    
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "596002148130f3",
            pass: "cebd3db9c31d88"
        }
    });

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
    if(!user) return res.json({error:"user not found!"})

    if(user.isVerified) return res.json({error:"This email Id is already verified!"})

    const alreadyHasToken = await EmailVerificationToken.findOne({owner: userId});
    if(alreadyHasToken) return res.json({error:"Only after one hour after you can request for another token!"})
   
     // generate 6 digit otp. 
     let OTP=''
     for(let i=0;i<=5;i++){
         // Math.random() * 9 // 4.4234234234
          let randomNumber  =Math.round(Math.random() * 9 ) // 4
          OTP+= randomNumber;
     }
 
     // store otp inside our database.  
     const newEmailVerificationToken = new EmailVerificationToken({
         owner:user._id,
         token:OTP
     })
 
     await newEmailVerificationToken.save()
 
     // send that otp to our user.
     // nodemailer webside data
     const transport = nodemailer.createTransport({
         host: "sandbox.smtp.mailtrap.io",
         port: 2525,
         auth: {
           user: "596002148130f3",
           pass: "cebd3db9c31d88"
         }
       });
 
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