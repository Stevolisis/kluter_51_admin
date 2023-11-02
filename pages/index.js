import Head from 'next/head'
import Link from 'next/link'
import $ from 'jquery';
import { useEffect, useState } from 'react'
import SlidingArticles from '../components/SlidingArticles';
import BlogList from '../components/BlogList';
import Mainscreen from '../components/Mainscreen';
import axios from 'axios';
import CategoryList from '../components/CategoryList';
import Swal from 'sweetalert2';
import { baseUrl } from '../components/BaseUrl';
import { useLoader } from './_app';
import Image from 'next/image';
import BlogLoader from '../components/BlogLoader';
import SlidingArticlesLoader from '../components/SlidingArticlesLoader';
import MiniBlogList from '@/components/MiniBlogList';
import { useQuery } from '@tanstack/react-query';


// const fetchCategories = async () => {
//   const res = await axios.get(`${baseUrl}/api/categories/getCategories`);
//   return res;
// };

export const getStaticProps=async ()=>{
  
try{
  const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
  const res2=await axios.get(`${baseUrl}/api/articles/getArticles?limit=15`);
  const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews?limit=${18}`);
  const res4=await axios.get(`${baseUrl}/api/articles/getArticlesByLikes?limit=${12}`);
// console.log(res,res2,res3,res4);
  const categories= res.data.data;
  const blogDataSSR= res2.data.data;
  const articleViews= res3.data.data;
  const articleLikes= res4.data.data;
  
  return {
    props:{categories,articleLikes,blogDataSSR,articleViews}
  }    
  
}catch(err){
  return {
    props:{error:err.message}
  } 
}

}






export default function Home({categories,blogDataSSR,articleViews,articleLikes,error}) {
  const { setloading, name, description,front_cover_image } = useLoader();
  const [shouldRender , setShouldRender]=useState(false);
  const [limit,setLimit]=useState(15);
  const { isLoading, data:{data:{data:blogData}} } = useQuery({
    queryKey:['articles'],
    queryFn:async()=>{
      const result = await axios.get('/api/articles/getArticles?limit=15');
      return result;
    },
    initialData: {data:{data:blogDataSSR}}
  });

  
function dropdown1(){
  $('.filterSearch1').on('focus',function(){
    $('.main4').css('display','block')
  });
  $('.filterSearch1').on('focusout',function(){
    $(document).on('click',function(e){
      if(e.target.className=='main4'||e.target.className=='filterSearch1'){
        return
      }else{
        $('.main4').css('display','none')
      }
    })
  });
}


  function subscribeNewsLetter(e){
    e.preventDefault();
    setloading(true)
    const formData=new FormData(e.target);

    axios.post(`/api/news_letter/subscribe`,formData)
    .then(res=>{
      let status=res.data.status;
      setloading(false);

      if(status==='success'){
        Swal.fire('Success','You successfully subscribed to techreveal newsletter','success') 
      } else{
        Swal.fire('Error Occured',status,'warning')
      }
      
     
    }).catch(err=>{
      setloading(false);
      Swal.fire('Error Occured', err.message, 'error')
    })
    
  }



  function loadMore(){
    setLimit(limit+8);
  }

  useEffect(()=>{
    dropdown1();  
  })

  useEffect(()=>{
    setShouldRender(true)
  },[]);

  










  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <title>{name} | Stay Up-to-Date with the Latest Technology News</title>
        <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />

        <meta property="og:title" content="TechREVEAL | Stay Up-to-Date with the Latest Technology News"/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.techreveal.vercel.app"/>
        <meta property="og:image" content="https://res.cloudinary.com/dbkcvkodl/image/upload/v1676112672/techReal_lxfms4.png"/>
        <meta property="og:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="TechREVEAL | Stay Up-to-Date with the Latest Technology News"/>
        <meta name="twitter:image" content="https://res.cloudinary.com/dbkcvkodl/image/upload/v1676112672/techReal_lxfms4.png"/>
        <meta name="twitter:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        {/* <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
            crossOrigin="anonymous"
        ></script> */}
      </Head>


    <Mainscreen heading={name} description={description}
     imgLink={front_cover_image} page='home'/>






<CategoryList categories={categories}/>







      <div className='emailRegisterCon'>
        <div className='emailRegister'>
          <h2>World-class articles, delivered weekly.</h2>
          <form onSubmit={subscribeNewsLetter}>
            <input type='email' name='email' placeholder='Enter your email'/>  
            <button>Submit</button>
          </form>
        </div>
      </div>















      <div className='categoriesCon3'>
      
      {
        shouldRender && (blogData!==undefined||null ? 
        <BlogList articles={blogData}/>
        : 
        <BlogLoader/>)
      }

      <div className='blogNavCon'>
        <div className='blogNav'>
        <button onClick={loadMore}>Load More</button>
        </div>
      </div>
      </div>









      <div className='blogAdsCon'>
    <div className='blogAdsInfo'>
      <h2>IN NEED OF A WEBSITE, MOBILE APP, COPY WRITING SERVICES e.t.c ?<br/>
      VISIT US HERE TO GET A WORLD CLASS SERVICE</h2>
      <Link href='#'>OUR SERVICES</Link>
    </div>
    <div className='blogAdsImg'>
     <Image
     src='/OTOTECH3.png'
     alt='blogAdsImg'
     layout="fill"
     blurDataURL="/favicon.io"
     placeholder="blur"
     />
    </div>
  </div>


  {
    shouldRender && ( articleViews!==undefined||null ? 
    <SlidingArticles articlesSlide={articleViews} title='Most Read Articles'/>
    : 
    <SlidingArticlesLoader/>)
  }


    
  <div className='miniBlogListCon'>
        
        {
            shouldRender  && (articleLikes!==undefined||null!==null ? 
            <MiniBlogList articles={articleLikes} title='Trending News'/>
            : 
            <BlogLoader/>)
        }
        
  </div>


    </>
  )
}
