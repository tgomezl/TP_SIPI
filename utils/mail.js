const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const nodemailer=require("nodemailer")

const sendMail=async (options)=>{

    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
        user:process.env.EMAIL_USER_NAME,
        pass:process.env.EMAIL_PASSWORD
        }

    })

    //email options
    const mailoptions={
        from:"fixersApp@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailoptions)
    
}
module.exports = sendMail;
//send the email