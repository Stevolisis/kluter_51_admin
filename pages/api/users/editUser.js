import Users from "../../../db/Model/userSchema";
import Comments from "../../../db/Model/commentSchema";
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
        const verify=await verifyTokenPriveledge(req.cookies.adminPass,'editUsers')
        if(req.cookies.adminPass !== undefined && verify===true){
            
        const form = new formidable.IncomingForm();
        const validImagetype=['jpg','JPG','png','PNG','jpeg','JPEG','gif','GIF'];

        form.parse(req,async function(err, fields, files) {
            if (err) throw new Error('Error at Parsing');

            try{
                let id=fields.id;

                await Promise.all([Users.updateOne({_id:id},{$set:fields})])
                .then(res.status(200).json({status:'success'}))

            }catch(err){
            res.status(404).json({status:err.message})
          }
        })

    }else if(verify==='not Permitted'){
        res.status(200).json({status:'not Permitted'})
    }else{
      res.status(200).json({status:'Invalid User'})
    }

    }else{
        res.status(404).json({status:'error'})
    }

}