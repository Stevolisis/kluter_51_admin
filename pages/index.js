import Head from 'next/head'
import Link from 'next/link'
import $ from 'jquery';
import { useEffect, useRef, useState } from 'react'
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

export const getStaticProps=async (context)=>{
try{
  const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
  const res2=await axios.get(`${baseUrl}/api/articles/getArticles?limit=15`);
  const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews`);
  const categories= res.data.data;
  const blogData= res2.data.data;
  const articleViews= res3.data.data;
  
  return {
    props:{categories,blogData,articleViews}
  }    
  
}catch(err){
  return {
    props:{error:err.message}
  } 
}

}

export default function Home({categories,blogData,articleViews,error}) {
  const [articlesSlide,setarticlesSlide]=useState(null);
  const { loading, setloading, name, description,front_cover_image } = useLoader();
  const [articles,setarticles]=useState(null)
  let limit=useRef(15)
  
  if(error){
    Swal.fire(
      'Error Occured',
      'Please check your connection',
      'error'
    )
  }

  

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



function loadArticles(){
  setloading(true)
  axios.get(`/api/articles/getArticles?limit=${limit.current}`)
  .then(res=>{
      let status=res.data.status;
      let data=res.data.data;
      setloading(false);

      if(status==='success'){
          setarticles(data)
      }else{
          Swal.fire(
              'Error Occured',
              res.data.status,
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
  });
}




// function loadArticlesByViews(){
//   axios.get('/api/articles/getArticlesByViews')
//   .then(res=>{
//       let status=res.data.status;
//       let data=res.data.data;
//       if(status==='success'){
//           setarticlesSlide(data)
//       }else{
//           Swal.fire(
//               'Error Occured',
//               res.data.status,
//               'warning'
//           )
//       }
//   }).catch(err=>{
//       Swal.fire(
//           'Error Occured',
//           err.message,
//           'error'
//       )           
//   });
// }


  function loadMore(){
    limit.current=limit.current+8;
    loadArticles()
  }

  useEffect(()=>{
    dropdown1();  
  })

  useEffect(()=>{
    setarticles(blogData);
    setarticlesSlide(articleViews)
    // loadArticlesByViews();
  },[])

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
      </Head>


    <Mainscreen heading={name} description={description}
     imgLink={front_cover_image} page='home'/>






<CategoryList categories={categories}/>







      <div className='emailRegisterCon'>
        <div className='emailRegister'>
          <h2>World-class articles, delivered weekly.</h2>
          <form>
            <input type='email' placeholder='Enter your email'/>  
            <button disabled>Submit</button>
          </form>
        </div>
      </div>















      <div className='categoriesCon3'>
      



      {articles!==null ? <BlogList articles={articles}/> : <BlogLoader/>}

      


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
     layout="fill"
     blurDataURL="/favicon.io"
     placeholder="blur"
     />
    </div>
  </div>


  {
  articlesSlide!==null 
  ? 
  <SlidingArticles articlesSlide={articlesSlide} title='Most Read Articles'/>
  :
  <SlidingArticlesLoader/>
  }








    </>
  )
}
