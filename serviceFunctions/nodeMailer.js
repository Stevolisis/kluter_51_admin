import { Template2 } from '@/emailTemplates/newArticle';
import { Template1 } from '@/emailTemplates/welcome';
import nodemailer from 'nodemailer';

export async function sendNodeMail(template, subject, toEmail, data1, data2, data3) {
            console.log('rtyui',data2)
    const emailTemplate=template===1 ? 
    Template1('https://techreveal.vercel.app/')
    :template===2 ?
    Template2(data1, data2, data3)
    :''

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
      html: emailTemplate
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