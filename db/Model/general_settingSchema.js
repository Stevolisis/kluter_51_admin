import mongoose from 'mongoose';

const general_settingSchema=new mongoose.Schema({
  name:{
    type:String
  },
  description:{
    type:String,
  },
  logo:{
    public_id:{
      type:String,
    },
    url:{
      type:String,
    }
  },
  front_cover_image:{
    public_id:{
      type:String,
    },
    url:{
      type:String,
    }
  },
  phone_number:{
   status:{
    type:String,
    required:true
   },
   link:String
  },
  gmail:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  linkedin:{
  status:{
    type:String,
    required:true
  },
  link:String
  },
  whatsapp:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  facebook:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
  google_chat:{
    status:{
     type:String,
     required:true
    },
    link:String
   },
   about_us:String,
   privacy_policy:String
})


//---------------------------------------------------
module.exports=mongoose.models.settings || mongoose.model('settings',general_settingSchema);
