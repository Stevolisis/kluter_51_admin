import jwt from "jsonwebtoken";
import Staffs from '../db/Model/staffSchema';

async function verifyTokenPriveledge(cookie,priveledgeKey){

  try{
      const verify=jwt.verify(cookie,process.env.JWT_PASS);
      const staff=await Staffs.findOne({email:verify.email,status:'active'}).select('full_name email priveldges');
     return true;

      // if(staff&&staff.full_name==='Admin'){

      //   if(priveledgeKey==='logout'){
      //     return true;
      //   }if(priveledgeKey==='editStaffs'){
      //     return {status:true,user:staff.full_name}
      //   }
      //   const obj=staff.priveldges.find(j=>j.value===priveledgeKey);

      //   if(obj){
      //     return true;
      //   }else{
      //     return 'not Permitted'
      //   }
  
      //   }else{

      //     if(staff&&priveledgeKey==='editStaffs'&&verify.email===staff.email&&staff.full_name!=='admin'){
      //       return {status:true,user:staff._id}
      //     }else if(staff&&priveledgeKey==='deleteStaffs'&&verify.email===staff.email&&staff.full_name!=='admin'){
      //       return 'not Permitted'
      //     }else if(staff&&priveledgeKey==='logout'){
      //       return true;
      //     }else if(staff){
    
      //     const obj=staff.priveldges.find(j=>j.value===priveledgeKey);
    
      //     if(obj){
      //       return true;
      //     }else{
      //       return 'not Permitted'
      //     }
    
      //     }else{
      //         return 'not Permitted';
      //     }  
    

      //   } 

        
  }catch(err){
      return false
  }
  

}

export  {verifyTokenPriveledge};