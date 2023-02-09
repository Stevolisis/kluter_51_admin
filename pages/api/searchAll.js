import Articles from "../../db/Model/articleSchema";
import Categories from "../../db/Model/categorySchema";
import dbConnect from "../../db/dbConnect";


export default async function handler(req,res){
    await dbConnect();
    let {key}=req.query;

    if(req.method==='GET'){
        try{
            if(key!==''){
                const data1=await Articles.find({title:{$regex:key,$options:'i'},status:'active'}).populate({ path: 'category',select:'name' }).select('title categorySlug slug category');
                const data2=await Categories.find({name:{$regex:key,$options:'i'},status:'active'}).select('name slug');
            
               res.status(200).json({status:'success',data:data1.concat(data2[0])}); 
            }else{
                res.status(200).json({status:'not found'});
            }
            

        }catch(err){
            res.status(404).json({status:err.message})
        }
    }
}