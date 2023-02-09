import dbConnect from "../../../db/dbConnect";
import Comments from '../../../db/Model/commentSchema';
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){
        let {month}=req.query;
        let {year}=req.query;
        let data;

            try{
            data=await Comments.find({month:month,year:year}).select('day month year');
            
            res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }

}