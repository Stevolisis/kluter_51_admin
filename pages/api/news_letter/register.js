import formidable from "formidable";

export const config = {
    api: {
      bodyParser: false,
    },
}
  
export default async function handler(req,res){
    const form = new formidable.IncomingForm();
    
    form.parse(req,async function(err, fields, files) {
        if (err) throw new Error('Error at Parsing');
        console.log('fields',fields);

        res.status(200).json({status:'success'})
    });
}
