import { sendEmail } from "@/serviceFunctions/sendGrid";
import formidable from "formidable";
import Articles from "../../../db/Model/articleSchema";
import Users from "../../../db/Model/userSchema";
import Settings from "../../../db/Model/general_settingSchema";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();

    try{
        let most_read=await Articles.findOne({status:'active'}).populate({ path: 'author',select:'full_name' });
        const company_info=await Settings.findOne({});
        const users=await Users.find({}).lean();
        let subscribers=[];

        if(users){
            users.map(user=>{
                subscribers.push(user.email);
            })
        }

        form.parse(req,async function(err) {
            if (err) throw new Error('Error at Parsing');
    
            const emailSent=sendEmail(1,subscribers,'TechREVEAL NewsLetter','stevolisisjosephpur@gmail.com');
            const emailSent2=sendEmail(2,subscribers,`Just In: ${company_info[0].name}`,'stevolisisjosephpur@gmail.com',company_info,most_read);
            
            await Promise.all([emailSent,emailSent2])
            .then(response=>{
                if(response[0]&&response[1]){
                    res.status(200).json({status:'success nigga'})
                }else{
                    res.status(404).json({status:'error nigga'})
                }
            })
            

        });
    }catch(err){
        res.status(404).json({status:err.message})
    }  
}
