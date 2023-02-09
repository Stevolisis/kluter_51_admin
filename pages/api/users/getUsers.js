import Users from "../../../db/Model/userSchema";
import Comments from "../../../db/Model/commentSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();
    const {limit}=req.query;

        if(req.method==='GET'){
            try{
            let data=await Users.find({}).select('full_name email day month year').limit(limit).sort({_id:-1}).lean();

            for (let i = 0; i < data.length; i++) {
                data[i].comments=await Comments.count({user:data[i]._id});
            }
            res.status(200).json({data:data,status:'success'})
            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}