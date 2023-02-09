import Comments from "../../../db/Model/commentSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

        if(req.method==='GET'){
            const {pageId} = req.query;
            try{
            let data=await Comments.find({pageId:pageId}).sort({_id:-1}).populate({ path: 'user',select:'full_name img_link' });

            res.status(200).json({data:data,status:'success'})
            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}