import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";
import Staffs from '../../../db/Model/staffSchema'

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    await dbConnect();
    

        if(req.method==='GET'){    
            const {cookie}=req.query;
            

            try{
            const verify=jwt.verify(cookie,process.env.JWT_PASS);
            let data=await Staffs.findOne({_id:verify.id}).select('email')
            console.log('Verified Token',data);
            if(verify===''){
              res.status(404).json({status:'valid'});
            }else{
              res.status(401).json({status:'valid'});
            }

    }catch(err){
        res.status(404).json({status:err.message})   
    }
}else{
    res.status(404).json({status:'Error not GET'}) 
}

}