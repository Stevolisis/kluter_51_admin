import Staffs from "../../../db/Model/staffSchema";
import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();
    const {limit}=req.query;

        if(req.method==='GET'){
            try{
                let data=await Staffs.find({}).select('full_name email position img day month year status').limit(limit).sort({_id:-1}).lean();
                for (let i = 0; i < data.length; i++) {
                    data[i].posts=await Articles.count({author:data[i]._id});
                }
                res.status(200).json({data:data,status:'success'})
            }catch(err){
                res.status(404).json({status:err.message})
            }

        }else{
            res.status(404).json({status:'error'})
        }

}