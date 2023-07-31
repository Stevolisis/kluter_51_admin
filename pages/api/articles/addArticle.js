import Articles from "../../../db/Model/articleSchema";
import Categories from "../../../db/Model/categorySchema";
import dbConnect from "../../../db/dbConnect";
import emailSubscribe from "../../../db/Model/subscribersSchema";
import Settings from "../../../db/Model/general_settingSchema";
import formidable from "formidable";
const url_slugify=require('slugify');
import cloudinary from '../../../serviceFunctions/cloudinary';
import { verifyTokenPriveledge } from "../../../serviceFunctions/verifyToken";
import { sendEmail } from "@/serviceFunctions/sendGrid";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    await dbConnect();
    const validImagetype=['jpg','JPG','png','PNG','jpeg','JPEG','gif','GIF','webp','WEBP'];

        if(req.method==='POST'){
        const verify=await verifyTokenPriveledge(req.cookies.adminPass,'addArticles')

          try{
            const subscribers=await emailSubscribe.find({status:true});
            let most_read=await Articles.findOne({status:'active'}).populate([{ path: 'author',select:'full_name'},{ path: 'category',select:'name'}]);
            const company_info=await Settings.findOne({});

            if(req.cookies.adminPass !== undefined && verify===true){
              const form = new formidable.IncomingForm();
        
                form.parse(req,async function(err, fields, files) {
                  if (err) throw new Error('Error at Parsing');
    
                      if(files.img_link.size===0){
                        res.status(200).json({status:'No Img Link Why Bro?'})
                        return;
                      } else if(!validImagetype.includes(files.img_link.mimetype.split('/')[1],0)) {
                        res.status(200).json({status:'Invalid Image Type'});
                        return;
                      }else if(files.img_link.size >=1048576 ) {
                        res.status(200).json({status:'Image Size must be less than 1mb'});
                        return;
                      }
    
    
                      let date=new Date();
                      let slug=fields.title;
                      let categorySlug=await Categories.findOne({_id:fields.category}).select('slug');
                      let stripSlug=url_slugify(slug.replace(/[^\w\s']|_/g,' ').replaceAll("'",' '));
                      let cloudImg;
    
                      try{
                        cloudImg=await cloudinary.uploader.upload(files.img_link.filepath,{public_id:Date.now()+files.img_link.originalFilename.split('.')[0]})              
                        
                        // if(subscribers.length!==0){
                        //   subscribers.map(async user=>{
                        //     await sendEmail(2,`Just In: ${fields.title}`,user.email,company_info,most_read,fields)
                        //   })
                        // }

                        const article=new Articles({
                          title:fields.title,
                          slug:`/${stripSlug}`,
                          categorySlug:`${categorySlug.slug}`,
                          category:fields.category,
                          author:fields.author,
                          content:fields.content,
                          img:{public_id:cloudImg.public_id,url:cloudImg.secure_url},
                          status:fields.status,
                          day:date.getDate(),
                          month:date.getMonth()+1,
                          year:date.getFullYear()
                        })
    
                  
                        await article.save();
                          res.status(200).json({status:'success'})                
    
                        
                        }catch(err){
                          res.status(404).json({status:err.message})
                        }
    
    
                  });
    
                }else if(verify==='not Permitted'){
                  res.status(200).json({status:'not Permitted'})
                }else{
                  res.status(200).json({status:'Invalid User'})
                }


          }catch(err){
            res.status(404).json({status:err.message})
          }  

          }else{
              res.status(404).json({status:'error'})
          }

}