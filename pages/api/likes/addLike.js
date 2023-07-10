import Likes from "../../../db/Model/likeSchema";
import dbConnect from "../../../db/dbConnect";
import formidable from "formidable";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    await dbConnect();

    if(req.method==='POST'){
    const form = new formidable.IncomingForm();
    const date=new Date();
    
    try{
    form.parse(req,async function(err, fields, files) {
        if (err) throw new Error('Error at Parsing');
        let subDiv=fields.page_link.split('//')[1].split('/');
        
        const like=new Likes({
            page_link:fields.page_link,
            pageId:fields.pageId,
            day:date.getDate(),
            month:date.getMonth()+1,
            year:date.getFullYear()
        })

        await like.save().then(
            res.status(200).json({status:'success'})
        )
              
    });

    }catch{
        res.status(404).json({status:'error'})
    }

    }else{
        res.status(404).json({status:'Not Found'})
    }
}