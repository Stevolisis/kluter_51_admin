import { sendEmail } from "@/serviceFunctions/sendGrid";
import formidable from "formidable";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();

    try{
        form.parse(req,async function(err, fields) {
            if (err) throw new Error('Error at Parsing');
            console.log('fields',fields);
    
            const emailSent=await sendEmail('ee','TechREVEAL News Letters','stevolisisjosephpur@gmail.com');
            
            if(emailSent){
                res.status(200).json({status:'success nigga'})
            }else{
                res.status(404).json({status:'error nigga'})
            }
            
        });
    }catch(err){
        res.status(404).json({status:err.message})
    }  
}
