import emailSubscribe from "../../../db/Model/subscribersSchema";
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";
import { verifyTokenPriveledge } from "../../../serviceFunctions/verifyToken";

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function handler(req,res){
    await dbConnect();



    if(req.method==='POST'){
      try{
      const verify=await verifyTokenPriveledge(req.cookies.adminPass,'sendMail')

      if(req.cookies.adminPass !== undefined && verify===true){

        const form = new formidable.IncomingForm();  

        form.parse(req,async function(err, fields, files) {
          if (err) throw new Error('Error at Parsing');
          console.log(fields)
          const toSend=[];
          const recipients=JSON.parse(fields.recepients).map(item=>toSend.push(item.id));
            
            const sendMessage=await sendNodeMail(4,toSend,fields.subject,fields.message);
            if(sendMessage){
                res.status(200).json({status:'success'})
            }else{
                res.status(404).json({status:'Error Occured'})
            }

        });



      }else if(verify==='not Permitted'){
        res.status(200).json({status:'not Permitted'})
      }else{
        res.status(200).json({status:'Invalid User'})
      }

      }catch(err){
        res.status(404).json({status:err.message})
      }


      }else{
          res.status(404).json({status:'error'})
      }




}