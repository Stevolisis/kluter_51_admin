import dbConnect from "@/db/dbConnect";
import emailSubscribe from "@/db/Model/subscribersSchema";
  
export default async function handler(req,res){
    await dbConnect();


    if(req.method==='GET'){
        let {month}=req.query;
        let {year}=req.query;

            try{
                console.log('substat',month,year)
            const data=await emailSubscribe.find({month:month,year:year}).select('day month year');
            console.log('substat2',data)
            
            res.status(200).json({data:data,status:'success'});

            }catch(err){
            res.status(404).json({status:err.message})
            }

          }else{
              res.status(404).json({status:'error'})
          }

}