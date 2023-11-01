import dbConnect from "../../../db/dbConnect";
import Users from '../../../db/Model/userSchema';
import formidable from "formidable";
const jwt=require("jsonwebtoken");
import { getCookie, setCookie, hasCookie } from 'cookies-next'

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    await dbConnect();

        if(req.method==='GET'){    

            if(hasCookie('userAuth',{ req, res })){
                let token=getCookie('userAuth', { req, res });
                const verify=jwt.verify(token,process.env.JWT_PASS);
                let data=await Users.findOne({email:verify.email}).select('full_name email');
                res.status(200).json({status:'success',data:data});
            }else{
                res.status(200).json({status:'Cookie not found'})
            }

    }

}