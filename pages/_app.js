import '../styles/globals.css'
import Layout from './Layout'
import '../styles/home.scss'
import '../styles/article.scss'
import '../styles/login.scss'
import '../styles/blogCategory.scss'
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
import useSWR from 'swr'
import { baseUrl } from '@/components/BaseUrl'
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
  const url = `${baseUrl}/api/general_settings/getGeneral_settings`;
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  // const { error, data } = useSWR(url, fetcher);
  const data= {
    "data": [
        {
            "logo": {
                "public_id": "rfhgkjrqvwqpdp4m1b7x",
                "url": "https://res.cloudinary.com/dbkcvkodl/image/upload/v1676073238/rfhgkjrqvwqpdp4m1b7x.png"
            },
            "front_cover_image": {
                "public_id": "ypci8ftiq88egzi6wnyu",
                "url": "https://res.cloudinary.com/dbkcvkodl/image/upload/v1689088075/ypci8ftiq88egzi6wnyu.jpg"
            },
            "phone_number": {
                "status": "inactive",
                "link": "https://"
            },
            "gmail": {
                "status": "active",
                "link": "Https"
            },
            "linkedin": {
                "status": "active",
                "link": ""
            },
            "whatsapp": {
                "status": "active",
                "link": ""
            },
            "facebook": {
                "status": "active",
                "link": "stephcom"
            },
            "google_chat": {
                "status": "active",
                "link": "https://Stephcom"
            },
            "_id": "63e6d9171da8aaacddf8a363",
            "name": "Everything Tech",
            "description": "For tech enthusiasts and industry leaders alike, TechReveal offers in-depth analysis and revelations, providing a window into the ever-evolving world of technology.",
            "__v": 0,
            "about_us": "<p>On August 8, 1970, TechReveal was registered under the Companies Act of 1968 by Steven Joseph, a student of ATBU Nigeria, to engage in the business of publishing newspapers, magazines, and other periodicals. TechReveal was designed to inform, educate, and entertain Nigerians and the world at large.</p><p>In 1971, the company made its debut with the publication of Tech Family, a glossy, family-oriented magazine. Its first editor was Bunmi Sofola. On Sunday, March 18, 1973, its first weekly newspaper, TechSunday, hit the newsstand. The first editor was Ajibade Fashina Thomas. The newspaper was designed \"to give our country a unique Sunday paper which combines the best in serious and popular journalism\" with refreshing information and entertainment.</p><p>On November 1, 1976, the daily tabloid, TechReveal, was born. Designed as \"the lively paper for lively minds,\" it aimed to address most of the shortcomings and inadequacies of the established Nigerian newspapers and to be \"swingingly elegant as well as socially concerned and seriously responsible.\" Its pioneer editor was Dayo Wright.</p><p>In its bid to perform its constitutionally assigned responsibilities, the company was shutdown many times by the powers-that-be. Many of its employees were also harassed and detained by successive military regimes.</p><p>TechReveal has a board of directors which is its highest policy-making organ. The current chairman of the board is Mrs. Angela Emuwa. The first chairman was Chief James Olubunmi Aboderin, an accomplished accountant who died in 1984 from a brief illness. The company's policies and directives are implemented by a management team led by the managing director and Editor-in-Chief. The current Managing Director is Mr. Joseph Adeyeye. Though a corporate business entity which exists to make a profit, it promotes and defends the values of democracy while contributing to the economic development of the country.</p><p>From inception, the company had run its business from Olu Aboderin Street, then Kudeti Street, Onipetesi, in Ikeja, Lagos. But in October 2009, it moved to its imposing permanent headquarters on kilometer 14, Lagos-Ibadan expressway, Magboro, Ogun State.</p><p>For some years now, TechReveal titles, TechReveal, TechSaturday, and TechSunday, have remained the market leaders in Nigeria. Despite this, the company has not rested on its laurels. It keeps adjusting and adapting to modern ways of running a newspaper house. It has invested heavily in new equipment and staff development. There is a big difference in terms of character and content between TechReveal of the '70s and TechReveal of today. The company is set to maintain its leadership position in the media industry.</p>",
            "privacy_policy": "<p>On August 8, 1970, TechReveal was registered under the Companies Act of 1968 by Steven Joseph, a student of ATBU Nigeria, to engage in the business of publishing newspapers, magazines, and other periodicals. TechReveal was designed to inform, educate, and entertain Nigerians and the world at large.</p><p>In 1971, the company made its debut with the publication of Tech Family, a glossy, family-oriented magazine. Its first editor was Bunmi Sofola. On Sunday, March 18, 1973, its first weekly newspaper, TechSunday, hit the newsstand. The first editor was Ajibade Fashina Thomas. The newspaper was designed \"to give our country a unique Sunday paper which combines the best in serious and popular journalism\" with refreshing information and entertainment.</p><p>On November 1, 1976, the daily tabloid, TechReveal, was born. Designed as \"the lively paper for lively minds,\" it aimed to address most of the shortcomings and inadequacies of the established Nigerian newspapers and to be \"swingingly elegant as well as socially concerned and seriously responsible.\" Its pioneer editor was Dayo Wright.</p><p>In its bid to perform its constitutionally assigned responsibilities, the company was shutdown many times by the powers-that-be. Many of its employees were also harassed and detained by successive military regimes.</p><p>TechReveal has a board of directors which is its highest policy-making organ. The current chairman of the board is Mrs. Angela Emuwa. The first chairman was Chief James Olubunmi Aboderin, an accomplished accountant who died in 1984 from a brief illness. The company's policies and directives are implemented by a management team led by the managing director and Editor-in-Chief. The current Managing Director is Mr. Joseph Adeyeye. Though a corporate business entity which exists to make a profit, it promotes and defends the values of democracy while contributing to the economic development of the country.</p><p>From inception, the company had run its business from Olu Aboderin Street, then Kudeti Street, Onipetesi, in Ikeja, Lagos. But in October 2009, it moved to its imposing permanent headquarters on kilometer 14, Lagos-Ibadan expressway, Magboro, Ogun State.</p><p>For some years now, TechReveal titles, TechReveal, TechSaturday, and TechSunday, have remained the market leaders in Nigeria. Despite this, the company has not rested on its laurels. It keeps adjusting and adapting to modern ways of running a newspaper house. It has invested heavily in new equipment and staff development. There is a big difference in terms of character and content between TechReveal of the '70s and TechReveal of today. The company is set to maintain its leadership position in the media industry.</p>"
        }
    ],
    "status": "success"
};
  const status=data?.status;
  const response=data?.data;
  
  // if(error) {
  //   Swal.fire(
  //     'Error',
  //     error.message,
  //     'warning'
  //   ) 
  // }

  useEffect(()=>{
    if(response){
      if(status==='success'){
        setname(response[0].name)
        setdescription(response[0].description)
        setlogo(response[0]?.logo?.url);
        setfront_cover_image(response[0]?.front_cover_image?.url||'')
        setphone_number(response[0].phone_number);
        setgmail(response[0].gmail);
        setfacebook(response[0].facebook);
        setwhatsapp(response[0].whatsapp);
        setgoogle_chat(response[0].google_chat);
        setlinkedin(response[0].linkedin);
      }else if(status==='no data Found'){
        setphone_number({status:'inactive'});
        setgmail({status:'inactive'});
        setwhatsapp({status:'inactive'});
        setgoogle_chat({status:'inactive'});
        setfacebook({status:'inactive'});
        setlinkedin({status:'inactive'});
      }else{
          Swal.fire(
              'Error',
               status,
              'warning'
          )
      }
    }
  },[data])


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
      {/* <Script strategy='afterInteractive' async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
      crossorigin="anonymous"></Script> */}


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
