import mongoose from 'mongoose';

const subscribeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    status:Boolean,
    day:{
        type:String,
        required:true,
        immutable:true
    },
    month:{
        type:String,
        required:true,
        immutable:true
    },
    year:{
        type:String,
        required:true,
        immutable:true
    },
    created_at:{
        type:Date,
        default:()=>Date.now(),
        required:true,
        immutable:true
    }
})


//---------------------------------------------------
module.exports=mongoose.models.subscribers || mongoose.model('subscribers',subscribeSchema);


