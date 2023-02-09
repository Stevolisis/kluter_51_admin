import dbConnect from "../../../db/dbConnect";
import Views from '../../../db/Model/viewSchema';
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){
        let {month}=req.query;
        let {year}=req.query;
        let data;

            try{
            data=await Views.find({month:month,year:year}).select('-pageId -page_link');
            
             
            // if(data.length===0){
            //     data=await Articles.find({status:'active'}).populate({ path: 'author',select:'full_name' }).limit(10).sort({_id:-1}).lean()
            // }
            
            // console.log('done')
            res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            console.log(err.message)
            }

          }else{
              res.status(404).json({status:'error'})
          }

}