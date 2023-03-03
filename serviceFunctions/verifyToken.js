import jwt from "jsonwebtoken";
import Staffs from '../db/Model/staffSchema';

async function verifyTokenPriveledge(cookie, privilegeKey) {
  try {
    const verify = jwt.verify(cookie, process.env.JWT_PASS);
    const staff = await Staffs.findOne({ _id: verify.id, status: 'active' }).select('full_name email priveldges admin');

    if (!staff) {
      return 'not Permitted';
    }

    switch (privilegeKey) {
      case 'logout':
        return true;
      case 'editStaffs':
        return staff.admin ? { status: true, user: staff.full_name, admin: staff.admin } : { status: true, user: staff._id };
      case 'deleteStaffs':
        return staff.admin ? true : 'not Permitted';
      default:
        const obj = staff.priveldges.find(j => j.value === privilegeKey);
        return obj ? true : 'not Permitted';
    }
  } catch (err) {
    return false;
  }
}

export { verifyTokenPriveledge };




































// import jwt from "jsonwebtoken";
// import Staffs from '../db/Model/staffSchema';



// async function verifyTokenPriveledge(cookie,priveledgeKey){

//   try{
//       const verify=jwt.verify(cookie,process.env.JWT_PASS);
//       const staff=await Staffs.findOne({_id: verify.id,status:'active'}).select('full_name email priveldges admin');
//       console.log('rt',staff)

//       if(staff&&staff.admin){

//         if(priveledgeKey==='logout'){
//           return true;
//         }if(priveledgeKey==='editStaffs'){
//           return {status:true,user:staff.full_name,admin:staff.admin}
//         }
//         const obj=staff.priveldges.find(j=>j.value===priveledgeKey);

//         if(obj){
//           return true;
//         }else{
//           return 'not Permitted'
//         }
  
//         }else{
//           if(staff&&priveledgeKey==='editStaffs'&&!staff.admin){
//             return {status:true,user:staff._id}
//           }else if(staff&&priveledgeKey==='deleteStaffs'&&!staff.admin){
//             return 'not Permitted'
//           }else if(staff&&priveledgeKey==='logout'){
//             return true;
//           }else if(staff){
    
//           const obj=staff.priveldges.find(j=>j.value===priveledgeKey);
    
//           if(obj){
//             return true;
//           }else{
//             return 'not Permitted'
//           }
    
//           }else{
//               return 'not Permitted';
//           }  
    

//         } 

        
//   }catch(err){
//       return false
//   }
  

// }

// export  {verifyTokenPriveledge};





