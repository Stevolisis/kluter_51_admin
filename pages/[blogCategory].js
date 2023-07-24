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
import { useLoader } from "./_app";
import SlidingArticlesLoader from "@/components/SlidingArticlesLoader";
import BlogLoader from "@/components/BlogLoader";
import useSWR from "swr";





export const getStaticPaths=async()=>{
    
  try{
      const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
      const content= res.data.data;
//remember see more button in main index to load more articles

      return{
          paths:content.map(category=>{
              return {
                  params:{
                      blogCategory:category.slug.split('/')[0]
                      //why this error
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
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [categories,setcategories]=useState(null);
    const [articles,setarticles]=useState(null);
    const [shouldRender , setShouldRender]=useState(false);
    const { loading, setloading } = useLoader();
    let limit=useRef(15);
    const router=useRouter();
    const params=router.query;
    const url=`${baseUrl}/api/categories/getCategoryByName?category=${params.blogCategory}`;
    const url2=`${baseUrl}/api/articles/loadArticlesByCategory?category=${params.blogCategory}&limit=15`;
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
      

  

    function loadArticlesByCategory(){
      setloading(true);
      axios.get(`/api/articles/loadArticlesByCategory?category=${router.query.blogCategory}&limit=${limit.current}`)
      .then(res=>{
          let status=res.data.status;
          let data=res.data.data;
          setloading(false)
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




    function loadMore(){
      limit.current=limit.current+8;
      loadArticlesByCategory();
    }

    useEffect(()=>{
      dropdown1();  
    })

    useEffect(()=>{
      setShouldRender(true);
      // setarticles(blogData);
      // // console.log('ppppppppp',returnedCategories)
      // setcategories(returnedCategories);
      // setarticlesSlide(articleViews)

    },[blogData])

    







    return(
        <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>{newUpdate1?.data?.data?.name}</title>
        <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />

        <meta property="og:title" content={newUpdate1?.data?.data?.name}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.techreveal.vercel.app"/>
        <meta property="og:image" content={newUpdate1?.data?.data?.img.url}/>
        <meta property="og:description" content={newUpdate1?.data?.data?.description}/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={newUpdate1?.data?.data?.name}/>
        <meta name="twitter:image" content={newUpdate1?.data?.data?.img.url}/>
        <meta name="twitter:description" content={newUpdate1?.data?.data?.description}/>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
            crossOrigin="anonymous"
        ></script>
      </Head>




      <Mainscreen heading={newUpdate1?.data?.data?.name} description={newUpdate1?.data?.data?.description}
     imgLink={newUpdate1?.data?.data?.img.url} page='blogCategory'/>





<div className='categorySliderCon'>
<div className='categorySlider'>
  {
    shouldRender && (
      newUpdate4 && newUpdate4.data && newUpdate4.data.data!== undefined||null ? 
      newUpdate4?.data?.data.map((category,i)=>{
      return <Link href={category.slug&&category.slug} key={i}>
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
  }
  </div>
</div>










     <div className='categoriesCon3'>
      
      
      {
        shouldRender && ( newUpdate2 !==null ? 
          <BlogList articles={newUpdate2?.data?.data}/>
        : 
        <BlogLoader/>)
      }


      <div className='blogNavCon'>
        <div className='blogNav'>
        {articles&&<button onClick={loadMore}>Load More</button>}
        </div>
      </div>
      </div>

      {
        shouldRender && ( newUpdate3 !==undefined ? 
        <SlidingArticles articlesSlide={newUpdate3?.data?.data} title='Most Read Articles'/>
        : 
        <SlidingArticlesLoader/>)
      }

        </>
    )
}