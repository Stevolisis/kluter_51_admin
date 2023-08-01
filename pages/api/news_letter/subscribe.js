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
                // const emailSent=sendEmail(1,[fields.email],'TechREVEAL NewsLetter','stevolisisjosephpur@gmail.com');
                // const emailSent2=sendEmail(2,[fields.email],`Just In: ${new_article[0].title}`,'stevolisisjosephpur@gmail.com',company_info,most_read,new_article[0]);
                const emailSent=sendNodeMail('Welcome to Techreveal',['stevolisisjoseph@gmail.com','stevolisisjosephpur@gmail.com'],'Try this Out');
                console.log('emailSentNodemailer',emailSent);

                const subscribe=new emailSubscribe({
                    email:fields.email,
                    status:true,
                    day:date.getDate(),
                    month:date.getMonth()+1,
                    year:date.getFullYear()
                });
    
                // const newSubscribe=subscribe.save();
    
                await Promise.all([emailSent])
                .then(response=>{
                    console.log('check response',response)
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
}
