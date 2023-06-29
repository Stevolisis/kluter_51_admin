import sgMail from '@sendgrid/mail';

async function sendEmail(type,subject,emailData){
    console.log(type)
    console.log(emailData)
    
      try{
        const message={
          to:emailData.email,
          from:{
            name:"Grandpro Sales",
            email:"stevolisisjoseph@gmail.com"
          },
          subject:subject,
          html:'<h1>Welcome to techREVEAL newsletter Forum</h1><br/><p>We keep you up to date with the latest Tech news world wide</p>'
        }
        const sendEmail=await sgMail.send(message)
        console.log(sendEmail)
        return true
      }catch(err){
        console.log(err)
        return err
      }
    }
