import formidable from "formidable";
import emailSubscribe from "../../../db/Model/subscribersSchema";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();

    if(req.method==='GET'){
        const {limit} = req.query;

        try{
            form.parse(req,async function(err,fields) {
                if (err) throw new Error('Error at Parsing');

                const data=await emailSubscribe.find({status:true}).sort({_id:-1}).limit(limit);
                res.status(200).json({status:'success',data:data})

            })

        }catch(err){
            res.status(404).json({status:err.message})
        }
    }else{
        res.status(404).json({status:'error'})
    }

}