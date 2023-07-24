import sgMail from '@sendgrid/mail';
sgMail.setSubstitutionWrappers('{{', '}}');

export async function sendEmail(type,subscribers,subject,email,data1,data2,data3){
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const emailTemplate=['d-3dabf83b3c8a480daa14a2a0b0737d5c','d-f0e286a0ee614fab874c4193868aa29d','d-5d881094bdde4eb1abc67784a7903f03'];

    function getMonthName(month) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames[month - 1];
    }


      try{
        const message={
          from:{
            name: "TechREVEAL",
            email: "stevolisisjoseph@gmail.com"
          },
          template_id: emailTemplate[parseInt(type)],
          personalizations:[{
            to:subscribers||email,
            subject: subject,
            dynamic_template_data: {
              company_info: data1,
              most_read:data2,
              new_article:data3
              // monthName: getMonthName(5),     
            },
          }]

        }

        const sendEmail=await sgMail.send(message)
        console.log(sendEmail)
        return true


      }catch(err){
        console.log(err.message)
        return false
      }
}


