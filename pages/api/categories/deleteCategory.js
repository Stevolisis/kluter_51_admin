import Categories from "../../../db/Model/categorySchema";
import Articles from '../../../db/Model/articleSchema';
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";
import Cloudinary from '../../../serviceFunctions/cloudinary';
import { verifyTokenPriveledge } from "../../../serviceFunctions/verifyToken";

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function handler(req,res){
    await dbConnect();



    if(req.method==='POST'){
      const verify=await verifyTokenPriveledge(req.cookies.adminPass,'deleteCategories')
      if(req.cookies.adminPass !== undefined && verify===true){
        
        const form = new formidable.IncomingForm();
        
        
        form.parse(req,async function(err, fields, files) {
          if (err) throw new Error('Error at Parsing');

            try{
              let imgDelete=await Categories.findOne({_id:fields.id}).select('img');

              await Promise.all([
                Articles.updateMany({category:fields.id},{$set:{status:'inactive'}}),
                Categories.deleteOne({_id:fields.id}),
                Cloudinary.uploader.destroy(imgDelete.img.public_id)
              ]).then(res.status(200).json({status:'success'}));

            }catch(err){
            res.status(404).json({status:err.message})
            }

        });

      }else if(verify==='not Permitted'){
        res.status(200).json({status:'not Permitted'})
      }else{
        res.status(200).json({status:'Invalid User'})
      }

          }else{
              res.status(404).json({status:'error'})
          }




}