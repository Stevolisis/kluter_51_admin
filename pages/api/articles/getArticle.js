import Articles from "../../../db/Model/articleSchema";
import dbConnect from "../../../db/dbConnect";

  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='GET'){
    const {category,article}=req.query;
    let articleSlug=`/${article}`
    let categorySlug=`/${category}`
  



            try{
            let data=await Articles.findOne({slug:articleSlug,status:'active'}).populate({ path: 'author',select:'full_name description img whatsapp dribble github linkedin twitter instagram' }).lean();
                res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }




}