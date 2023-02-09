import Settings from "../../../db/Model/general_settingSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

        if(req.method==='GET'){
            try{
            let data=await Settings.find({});
            if(data.length>0){
                res.status(200).json({data:data,status:'success'})
            }else{
                res.status(200).json({data:data,status:'no data Found'})
            }
            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}