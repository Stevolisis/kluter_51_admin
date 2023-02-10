import Settings from "../../../db/Model/general_settingSchema";
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";
import { verifyTokenPriveledge } from "../../../serviceFunctions/verifyToken";
import cloudinary from '../../../serviceFunctions/cloudinary';

export const config = {
    api: {
      bodyParser: false,
    },
}

export default async function handler(req,res){
    await dbConnect();
    const validImagetype=['jpg','JPG','png','PNG','jpeg','JPEG','gif','GIF','webp','WEBP'];

    if(req.method==='POST'){
      const verify=await verifyTokenPriveledge(req.cookies.adminPass,'editGeneral_settingSystem')
      if(req.cookies.adminPass !== undefined && verify===true){

        const form = new formidable.IncomingForm();

        form.parse(req,async function(err, fields, files) {
          if (err) throw new Error('Error at Parsing');

          try{
          let setting=fields;
          const settingExist=await Settings.findOne({});
          if(setting.phone_number) setting.phone_number=JSON.parse(setting.phone_number);
          if(setting.gmail) setting.gmail=JSON.parse(setting.gmail);
          if(setting.whatsapp) setting.whatsapp=JSON.parse(setting.whatsapp);
          if(setting.linkedin) setting.linkedin=JSON.parse(setting.linkedin);
          if(setting.facebook) setting.facebook=JSON.parse(setting.facebook);
          if(setting.google_chat) setting.google_chat=JSON.parse(setting.google_chat);


          if(settingExist){


            let cloudImg;
            let cloudImg2;

            if(files.logo&&files.logo.size!==0){
              if(!validImagetype.includes(files.logo.mimetype.split('/')[1],0)) {
                res.status(200).json({status:'Invalid Image Type'});
                return;
               }else if(files.logo.size >=1048576) {
                res.status(200).json({status:'Image Size must be less than 1mb'});
                return;
               }else{
                cloudImg=await cloudinary.uploader.upload(files.logo.filepath); 
                setting.logo={public_id:cloudImg.public_id,url:cloudImg.secure_url}
                if(settingExist.logo&&settingExist.logo.public_id!=='')cloudinary.uploader.destroy(settingExist.logo.public_id)
               }
             }  
             
             if(files.front_cover_image&&files.front_cover_image.size!==0){
              if(!validImagetype.includes(files.front_cover_image.mimetype.split('/')[1],0)) {
                res.status(200).json({status:'Invalid Image Type'});
                return;
               }else if(files.front_cover_image.size >=1048576) {
                res.status(200).json({status:'Image Size must be less than 1mb'});
                return;
               }else{
                cloudImg2=await cloudinary.uploader.upload(files.front_cover_image.filepath); 
                setting.front_cover_image={public_id:cloudImg2.public_id,url:cloudImg2.secure_url}
                if(settingExist.front_cover_image&&settingExist.front_cover_image.public_id!=='')cloudinary.uploader.destroy(settingExist.front_cover_image.public_id)
               }
             }  

            await Settings.updateMany({},{$set:setting});

            res.status(200).json({status:'success'});



          }else{
            let cloudImg={public_id:'',secure_url:''};
            let cloudImg2={public_id:'',secure_url:''};

            if(files.logo&&files.logo.size!==0){
              if(!validImagetype.includes(files.logo.mimetype.split('/')[1],0)) {
                res.status(200).json({status:'Invalid Image Type'});
                return;
               }else if(files.logo.size >=1048576 ) {
                res.status(200).json({status:'Image Size must be less than 1mb'});
                return;
               }else{
                cloudImg=await cloudinary.uploader.upload(files.logo.filepath); 
               }
             }     

             
            if(files.front_cover_image&&files.front_cover_image.size!==0){
              if(!validImagetype.includes(files.front_cover_image.mimetype.split('/')[1],0)) {
                res.status(200).json({status:'Invalid Image Type'});
                return;
               }else if(files.front_cover_image.size >=1048576 ) {
                res.status(200).json({status:'Image Size must be less than 1mb'});
                return;
               }else{
                cloudImg2=await cloudinary.uploader.upload(files.front_cover_image.filepath); 
               }
             }     

            const settingsave=new Settings({
              name:setting.name,
              description:setting.description,
              logo:{public_id:cloudImg.public_id,url:cloudImg.secure_url},
              front_cover_image:{public_id:cloudImg2.public_id,url:cloudImg2.secure_url},
              phone_number:{status:setting.phone_number.status,link:setting.phone_number.link},
              gmail:{status:setting.gmail.status,link:setting.gmail.link},
              linkedin:{status:setting.linkedin.status,link:setting.linkedin.link},
              whatsapp:{status:setting.whatsapp.status,link:setting.whatsapp.link},
              facebook:{status:setting.facebook.status,link:setting.facebook.link},
              google_chat:{status:setting.google_chat.status,link:setting.google_chat.link}
            })
            await settingsave.save();
            res.status(200).json({status:'success'});
          }

          }catch(err){
          res.status(404).json({status:err.message})
          }

        });

      }else if(verify==='not Permitted'){
        res.status(200).json({status:'success'})
      }else{
        res.status(200).json({status:'success'})
      }

          }else{
              res.status(404).json({status:'error'})
          }




}