import { useState,useEffect } from "react"
import Swal from 'sweetalert2';
import Link from 'next/link';
import axios from "axios";
import { baseUrl } from "../../../components/BaseUrl";
import { useLoader } from "../../_app";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { ThreeDots } from "react-loader-spinner";
const SunEditors = dynamic(() =>
import("@/components/SunEditor"), { ssr: false ,loading: () => 
<div style={{width:'100%',height:'600px',background:'#f5f6f6',display:'flex',justifyContent:'center',alignItems:'center'}}>
<ThreeDots
height="40" 
width="40" 
radius="9"
color="#177C65" 
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClassName=""
visible={true}
/></div>
});



export const getServerSideProps=async (context)=>{
    let error=context.query;
    try{
      const res=await axios.get(`${baseUrl}/api/general_settings/getGeneral_settings`);
      
      const data= res.data.data||[];
      let resStatus=res.data.status;
      let editName,editDescription,editLogo,editFront_cover_image,editPhone_number,editGmail,editLinkedin,editWhatsapp,editFacebook,editGoogle_chat,editAbout_us,editPrivacy_policy; 
       
     if(resStatus==='no data Found'){
       editName='';
       editDescription='';
       editLogo='';
       editFront_cover_image='';
       editPhone_number={status:'active',link:''};
       editGmail={status:'active',link:''};
       editLinkedin={status:'active',link:''};      
       editWhatsapp={status:'active',link:''};      
       editFacebook={status:'active',link:''};      
       editGoogle_chat={status:'active',link:''};       
     }else{
       editName=data[0].name;
       editDescription=data[0].description;
       editLogo=data[0].logo&&data[0].logo.url||'';
       editFront_cover_image=data[0].front_cover_image&&data[0].front_cover_image.url||'';
       editPhone_number=data[0].phone_number;
       editGmail=data[0].gmail;
       editLinkedin=data[0].linkedin;
       editWhatsapp=data[0].whatsapp;
       editFacebook=data[0].facebook;
       editGoogle_chat=data[0].google_chat; 
       editAbout_us=data[0].about_us||'';   
       editPrivacy_policy=data[0].privacy_policy||'';  
     }
      
      return {
        props:{editName,editDescription,editLogo,editFront_cover_image,editPhone_number,editGmail,editWhatsapp
            ,editLinkedin,editFacebook,editGoogle_chat,editAbout_us,editPrivacy_policy}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
  }


export default function AddSupportSystem({error,editName,editDescription,editLogo,editFront_cover_image,editPhone_number,editGmail,editLinkedin,
    editWhatsapp,editFacebook,editGoogle_chat,editAbout_us,editPrivacy_policy}){
    const [name,setName]=useState('');
    const [description,setDescription]=useState('');
    const [phone_number,setphone_number]=useState({status:'inactive',link:''})
    const [gmail,setgmail]=useState({status:'active',link:''})
    const [linkedin,setlinkedin]=useState({status:'active',link:''})
    const [whatsapp,setwhatsapp]=useState({status:'active',link:''})
    const [facebook,setfacebook]=useState({status:'active',link:''})
    const [google_chat,setgoogle_chat]=useState({status:'active',link:''});
    const [imgpreview,setImgpreview]=useState('');
    const [imgpreview2,setImgpreview2]=useState('');
    const [content, setContent] = useState('');
    const [content2, setContent2] = useState('');
    const {loading,setloading}=useLoader()
    const router=useRouter();

    if(error){
        Swal.fire(
          'Error Occured',
          error,
          'error'
        )
  }



function handleSubmit(e){
    e.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: "Confirm Action On Support",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Edit it!'
      }).then((result) => {
        if (result.isConfirmed) {
        setloading(true)
    const formData=new FormData(e.target);
    formData.append('phone_number',JSON.stringify(phone_number));
    formData.append('gmail',JSON.stringify(gmail));
    formData.append('linkedin',JSON.stringify(linkedin));
    formData.append('whatsapp',JSON.stringify(whatsapp));
    formData.append('facebook',JSON.stringify(facebook));
    formData.append('google_chat',JSON.stringify(google_chat));
    formData.append('about_us',JSON.stringify(content));
    formData.append('privacy_policy',JSON.stringify(content2));

    axios.post('/api/general_settings/editGeneral_settings/',formData)
    .then(res=>{
        let status=res.data.status;
        setloading(false)
        if(status==='success'){
            Swal.fire(
                'Successful!',
                'Support System Edited',
                'success'
            )
        }else if(status==='Invalid User'){
               
            router.push(`/login?next=${router.asPath}`)
        }else{
            Swal.fire(
                'Error Occured',
                status,
                'warning'
            )  
        }
    }).catch(err=>{
        setloading(false)
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        )  
    })
}else{
    setloading(false);
    return;
}
})
}


