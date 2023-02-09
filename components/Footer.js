import Link from "next/link";

export default function Footer({whatsapp,linkedin,google_chat,gmail,phone_number,facebook}){


  
//   function loadSupport(){
//     axios.get('/api/supports/getSupport')
//     .then(res=>{
//         let data=res.data.data;
//         if(res.data.status==='success'){
//             setphone_number(data[0].phone_number)
//             setgmail(data[0].gmail)
//             setfacebook(data[0].facebook)
//             setwhatsapp(data[0].whatsapp)
//             setgoogle_chat(data[0].google_chat)
//             setlinkedin(data[0].linkedin)
//         }else if(res.data.status==='no data Found'){
//           setphone_number({status:'inactive'})
//           setgmail({status:'inactive'})
//           setwhatsapp({status:'inactive'})
//           setgoogle_chat({status:'inactive'})
//           setfacebook({status:'inactive'})
//           setlinkedin({status:'inactive'});
//         }else{
//             Swal.fire(
//                 'Error',
//                 res.data.status,
//                 'warning'
//             )
//         }
//     }).catch(err=>{
//         console.log(err)
//         Swal.fire(
//             'Error',
//             'Error Occured at Axios',
//             'warning'
//         )           
//     });
// }


//     useEffect(()=>{
//       loadSupport();
//     },[]);

    return(
        <>
  <footer>
    <div className='footerCon'>
      <div className='footerLinksCon'>
        <h4>OTOTECH Industries</h4>
        <p> For more enquires and service placement please feel free to
           contact us through the following Social media's.</p>
           <ul>
           {facebook && facebook.status==='inactive' ? '' :<li><Link href={facebook.link}><i className='fa fa-facebook'></i></Link></li>}
           {phone_number && phone_number.status==='inactive' ? '' :<li><Link href={phone_number.link}><i className='fa fa-phone'></i></Link></li>}
           {linkedin && linkedin.status==='inactive' ? '' :<li><Link href={linkedin.link}><i className='fa fa-linkedin'></i></Link></li>}
           {whatsapp && whatsapp.status==='inactive' ? '' :<li><Link href={whatsapp.link}><i className='fa fa-whatsapp'></i></Link></li>}
           {google_chat && google_chat.status==='inactive' ? '' :<li><Link href={google_chat.link}><i className='fa fa-google'></i></Link></li>}
           {gmail && gmail.status==='inactive' ? '' :<li><Link href={gmail.link}><i className='fa fa-envelope'></i></Link></li>}
           </ul>
      </div>

      <div className='footerLinksCon'>
        <h4>Additional Pages</h4>
        <ol>
        <li><Link href='#'>About Us</Link></li>
        <li><Link href='#'>How We Work</Link></li>
        <li><Link href='#'>Quick Support</Link></li>
        <li><Link href='#'>Privacy Policy</Link></li>
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
        <input type='text' placeholder='Full Name'/>
        <input type='email' placeholder='E-Mail Address'/>
        <textarea placeholder='Your Message'>

        </textarea>
        <button disabled>SEND MESSAGE</button>
        </form>
      </div>
    </div>
  </footer>
  <div className='footerCon2'><p>Copyright © 2022 OTOTECH Industries.</p></div>
        </>
    )
}
