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

    if(req.method==='POST'){
        try{
            let most_read_fetch=await Articles.find({status:'active'}).populate({ path: 'category',select:'name' }).limit(6).lean();
                
            for (let i = 0; i < most_read_fetch.length; i++) {
                most_read_fetch[i].views=await Views.count({pageId:most_read_fetch[i]._id});
                most_read_fetch[i].description=most_read_fetch[i].content.slice(0,130)+'...';
            }
            
            let most_read=most_read_fetch.sort((a,b)=>a.views < b.views ? 1:-1);
            const new_article=await Articles.find({status:'active'}).limit(1).sort({_id:-1}).lean();
            const company_info=await Settings.findOne({});


            form.parse(req,async function(err,fields) {
                if (err) throw new Error('Error at Parsing');
                if(fields.email===""||fields.email===null||fields.email===undefined) res.status(200).json({status:'Email Required'}); 

                const findSubscriber=await emailSubscribe.findOne({email:fields.email});
                let date=new Date();

                if(findSubscriber){
                    res.status(200).json({status:'Subscriber already exist'})
                }else{

                    const recipients=fields.email;
                    const emailSent=await sendNodeMail(1,'TechREVEAL NewsLetter',recipients);
                    const emailSent2=await sendNodeMail(2,`Discover: ${new_article[0].title}`,recipients,company_info,most_read,new_article[0]);



                    const subscribe=new emailSubscribe({
                        email:fields.email,
                        status:true,
                        day:date.getDate(),
                        month:date.getMonth()+1,
                        year:date.getFullYear()
                    });
                
                    await Promise.all([subscribe.save(),emailSent,emailSent2])
                    .then(response=>{
                        if(response){
                            res.status(200).json({status:'success'})
                        }else{
                            res.status(404).json({status:'Error Occured'})
                        }
                    })

                }

                

            });
        }catch(err){
            res.status(404).json({status:err.message})
        }  

    }else{
        res.status(404).json({status:'error'})
    }

}
