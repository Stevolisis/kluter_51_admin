import sgMail from '@sendgrid/mail';


export async function sendEmail(type,subject,email,data1,data2){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const emailTemplate=['d-3dabf83b3c8a480daa14a2a0b0737d5c'];
    console.log(data1)
    console.log(email);

      try{
        const message={
          from:{
            name:"TechREVEAL",
            email:"stevolisisjoseph@gmail.com"
          },
          subject:subject,
          template_id: emailTemplate[parseInt(type)],
          personalizations:[{
            to:{email:email},
            dynamic_template_data: {
              items: data1,
              most_read:data2,
              month_names:['January','February',"March","April","May","June","July","August","September","October","November","December"]
            },
          }]
        }

        const sendEmail=await sgMail.send(message)
        console.log(sendEmail)
        return true


      }catch(err){
        console.log(err.message)
        return err
      }
}


