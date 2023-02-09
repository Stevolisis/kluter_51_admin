import Articles from "../../../../db/Model/articleSchema";
import dbConnect from "../../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='GET'){
    const {id}=req.query; 

            try{
            let data=await Articles.find({_id:id});
               
                res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}