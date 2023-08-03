import { baseUrl } from '@/components/BaseUrl';
import { Template1 } from '@/emailTemplates/welcome';
import { Template2 } from '@/emailTemplates/showArticles';
import { Template3 } from '@/emailTemplates/newArticle';
import { Template4 } from '@/emailTemplates/message';
import nodemailer from 'nodemailer';

export async function sendNodeMail(template, subject, toEmail, data1, data2, data3, data4) {
    const emailTemplate=template===1 ? 
    Template1(baseUrl)
    :template===2 ?
    Template2(baseUrl,data1, data2, data3)
    :template===3 ?
    Template3(baseUrl,data1, data2, data3, data4)
    :template===4 ?
    Template4(data1)
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
            return true;
    }catch(err){
        return false;
    }
}