useEffect(()=>{
    setName(editName);
    setDescription(editDescription);
    setImgpreview(editLogo);
    setImgpreview2(editFront_cover_image);
    setphone_number(editPhone_number);
    setwhatsapp(editWhatsapp);
    setgmail(editGmail);
    setlinkedin(editLinkedin);
    setfacebook(editFacebook);
    setgoogle_chat(editGoogle_chat);
    setContent(editAbout_us);
    setContent2(editPrivacy_policy);
},[]);


        function imgPreview(e){
            setImgpreview(URL.createObjectURL(e.target.files[0]));
        }

        function imgPreview2(e){
            setImgpreview2(URL.createObjectURL(e.target.files[0]));
        }




    return(
        <>
        <div className='mainHeading'>
            <p>General Settings</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Blog Name</p>
            <input type='text' name='name'  value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
        </div>
        

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Description</p>
            <textarea type='text' name='description'  maxLength='250' value={description} onChange={(e)=>setDescription(e.target.value)}/><p>description should not be more than 150 words</p>
        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Logo(Image)</p>

            <div className='previewimg'>
            <img src={imgpreview}/>
            </div>

            <input type='file' name='logo' onChange={imgPreview} />

        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Front Cover Image</p>

            <div className='previewimg'>
            <img src={imgpreview2}/>
            </div>

            <input type='file' name='front_cover_image'  onChange={imgPreview2} />

        </div>
        </div>

        <div className="adminSupportLink">
                <div><Link href={phone_number&&phone_number.link} legacyBehavior><a><i className="fa fa-phone"/></a></Link></div>
                <div><Link href={gmail&&gmail.link} legacyBehavior><a><i className="fa fa-envelope"/></a></Link></div>
                <div><Link href={linkedin&&linkedin.link} legacyBehavior><a><i className="fa fa-linkedin"/></a></Link></div>
                <div><Link href={whatsapp&&whatsapp.link} legacyBehavior><a><i className="fa fa-whatsapp"/></a></Link></div>
                <div><Link href={facebook&&facebook.link} legacyBehavior><a><i className="fa fa-facebook"/></a></Link></div>
                <div><Link href={google_chat&&google_chat.link} legacyBehavior><a><i className="fa fa-google"/></a></Link></div>
        </div>


        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={phone_number&&phone_number.status} onChange={(e)=>setphone_number({...phone_number,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Phone Number</p>
            <input type='text' value={phone_number&&phone_number.link} onChange={(e)=>setphone_number({...phone_number,['link']:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={gmail&&gmail.status} onChange={(e)=>setgmail({...gmail,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Gmail Link</p>
            <input type='text' value={gmail&&gmail.link} onChange={(e)=>setgmail({...gmail,['link']:e.target.value})}/>
        </div>
        </div>
        </div>


        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={linkedin&&linkedin.status} onChange={(e)=>setlinkedin({...linkedin,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>LinkedIn Link</p>
            <input type='text' value={linkedin&&linkedin.link} onChange={(e)=>setlinkedin({...linkedin,['link']:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={whatsapp&&whatsapp.status} onChange={(e)=>setwhatsapp({...whatsapp,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Whatsapp Link</p>
            <input type='text' value={whatsapp&&whatsapp.link} onChange={(e)=>setwhatsapp({...whatsapp,['link']:e.target.value})}/>
        </div>
        </div>
        </div>


        
        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={facebook&&facebook.status} onChange={(e)=>setfacebook({...facebook,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Facebook Link</p>
            <input type='text' value={facebook&&facebook.link} onChange={(e)=>setfacebook({...facebook,['link']:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={google_chat&&google_chat.status} onChange={(e)=>setgoogle_chat({...google_chat,['status']:e.target.value})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deativate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Google Chat Link</p>
            <input type='text' value={google_chat&&google_chat.link} onChange={(e)=>setgoogle_chat({...google_chat,['link']:e.target.value})}/>
        </div>
        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>About Us</p>
                <SunEditors content={content} setContent={setContent}/>
            </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Privacy Policy</p>
                <SunEditors content={content2} setContent={setContent2}/>
            </div>
        </div>

        <div className='admineditbtn'>
        <button >EDIT</button>
        </div>
        </div>
        </form>  
        </>
    )
}










































