import nodemailer from 'nodemailer';

export async function sendNodeMail(subject, toEmail, otpText) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'harmonicsub8@gmail.com',
        pass: 'ljecbufrfqqhyptn',
      },
      tls: {
        rejectUnauthorized: false
    }
    });
  
    var mailOptions = {
      from: 'harmonicsub8@gmsil.com',
      to: toEmail,
      subject: subject,
      text: otpText,
      html:"<h1>Nice Try</h1><br/><a href='https://harmonic-sub.vercel.app'>Go to Site</a>"
    };
  
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
}