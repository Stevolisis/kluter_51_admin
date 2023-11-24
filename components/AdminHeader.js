import Navbar from "./Navbar";
import Link from "next/link";
import NavbarController from './NavbarController'
import { useState } from "react";
import { useLoader } from "../pages/_app";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Head from 'next/head';
import Image from 'next/image';

export default function AdminHeader({children}){
  const [navStatus,setnavStatus]=useState(false);
  const { logo, setloading } = useLoader();
  const router=useRouter();
  const next=router.asPath;

  function logout(){
  setloading(true);
  axios.post(`${baseUrl}/api/authentication/logout`,{route:'logout'})
  .then(res=>{

    let status=res.data.status;
    setloading(false);
    if(status==='success'){

      router.push('/login');

    }else if(status==='Invalid User'){
       
        router.push(`/login?next=${next}`)

    }else{
        Swal.fire(
            'Error!',
            status,
            'warning'
        )  
    }

  }).catch(err=>{
    setloading(false);
    Swal.fire(
        'Error Occured',
        err.message,
        'error'
    )
  })
  }


    return(
        <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />
      </Head>

      <header>
      <div className="logoCon" onClick={()=>router.push('/')}>
        {logo&&<Image
          src={logo}
          width={140}
          height={25}
          blurDataURL="/logo.io"
          alt={logo}
          priority
          />}
        </div>
      <div className="linksCon">
      <Link href='/'>Home</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/about.html'>About Us</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/#service'>Our Services</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/contact.html'>Contact</Link>
      </div>
      <div className="buttonCon">
            <NavbarController navStatus={navStatus} setnavStatus={setnavStatus}/>
      </div>

      </header>




      <Navbar section='Admin' navStatus={navStatus} setnavStatus={setnavStatus} logout={logout}/>
      




      <div className='adminAllCon'>

<div className='navbar2'>
<div className="subNav3">
<div className='navusername'><i className='fa fa-user-circle'/><span>Admin Steven</span></div>
<div className='navlinks'><Link href='/admin' >Dashboard</Link></div>
<div className='navlinks'><Link href='/admin/categories' >Patients</Link></div>
{/* <div className='navlinks'><Link href='/admin/articles' >Reports</Link></div> */}
<div className='navlinks'><Link href='/admin/analytics' >Reports</Link></div>
<div className='navlinks'><Link href='/admin/comments' >Medications</Link></div>
<div className='navlinks'><Link href='/admin/users' >Resources</Link></div>
{/* <div className='navlinks'><Link href='/admin/staffs' >Staffs</Link></div>
<div className='navlinks'><Link href='/admin/email_support' >Email Support</Link></div> */}
<div className='navlinks'><Link href='/admin/general_settings' >Settings</Link></div>
<div className='adminmorebtn' style={{padding:'0'}}><button onClick={logout} style={{width:'100%',background:'transparent',color:'#177C65',fontFamily:'poppinsMedium',boxShadow:'none',textAlign:'left',fontSize:'15px',padding:'10px 0'}}>Logout</button></div>
</div>
</div>








<div className='mainBody'>
{children}
</div>




</div>
          </>
    )
}
