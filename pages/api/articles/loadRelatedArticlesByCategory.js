import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";
import Likes from '../../../db/Model/likeSchema';
import Views from '../../../db/Model/viewSchema';
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){
        let {id}=req.query;
        let data;

            try{
            data=await Articles.find({category:id,status:'active'}).populate({ path: 'author',select:'full_name' }).limit(10).sort({_id:-1}).lean();
            
             
            if(data.length===0){
                data=await Articles.find({status:'active'}).populate({ path: 'author',select:'full_name' }).limit(10).sort({_id:-1}).lean()
            }
            for (let i = 0; i < data.length; i++) {
                data[i].likes=await Likes.count({pageId:data[i]._id});
                data[i].views=await Views.count({pageId:data[i]._id});
                data[i].description=data[i].content.slice(0,130)+'...';
            }
            
            res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }

}