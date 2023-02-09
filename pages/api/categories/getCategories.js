import Categories from "../../../db/Model/categorySchema";
import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();
    const {limit}=req.query;
    const {section}=req.query;

        if(req.method==='GET'){
            let data;
            try{
            if(section==='admin'){
                data=await Categories.find({}).select('name slug description icon img status day month year').limit(limit).sort({_id:-1}).lean();
                for (let i = 0; i < data.length; i++) {
                    data[i].articles=await Articles.count({category:data[i]._id});
                }
            }else{
                data=await Categories.find({status:'active'}).select('name slug description icon img status').limit(limit).sort({_id:-1}).lean();
            }
  
            

            res.status(200).json({data:data,status:'success'})
            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}