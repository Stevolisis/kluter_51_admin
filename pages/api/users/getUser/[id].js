import Users from "../../../../db/Model/userSchema";
import dbConnect from "../../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='GET'){
    const {id}=req.query; 

            try{
            let data=await Users.find({_id:id}).select('full_name email status');
               
                res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}