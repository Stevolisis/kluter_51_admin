import Head from "next/head";
import Link from "next/link";
import {useRouter} from 'next/router'
import { useEffect,useRef,useState } from "react";
import BlogList from "../../components/BlogList";
import SlidingArticles from "../../components/SlidingArticles";
import styles from '../../styles/blogCategory.module.css'
import $ from 'jquery';
import Mainscreen from "../../components/Mainscreen";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl } from "../../components/BaseUrl";
import { useLoader } from "../_app";
import SlidingArticlesLoader from "../../components/SlidingArticlesLoader";
import BlogLoader from "../../components/BlogLoader";


export const getServerSideProps=async (context)=>{
  let error=context.query;
  try{
    const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${context.params.blogCategory}`);
    const res2=await axios.get(`${baseUrl}/api/articles/loadArticlesByCategory?category=${context.params.blogCategory}&limit=8`);
    const category= res.data.data||null;
    const blogData= res2.data.data||null;
    
    return {
      props:{category,blogData}
    }    
    
  }catch(err){
    return {
      props:{error:error}
    } 
  }
  
}

  
export default function BlogCategory({category,blogData,error}){
  let router=useRouter();
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [categories,setcategories]=useState(null);
    const [articles,setarticles]=useState(null);
    const { loading, setloading } = useLoader();
    let limit=useRef(8);

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
      

        function loadArticlesByViews(){
          axios.get('/api/articles/getArticlesByViews')
          .then(res=>{
              let status=res.data.status;
              let data=res.data.data;
              if(status==='success'){
                  setarticlesSlide(data)
              }else{
                  Swal.fire(
                      'Error Occured',
                      res.data.status,
                      'warning'
                  )
              }
          }).catch(err=>{
              Swal.fire(
                  'Error Occured',
                  err.message,
                  'error'
              )           
          });
        }
      

        function loadArticlesByCategory(){
          setloading(true);
          axios.get(`/api/articles/loadArticlesByCategory?category=${router.query.blogCategory}&limit=${limit.current}`)
          .then(res=>{
              let status=res.data.status;
              let data=res.data.data;
              console.log(data)
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


        
  function loadCategories(){
    axios.get('/api/categories/getCategories')
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        if(status==='success'){
            setcategories(data)
        }else{
            Swal.fire(
                'Error Occured',
                res.data.status,
                'warning'
            )
        }
    }).catch(err=>{
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
          setarticles(blogData);
          loadCategories();
          loadArticlesByViews();
          if(category===null){
            Swal.fire(
              'Error Occured',
              'Category not Found',
              'error'
            )
          }
        },[])

    



    return(
        <>
      <Head>
        <title>{category&&category.name}</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec9735" />
      </Head>







      <Mainscreen heading={category&&category.name} description={category&&category.description}
     imgLink={category && category.img && category.img.url} page='blogCategory'/>





<div className={styles.categorySliderCon}>
<div className={styles.categorySlider}>
  {
    categories!==null ? categories.map((category,i)=>{
    }) :
    [1,2,3,4].map((category,i)=>{
          })
  }
  </div>
</div>










     <div className='categoriesCon3'>
      
      
      {articles!==null ? <BlogList articles={articles}/> : <BlogLoader/>}


      <div className='blogNavCon'>
        <div className='blogNav'>
        {articles&&<button onClick={loadMore}>Load More</button>}
        </div>
      </div>
      </div>


      {/* {articlesSlide!==null ? <SlidingArticles articlesSlide={articlesSlide} title='Most Read Articles'/>: <SlidingArticlesLoader/>} */}
        </>
    )
}