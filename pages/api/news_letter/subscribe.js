import { sendEmail } from "@/serviceFunctions/sendGrid";
import formidable from "formidable";
import Articles from "../../../db/Model/articleSchema";
import Users from "../../../db/Model/userSchema";
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
        let most_read=await Articles.findOne({status:'active'}).populate([{ path: 'author',select:'full_name'},{ path: 'category',select:'name'}]);
        const new_article=await Articles.find({}).populate({ path: 'author',select:'full_name' }).limit(1).sort({_id:-1}).lean();
        const company_info=await Settings.findOne({});
        const users=await Users.find({}).lean();
        let subscribers=[];

        if(users){
            users.map(user=>{
                subscribers.push(user.email);
            })
        }

        form.parse(req,async function(err,fields) {
            if (err) throw new Error('Error at Parsing');
            if(fields.email===""||fields.email===null||fields.email===undefined) res.status(200).json({status:'Email Required'}); 

            const findSubscriber=await emailSubscribe.findOne({email:fields.email});
            let date=new Date();

            if(findSubscriber){
                res.status(200).json({status:'Subscriber already exist'})
            }else{

                const recipients=fields.email;
                const emailSent=sendNodeMail(1,'TechREVEAL NewsLetter',recipients);
                const emailSent2=sendNodeMail(2,`Just In: ${new_article[0].title}`,recipients,company_info,most_read,new_article[0]);


                // console.log('emailSentNodemailer',emailSent);

                const subscribe=new emailSubscribe({
                    email:fields.email,
                    status:true,
                    day:date.getDate(),
                    month:date.getMonth()+1,
                    year:date.getFullYear()
                });
    
                // const newSubscribe=subscribe.save();
    
                await Promise.all([emailSent,emailSent2])
                .then(response=>{
                    console.log('check response',response)
                    if(response){
                    // console.log('txts',Test('admin2@gmail.com','EMAILPASS'))
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
}
