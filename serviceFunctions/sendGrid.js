import sgMail from '@sendgrid/mail';

export async function sendEmail(type,subject,email){
    console.log(type)
    console.log(email)
    
      try{
        const message={
          to:email,
          from:{
            name:"TechREVEAL",
            email:"stevolisisjoseph@gmail.com"
          },
          subject:subject,
          html:'<h1>Welcome to techREVEAL newsletter Forum</h1><br/><p>We keep you up to date with the latest Tech news world wide</p>'
        }
        const sendEmail=sgMail.send(message)
        console.log(sendEmail)
        return true
      }catch(err){
        console.log(err)
        return err
      }
}


