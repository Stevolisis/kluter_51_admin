import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";



export default function Footer({whatsapp,linkedin,google_chat,gmail,phone_number,facebook}){
  const [email, setemail]=useState('');
  const [full_name, setfull_name]=useState('');

  
    function userAuth(){
      axios.get('/api/users/userAuth')
      .then(res=>{
          let data=res.data.data;
          let status=res.data.status;
          if(status==='success'){
            setfull_name(data.full_name);
            setemail(data.email);
        }else{
            return;
        }

      }).catch(err=>{
          return;
      })
    }

    useEffect(()=>{
      userAuth();
    },[]);







    return(
        <>
  <footer>
    <div className='footerCon'>
      <div className='footerLinksCon'>
        <h4>TechREVEAL Blog</h4>
        <p> For tech enthusiasts and industry leaders alike, TechReveal offers in-depth analysis and revelations, providing a window into the ever-evolving world of technology.</p>
           <ul>
           {facebook && facebook.status==='inactive' ? '' :<li><a href={facebook.link}><i className='fa fa-facebook'></i></a></li>}
           {phone_number && phone_number.status==='inactive' ? '' :<li><a href={phone_number.link}><i className='fa fa-phone'></i></a></li>}
           {linkedin && linkedin.status==='inactive' ? '' :<li><a href={linkedin.link}><i className='fa fa-linkedin'></i></a></li>}
           {whatsapp && whatsapp.status==='inactive' ? '' :<li><a href={whatsapp.link}><i className='fa fa-whatsapp'></i></a></li>}
           {google_chat && google_chat.status==='inactive' ? '' :<li><a href={google_chat.link}><i className='fa fa-google'></i></a></li>}
           {gmail && gmail.status==='inactive' ? '' :<li><a href={gmail.link}><i className='fa fa-envelope'></i></a></li>}
           </ul>
      </div>

      <div className='footerLinksCon'>
        <h4>Additional Pages</h4>
        <ol>
          <li><Link href='/about-us'>About Us</Link></li>
          <li><Link href='#'>Quick Support</Link></li>
          <li><Link href='/privacy-policy'>Privacy Policy</Link></li>
        </ol>
      </div>

      <div className='footerLinksCon'>
        <h4>Useful Links</h4>
        <ol>
          <li><Link href='#'>Page Privacy</Link></li>
          <li><Link href='#'>Lincences and Registration</Link></li>
        </ol>
      </div>
      
      <div className='footerLinksCon'>
        <h4>Contact Us</h4>
        <form>
          <input type='text' placeholder='Full Name' value={full_name} onChange={(e)=>setfull_name(e.target.value)}/>
          <input type='email' placeholder='E-Mail Address' value={email} onChange={(e)=>setemail(e.target.value)}/>
          <textarea placeholder='Your Message'></textarea>
          <button disabled>SEND MESSAGE</button>
        </form>
      </div>
    </div>
  </footer>
  <div className='footerCon2'><p>Copyright © 2023 TechREVEAL</p></div>
        </>
    )
}
