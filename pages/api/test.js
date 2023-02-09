import dbConnect from "../../db/dbConnect";


export default async (req,res)=>{
await dbConnect()
.then(res.json({test:'test Db'}))
    
}