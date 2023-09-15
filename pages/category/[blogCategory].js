import Head from "next/head";
import Link from "next/link";
import {useRouter} from 'next/router'
import { useEffect,useRef,useState } from "react";
import BlogList from "@/components/BlogList";
import SlidingArticles from "@/components/SlidingArticles";
import $ from 'jquery';
import Mainscreen from "@/components/Mainscreen";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "@/components/BaseUrl";
import SlidingArticlesLoader from "@/components/SlidingArticlesLoader";
import BlogLoader from "@/components/BlogLoader";
import useSWR from "swr";





export const getStaticPaths=async()=>{
    
  try{
      const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
      const content= res.data.data;

      return{
          paths:content.map(category=>{
              return {
                  params:{
                      blogCategory:category.slug.split('/')[0]||'404'
                  }
              }

          }),
          fallback:true
      }
  }catch(err){
    return {
      paths: [],
      fallback: true
    };
  }  
}



export const getStaticProps=async ({params})=>{
  // let error=context.query;
  try{
    const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${params.blogCategory}`);
    const res2=await axios.get(`${baseUrl}/api/articles/loadArticlesByCategory?category=${params.blogCategory}&limit=15`);
    const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews?limit=${18}`);
    const res4=await axios.get(`${baseUrl}/api/categories/getCategories`);
    const category= res.data.data;
    const blogData= res2.data.data||[];
    const articleViews= res3.data.data;
    const returnedCategories= res4.data.data;

    if (res.data.data === null || res2.data.data === null) {
      return {
        notFound: true
      };
    }

    return {
      props:{returnedCategories,blogData,articleViews,category}
    }    
    
  }catch(err){
    return {
      props:{error:err.message}
    } 
  }
  
}













export default function BlogCategory({category,blogData,articleViews,returnedCategories,error}){
    console.log('error: ',error||'null3');
    console.log('final',category||'null4');
    
    const [shouldRender , setShouldRender]=useState(false);
    const [limit,setLimit]=useState(15);
    const router=useRouter();
    const params=router.query;
    const url=`${baseUrl}/api/categories/getCategoryByName?category=${params.blogCategory}`;
    const url2=`${baseUrl}/api/articles/loadArticlesByCategory?category=${params.blogCategory}&limit=${limit}`;
    const url3=`${baseUrl}/api/articles/getArticlesByViews?limit=${18}`;
    const url4=`${baseUrl}/api/categories/getCategories`;
    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const newUpdate1 = useSWR(url, fetcher, {fallbackData: {data:category}});
    const newUpdate2 = useSWR(url2, fetcher, {fallbackData: {data:blogData}});
    const newUpdate3 = useSWR(url3, fetcher, {fallbackData: {data:articleViews}});
    const newUpdate4 = useSWR(url4, fetcher, {fallbackData: {data:returnedCategories}});

    if(error){
      Swal.fire(
        'Error Occured',
        'Please check your connection',
        'warning'
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
      



    function loadMore(){
      setLimit(limit+8);
    }

    useEffect(()=>{
      dropdown1();  
    })

    useEffect(()=>{
      setShouldRender(true);
    },[blogData])

    







    return(
        <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <title>{category?.name}</title>
        <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />

        <meta property="og:title" content={category?.name}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.techreveal.vercel.app"/>
        <meta property="og:image" content={category?.img.url}/>
        <meta property="og:description" content={category?.description}/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={category?.name}/>
        <meta name="twitter:image" content={category?.img.url}/>
        <meta name="twitter:description" content={category?.description}/>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
            crossOrigin="anonymous"
        ></script>
      </Head>




      <Mainscreen heading={category?.name} description={category?.description}
     imgLink={category?.img.url} page='blogCategory'/>





<div className='categorySliderCon'>
<div className='categorySlider'>
  {
    shouldRender ? (
      newUpdate4 && newUpdate4.data && newUpdate4.data.data!== undefined||null ? 
      newUpdate4?.data?.data.map((category,i)=>{
      return <Link href={'/category'+category?.slug} key={i}>
          <div className='categorySlide'>
            <i className={`fa fa-${category.icon}`}/>{category.name}
          </div>
        </Link>
    }) :
    [1,2,3,4].map((i)=>{
      return <Link href='#' key={i} legacyBehavior>
          <div style={{width:'100px',height:'35px',background:'rgba(201, 197, 197,0.4)',margin:'0 12px'}}>
              <i/>
          </div>
        </Link>
    })
    )
    :
    [1,2,3,4].map((i)=>{
      return <Link href='#' key={i} legacyBehavior>
          <div style={{width:'100px',height:'35px',background:'rgba(201, 197, 197,0.4)',margin:'0 12px'}}>
              <i/>
          </div>
        </Link>
    })
  }
  </div>
</div>










     <div className='categoriesCon3'>
      
      
      {
        shouldRender ? ( blogData !==null ? 
          <BlogList articles={blogData}/>
        : 
        <BlogLoader/>)
        :
        <BlogLoader/>
      }


      <div className='blogNavCon'>
        <div className='blogNav'>
        {blogData&&<button onClick={loadMore}>Load More</button>}
        </div>
      </div>
      </div>

      {
        shouldRender ? ( newUpdate3 !==undefined ? 
        <SlidingArticles articlesSlide={newUpdate3?.data?.data} title='Most Read Articles'/>
        : 
        <SlidingArticlesLoader/>)
        : 
        <SlidingArticlesLoader/>
      }

        </>
    )
}
