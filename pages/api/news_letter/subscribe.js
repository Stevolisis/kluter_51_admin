import { sendEmail } from "@/serviceFunctions/sendGrid";
import formidable from "formidable";
import Articles from "../../../db/Model/articleSchema";
import Users from "../../../db/Model/userSchema";

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
        const users=await Users.find({}).lean();
        let subscribers=[];
        // console.log(users)

        if(users){
            users.map(user=>{
                // console.log(user)
                subscribers.push(user.email);
            })
        }

        form.parse(req,async function(err, fields) {
            if (err) throw new Error('Error at Parsing');
            // console.log('fields',fields);
    
            const emailSent=sendEmail(1,subscribers,'TechREVEAL NewsLetter','stevolisisjosephpur@gmail.com',latest,most_read);
            const emailSent2=sendEmail(2,subscribers,'New Article Just In','stevolisisjosephpur@gmail.com',latest,most_read);
            
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
