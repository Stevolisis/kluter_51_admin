import nodemailer from 'nodemailer';

export async function sendNodeMail(subject, toEmail, otpText) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'harmonicsub8@gmsil.com',
        pass: 'seetheworld',
      },
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
        throw new Error(error);
      } else {
        console.log("Email Sent");
        return true;
      }
    });
}