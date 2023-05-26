import '../styles/globals.css'
import Layout from './Layout'
import '../styles/home.scss'
import '../styles/article.scss'
import '../styles/adminStyles/admindashboard.scss'
import '../styles/adminStyles/adminDataDisplay.scss'
import '../styles/adminStyles/adminDataInput.scss'
import '../styles/adminStyles/adminSupport.scss'
import '../styles/adminStyles/adminComments.scss'
import '../styles/pageLoader.scss'
import 'font-awesome/css/font-awesome.min.css';
import AdminHeader from "../components/AdminHeader";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useRouter,Router} from 'next/router';
import PageLoader from '../components/PageLoader'
import { useEffect, useState, useContext, createContext } from 'react'
import GoogleAnalytics from '@bradgarropy/next-google-analytics'
import * as gtag from '../lib/google-analytics/index';
import Script from 'next/script';
import axios from 'axios'
import Swal from 'sweetalert2'
const LoaderContext = createContext()
export const useLoader = () => useContext(LoaderContext);






function MyApp({ Component, pageProps }) {
  const router=useRouter()
  const childrenName=router.pathname;
  const admin=childrenName.split('/')[1]; 
  const [loading,setloading]=useState(false);
  const [name,setname]=useState('');
  const [description,setdescription]=useState('')
  const [logo,setlogo]=useState('')
  const [front_cover_image,setfront_cover_image]=useState('')
  const [phone_number,setphone_number]=useState({status:'',link:''})
  const [gmail,setgmail]=useState({status:'',link:''})
  const [linkedin,setlinkedin]=useState({status:'',link:''})
  const [whatsapp,setwhatsapp]=useState({status:'',link:''})
  const [facebook,setfacebook]=useState({status:'',link:''})
  const [google_chat,setgoogle_chat]=useState({status:'',link:''});


    
  function loadSupport(){
    axios.get('/api/general_settings/getGeneral_settings')
    .then(res=>{
      let status=res.data.status;
      let data=res.data.data;
        if(status==='success'){
          setname(data[0].name)
          setdescription(data[0].description)
          setlogo(data[0].logo&&data[0].logo.url)
          setfront_cover_image(data[0].front_cover_image&&data[0].front_cover_image.url||'')
          setphone_number(data[0].phone_number)
          setgmail(data[0].gmail)
            setfacebook(data[0].facebook)
            setwhatsapp(data[0].whatsapp)
            setgoogle_chat(data[0].google_chat)
            setlinkedin(data[0].linkedin)
        }else if(status==='no data Found'){
          setphone_number({status:'inactive'})
          setgmail({status:'inactive'})
          setwhatsapp({status:'inactive'})
          setgoogle_chat({status:'inactive'})
          setfacebook({status:'inactive'})
          setlinkedin({status:'inactive'});
        }else{
            Swal.fire(
                'Error',
                status,
                'warning'
            )
        }
    }).catch(err=>{
        Swal.fire(
            'Error',
            'Error Occured at Axios',
            'warning'
        )           
    });
}

  useEffect(()=>{
    loadSupport();
  },[]);

  useEffect(()=>{
    const handleRouteChange  = () => {
      setloading(true)
    }

    const routeChangeComplete = (url) => {  
      setloading(false)
      gtag.pageview(url)
    }
    
    Router.events.on("routeChangeStart", handleRouteChange );
    Router.events.on("routeChangeError", routeChangeComplete);
    Router.events.on("routeChangeComplete", routeChangeComplete);

    return()=>{
      Router.events.off("routeChangeComplete", routeChangeComplete);
    }
  },[router.events]);








  return(
    <Layout> {loading&&<PageLoader/>}
    <LoaderContext.Provider value={{ loading, setloading, name, description, front_cover_image, logo }}>
      
      <GoogleAnalytics measurementId='G-584WFXT84Y'/>
      <Script strategy='afterInteractive' async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
      crossorigin="anonymous"></Script>


       {admin==='admin' ? 
        <>
            <AdminHeader>
                  <Component {...pageProps} key={router.asPath}/>        
            </AdminHeader> 
            <Footer phone_number={phone_number} linkedin={linkedin} whatsapp={whatsapp} google_chat={google_chat} facebook={facebook} gmail={gmail} />
        </>
        :
         <>
         <Header/>
               <Component {...pageProps} key={router.asPath}/>
         <Footer phone_number={phone_number} linkedin={linkedin} whatsapp={whatsapp} google_chat={google_chat} facebook={facebook} gmail={gmail} />
         </>
        }



    </LoaderContext.Provider>
    </Layout>
  )
}

export default MyApp
