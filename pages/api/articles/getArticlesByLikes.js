import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";
import Likes from '../../../db/Model/likeSchema';
import Views from '../../../db/Model/viewSchema';
  
export default async function handler(req,res){
    await dbConnect();
    const {limit}=req.query;

    if(req.method==='GET'){

        try{
            let data=await Articles.find({status:'active'}).populate({ path: 'author',select:'full_name' }).limit(limit).lean();
        
        for (let i = 0; i < data.length; i++) {
            data[i].likes=await Likes.count({pageId:data[i]._id});
            data[i].views=await Views.count({pageId:data[i]._id});
            data[i].description=data[i].content.slice(0,130)+'...';
        }
            
            let response=data.sort((a,b)=>a.likes < b.likes ? 1:-1)
            res.status(200).json({data:response,status:'success'});

        }catch(err){
            res.status(404).json({status:err.message})
        }

    }else{
        res.status(404).json({status:'error'})
    }

}