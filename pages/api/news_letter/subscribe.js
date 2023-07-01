import { sendEmail } from "@/serviceFunctions/sendGrid";
import formidable from "formidable";
import Articles from "../../../db/Model/articleSchema";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();

    try{
        let most_read=await Articles.findOne({status:'active'}).populate({ path: 'author',select:'full_name' });
        const latest=await Articles.find({}).populate({ path: 'author',select:'full_name' }).limit(5).sort({_id:-1}).lean();

        form.parse(req,async function(err, fields) {
            if (err) throw new Error('Error at Parsing');
            console.log('fields',fields);
    
            const emailSent=await sendEmail(0,'TechREVEAL NewsLetter','stevolisisjosephpur@gmail.com',latest,most_read);
            
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
