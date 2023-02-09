import Categories from "../../../../db/Model/categorySchema";
import dbConnect from "../../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='GET'){
    const {id}=req.query; 

            try{
            let data=await Categories.find({_id:id}).select('name description icon img status');
               
                res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}