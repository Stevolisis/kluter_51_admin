import { baseUrl } from '@/components/BaseUrl';
import { Template3 } from '@/emailTemplates/newArticle';
import { Template2 } from '@/emailTemplates/showArticles';
import { Template1 } from '@/emailTemplates/welcome';
import nodemailer from 'nodemailer';

export async function sendNodeMail(template, subject, toEmail, data1, data2, data3, data4) {
    const emailTemplate=template===1 ? 
    Template1(baseUrl)
    :template===2 ?
    Template2(baseUrl,data1, data2, data3)
    :template===3 ?
    Template3(baseUrl,data1, data2, data3, data4)
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