import dbConnect from "../../../db/dbConnect";
import Likes from '../../../db/Model/likeSchema';
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){
        let {month}=req.query;
        let {year}=req.query;
        let data;

        try{
            data=await Likes.find({month:month,year:year}).select('-pageId -page_link');
            
            res.status(200).json({data:data,status:'success'});

        }catch(err){
            res.status(404).json({status:err.message})
        }

    }else{
        res.status(404).json({status:'error'})
    }

}