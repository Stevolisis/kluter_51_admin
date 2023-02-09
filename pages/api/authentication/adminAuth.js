import dbConnect from "../../../db/dbConnect";
import jwt from "jsonwebtoken";

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
            // let data=await Staffs.findOne({email:verify.email}).select('email')
            // console.log('Verified Token',data);
            // if(verify===''){

            // }else{

            // }
            res.status(200).json({status:'valid'});

    }catch(err){
        res.status(404).json({status:err.message})   
    }
}else{
    res.status(404).json({status:'Error not GET'}) 
}

}