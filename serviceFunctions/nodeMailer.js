import { Test } from '@/emailTemplates/welcome';
import nodemailer from 'nodemailer';

export async function sendNodeMail(subject, toEmail, otpText) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILSENDER,
        pass: process.env.EMAILPASS,
      },
      tls: {
        rejectUnauthorized: false
    }
    });
  
    var mailOptions = {
      from: 'harmonicsub8@gmail.com',
      to: toEmail,
      subject: subject,
      text: otpText,
      html:Test('https://techreveal.vercel.app/')
    };
  
    try{
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log('error',error);
              return error;
            } else {
              console.log('info',info)
              console.log("Email Sent");
              return true;
            }
          });
    }catch(err){
        console.log('error',err);
        return err;
    }
}