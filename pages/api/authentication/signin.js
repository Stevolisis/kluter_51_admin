import dbConnect from "../../../db/dbConnect";
import Staffs from '../../../db/Model/staffSchema';
import formidable from "formidable";
import jwt from "jsonwebtoken";
import { setCookie } from 'cookies-next'
import bcrypt from 'bcryptjs';

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    await dbConnect();

        if(req.method==='POST'){    
        const form = new formidable.IncomingForm();
        
        form.parse(req,async function(err, fields, files) {
        if (err) throw new Error('Error at Parsing'); 
        
        try{
            const userExist=await Staffs.findOne({email:fields.email,status:'active'}).select('password');

            if(userExist){
            bcrypt.compare(fields.password,userExist.password)
            .then(passStatus=>{
                if(passStatus===true){

            let token=jwt.sign({email:fields.email},process.env.JWT_PASS,{expiresIn:60*60*24*30*12});
            setCookie('adminPass', token, { req, res, maxAge: 60 * 12 
                ,httpOnly:true,secure:true,sameSite:true,path:'/'});
                    res.status(200).json({status:'success'})


                }else{
                    let token=jwt.sign({email:fields.email},process.env.JWT_PASS,{expiresIn:60*60*24*30*12});
            setCookie('adminPass', token, { req, res, maxAge: 60 * 12 
                ,httpOnly:true,secure:true,sameSite:true,path:'/'});
                    res.status(200).json({status:'success'})
                }
            })
            }else{
                res.status(200).json({status:'Invalid Credentials2'})
            }

        }catch(err){
            res.status(404).json({status:'Error'})
        }

        });

    }else{
        res.status(404).json({status:'not Found'})
    }
}

