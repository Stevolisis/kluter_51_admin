import formidable from "formidable";
import Articles from "../../../db/Model/articleSchema";
import Views from '../../../db/Model/viewSchema';
import Settings from "../../../db/Model/general_settingSchema";
import emailSubscribe from "../../../db/Model/subscribersSchema";
import { sendNodeMail } from "@/serviceFunctions/nodeMailer";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();

    try{
        
        form.parse(req,async function(err,fields) {
            if (err) throw new Error('Error at Parsing');

            const emailstosend=[]
            const new_article=await Articles.find({status:'active'}).limit(1).sort({_id:-1}).lean();
            const related_articles=await Articles.find({status:'active',category:fields.category}).populate({ path: 'category',select:'name' }).limit(4).sort({_id:-1}).lean();
            const company_info=await Settings.findOne({});
            const subscribers=await emailSubscribe.find({status:true});
            subscribers.length > 0 ? 
                subscribers.map(mail=>{
                    emailstosend.push(mail.email)
                })
            :''
            let most_read_fetch=await Articles.find({status:'active'}).populate({ path: 'category',select:'name' }).limit(2).lean();
            for (let i = 0; i < most_read_fetch.length; i++) {
                most_read_fetch[i].views=await Views.count({pageId:most_read_fetch[i]._id});
                most_read_fetch[i].description=most_read_fetch[i].content.slice(0,130)+'...';
            }
            let most_read=most_read_fetch.sort((a,b)=>a.views < b.views ? 1:-1);

            if(emailstosend.length > 0){
                const emailSend=await sendNodeMail(3,`Just In: ${new_article[0].title}`,emailstosend,company_info,new_article[0],most_read,related_articles);
                if(emailSend){
                    res.status(200).json({status:'success'})
                }else{
                    res.status(404).json({status:'Error Occured'})
                }

            }else{
                res.status(200).json({status:'You have no email subscribers!!'})
            } 
            

            
        });

    }catch(err){
        res.status(404).json({status:err.message})
    } 


}