import Likes from "../../../db/Model/likeSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='GET'){

            try{
            let data=await Likes.count({});
            res.status(200).json({data:data,status:'success'});
            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }

}