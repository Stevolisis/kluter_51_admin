import Views from "../../../db/Model/viewSchema";
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
    try{
    form.parse(req,async function(err, fields, files) {
        if (err) throw new Error('Error at Parsing');
        let date=new Date();
        console.log(fields);
        
        const like=new Views({
            page_link:fields.page_link,
            pageId:fields.pageId,
            day:date.getDate(),
            month:date.getMonth(),
            year:date.getFullYear()
        })

        await like.save()
        res.status(200).json({status:'success'})
        
              
    });

    }catch{
        res.status(404).json({status:'error'})
    }

    }else{
        res.status(404).json({status:'Not Found'})
    }
}