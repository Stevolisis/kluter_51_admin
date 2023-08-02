import { Template2 } from '@/emailTemplates/newArticle';
import { Template1 } from '@/emailTemplates/welcome';
import nodemailer from 'nodemailer';

export async function sendNodeMail(template, subject, toEmail, data1, data2, data3) {
    const emailTemplate=template===1 ? 
    Template1('https://techreveal.vercel.app/')
    :template===2 ?
    Template2('https://techreveal.vercel.app/',data1, data2, data3)
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
        const send=await transporter.sendMail(mailOptions);
        console.log('reeees',send)
            return true;
    }catch(err){
        console.log('error',err);
        return err;
    }
}