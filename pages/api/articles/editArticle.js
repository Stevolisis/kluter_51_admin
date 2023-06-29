import Articles from "../../../db/Model/articleSchema";
import Categories from "../../../db/Model/categorySchema";
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";
import url_slugify from 'slugify';
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
      const verify=await verifyTokenPriveledge(req.cookies.adminPass,'editArticles')

      if(req.cookies.adminPass !== undefined && verify===true){
        const form = new formidable.IncomingForm();
        const validImagetype=['jpg','JPG','png','PNG','jpeg','JPEG','gif','GIF','webp','WEBP'];


        form.parse(req,async function(err, fields, files) {
          if (err) throw new Error('Error at Parsing');
          let cloudImg;
          let imgDelete;
          const id=fields.id;
          let stripSlug;
          let categorySlug;
          
          try{
          if(files.img_link.size!==0){
            imgDelete=await Articles.findOne({_id:id}).select('img');
            

            if(!validImagetype.includes(files.img_link.mimetype.split('/')[1],0)) {
              res.status(200).json({status:'Invalid Image Type'});
            return;
            }else if(files.img_link.size >=1048576 ) {
              res.status(200).json({status:'Image Size must be less than 1mb'});
              return;
             }

            cloudImg=await Cloudinary.uploader.upload(files.img_link.filepath);
                         
          }
            if(fields.category&&fields.title){
              let slug=fields.title;
              categorySlug=await Categories.findOne({_id:fields.category}).select('slug');
              stripSlug=url_slugify(slug.replace(/[^\w\s']|_/g,' ').replaceAll("'",' '));
            }


          let article=fields;
          {files.img_link.size===0 ? '' : article.img={public_id:cloudImg.public_id,url:cloudImg.url}}
          {fields.title&&fields.category ? article.slug=`/${stripSlug}` : ''}
          {fields.title&&fields.category ? article.categorySlug=`${categorySlug.slug}` : ''}
          
          await Articles.updateOne({_id:id},{$set:article});
          if(files.img_link.size!==0) await Cloudinary.uploader.destroy(imgDelete.img.public_id);
          res.status(200).json({status:'success'});

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