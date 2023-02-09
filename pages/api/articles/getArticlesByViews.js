import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";
import Likes from '../../../db/Model/likeSchema';
import Views from '../../../db/Model/viewSchema';
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){

            try{
            let data=await Articles.find({status:'active'}).populate({ path: 'author',select:'full_name' }).limit(10).lean();
            
            for (let i = 0; i < data.length; i++) {
                // data[i].Views=Articles.getViews('3456789')   
                data[i].likes=await Likes.count({pageId:data[i]._id});
                data[i].views=await Views.count({pageId:data[i]._id});
                data[i].description=data[i].content.slice(0,130)+'...';
            }
            
            let response=data.sort((a,b)=>a.views < b.views ? 1:-1)
            res.status(200).json({data:response,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }

}