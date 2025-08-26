const nodemailer = require('nodemailer');
const emailTemplate = require('./emailTemplate');
require('dotenv').config();

const MailSender= async(email,title,otp)=>{
    try{
        let transporter = nodemailer.createTransport({
            host :process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER, 
                pass: process.env.MAIL_PASS, 
            },
        });
         // Check if otp contains only digits
        const isNumeric = /^\d+$/.test(otp);
        if(isNumeric){
             let info =await transporter.sendMail({
            from: "testing the project -Ritesh Parmar",
            to:`${email}`,
            subject:`${title}`,
            html: emailTemplate(otp),
        })
        console.log(info);
        return info;
        }

        let info= await transporter.sendMail({
            from: "testing the project -Ritesh Parmar",
            to:`${email}`,
            subject:`${title}`,
            html: otp,
        })
        console.log(info);
        return info;
       

    }
    catch(error){
        console.log(error.message);
    }
}

module.exports = MailSender;