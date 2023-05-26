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





// export const getStaticPaths=async()=>{
    
//   try{
//       const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
//       const content= res.data.data;

//       return{
//           paths:content.map(category=>{
//               console.log('category',category)
//               return {
//                   params:{
//                       blogCategory:category.slug.split('/')[0]||"404"
//                   }
//               }
//           }),
//           fallback:true
//   }
//   }catch(err){
//       return {
//         props:{error:err.message}
//       } 
//   }  
// }



// export const getStaticProps=async ({params})=>{
//   // let error=context.query;
//   try{
//     const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${params.blogCategory}`);
//     const res2=await axios.get(`${baseUrl}/api/articles/loadArticlesByCategory?category=${params.blogCategory}&limit=15`);
//     const category= res.data.data;
//     const blogData= res2.data.data;
    
//     return {
//       props:{category,blogData}
//     }    
    
//   }catch(err){
//     return {
//       props:{error:err.message}
//     } 
//   }
  
// }

export const getServerSideProps=async(context)=>{
  console.log('params',context.params);

  // let error=query;
  try{
    const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${context.params.blogCategory}`);
    const res2=await axios.get(`context.baseUrl}/api/articles/loadArticlesByCategory?category=${context.params.blogCategory}&limit=15`);
    const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews`);
    const res4=await axios.get(`${baseUrl}/api/categories/getCategories`);
    const category= res.data.data;
    const blogData= res2.data.data;
    const articleViews= res3.data.data;
    const categories= res4.data.data;

    return {
      props:{category,blogData,articleViews,categories}
    }    
    
  }catch(err){
    return {
      props:{error:err.message}
    } 
  }
  
}

  
export default function BlogCategory({category,blogData,error}){
  let router=useRouter();
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [categories,setcategories]=useState(null);
    const [articles,setarticles]=useState(null);
    const [shouldRender , setShouldRender]=useState(false);
    const { loading, setloading } = useLoader();
    let limit=useRef(15);

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
          setShouldRender(true);
          setarticles(blogData);
          loadCategories();
          loadArticlesByViews();
          // if(category===null){
          //   Swal.fire(
          //     'Error Occured',
          //     'Category not Found',
          //     'error'
          //   )
          // }
        },[blogData])

    



    return(
        <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="ie=edge"/>
        <title>{category&&category.name}</title>
        <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />

        <meta property="og:title" content={category&&category.name}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.techreveal.vercel.app"/>
        <meta property="og:image" content={category && category.img && category.img.url}/>
        <meta property="og:description" content={category&&category.description}/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={category&&category.name}/>
        <meta name="twitter:image" content={category && category.img && category.img.url}/>
        <meta name="twitter:description" content={category&&category.description}/>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
            crossOrigin="anonymous"
        ></script>
      </Head>




      <Mainscreen heading={category&&category.name} description={category&&category.description}
     imgLink={category && category.img && category.img.url} page='blogCategory'/>





<div className={styles.categorySliderCon}>
<div className={styles.categorySlider}>
  {
    shouldRender && (
      categories!==null ? categories.map((category,i)=>{
      return <Link href={category.slug&&category.slug} key={i}><a className={styles.categorySlide}><i className={`fa fa-${category.icon}`}/>{category.name}</a></Link>
    }) :
    [1,2,3,4].map((category,i)=>{
      return <Link href='#' key={i} legacyBehavior><a style={{width:'100px',height:'35px',background:'rgba(201, 197, 197,0.4)',margin:'0 12px'}}><i/></a></Link>
    })
    )
  }
  </div>
</div>










     <div className='categoriesCon3'>
      
      
      {
        shouldRender && (articles!==null ? 
          <BlogList articles={articles}/>
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
        shouldRender && (articlesSlide!==null ? 
        <SlidingArticles articlesSlide={articlesSlide} title='Most Read Articles'/>
        : 
        <SlidingArticlesLoader/>)
      }

        </>
    )
}
































// import Head from "next/head";
// import Link from "next/link";
// import {useRouter} from 'next/router'
// import { useEffect,useRef,useState } from "react";
// import BlogList from "../../components/BlogList";
// import SlidingArticles from "../../components/SlidingArticles";
// import styles from '../../styles/blogCategory.module.css'
// import $ from 'jquery';
// import Mainscreen from "../../components/Mainscreen";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { baseUrl } from "../../components/BaseUrl";
// import { useLoader } from "../_app";
// import SlidingArticlesLoader from "../../components/SlidingArticlesLoader";
// import BlogLoader from "../../components/BlogLoader";



// export const getStaticPaths=async()=>{
    
//   try{
//       const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
//       const content= res.data.data;

//       return{
//           paths:content.map(category=>{
//               console.log('category',category)
//               return {
//                   params:{
//                       blogCategory:category.slug.split('/')[0]
//                   }
//               }
//           }),
//           fallback:true
//   }
//   }catch(err){
//       return {
//         props:{error:err.message}
//       } 
//   }  
// }


// export const getStaticProps=async({params})=>{
//   console.log('params',params)

//   // let error=query;
//   try{
//     const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${params.blogCategory}`);
//     const res2=await axios.get(`${baseUrl}/api/articles/loadArticlesByCategory?category=${params.blogCategory}&limit=15`);
//     const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews`);
//     const res4=await axios.get(`${baseUrl}/api/categories/getCategories`);
//     const category= res.data.data;
//     const blogData= res2.data.data;
//     const articleViews= res3.data.data;
//     const categories= res4.data.data;

//     return {
//       props:{category,blogData,articleViews,categories}
//     }    
    
//   }catch(err){
//     return {
//       props:{error:err.message}
//     } 
//   }
  
// }










  
// export default function BlogCategory({category,blogData,articleViews,categories,error}){
//   let router=useRouter();
//     const [articles,setarticles]=useState(null);
//     const { loading, setloading } = useLoader();
//     let limit=useRef(15);

//     if(error){
//       Swal.fire(
//         'Error Occured',
//         'Please check your connection',
//         'warning'
//       )
// }

//     function dropdown1(){
//         $('.filterSearch1').on('focus',function(){
//           $('.main4').css('display','block')
//         });
//         $('.filterSearch1').on('focusout',function(){
//           $(document).on('click',function(e){
//             if(e.target.className=='main4'||e.target.className=='filterSearch1'){
//               return
//             }else{
//               $('.main4').css('display','none')
//             }
//           })
//         });
//         }
      
      

//         function loadArticlesByCategory(){
//           setloading(true);
//           axios.get(`/api/articles/loadArticlesByCategory?category=${router.query.blogCategory}&limit=${limit.current}`)
//           .then(res=>{
//               let status=res.data.status;
//               let data=res.data.data;
//               console.log(data)
//               setloading(false)
//               if(status==='success'){
//                   setarticles(data)
//               }else{
//                   Swal.fire(
//                       'Error Occured',
//                       res.data.status,
//                       'warning'
//                   )
//               }
//           }).catch(err=>{
//             setloading(false);
//               Swal.fire(
//                   'Error Occured',
//                   err.message,
//                   'error'
//               )           
//           });            
  
//         }



//         function loadMore(){
//           limit.current=limit.current+8;
//           loadArticlesByCategory();
//         }

//         useEffect(()=>{
//           dropdown1();  
//         })

//         useEffect(()=>{
//           setarticles(blogData);
//         },[blogData])

    
//         console.log('ppp',articleViews)
//         console.log('nnn',blogData)


//     return(
//         <>
//       <Head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//         <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
//         <title>{category&&category.name}</title>
//         <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
//         <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

//         <link rel="icon" href="/logo.ico" />
//         <meta name="theme-color" content="#177C65" />

//         <meta property="og:title" content={category&&category.name}/>
//         <meta property="og:type" content="website"/>
//         <meta property="og:url" content="https://www.techreveal.vercel.app"/>
//         <meta property="og:image" content={category && category.img && category.img.url}/>
//         <meta property="og:description" content={category&&category.description}/>

//         <meta name="twitter:card" content="summary_large_image"/>
//         <meta name="twitter:title" content={category&&category.name}/>
//         <meta name="twitter:image" content={category && category.img && category.img.url}/>
//         <meta name="twitter:description" content={category&&category.description}/>
//       </Head>




//       <Mainscreen heading={category&&category.name} description={category&&category.description}
//      imgLink={category && category.img && category.img.url} page='blogCategory'/>





// <div className={styles.categorySliderCon}>
// <div className={styles.categorySlider}>
//   {
//     categories ? categories.map((category,i)=>{
//       return <Link href={category.slug&&category.slug} key={i} legacyBehavior><a className={styles.categorySlide}><i className={`fa fa-${category.icon}`}/>{category.name}</a></Link>
//     }) :
//     [1,2,3,4].map((category,i)=>{
//       return <Link href='#' key={i} legacyBehavior><a style={{width:'100px',height:'35px',background:'rgba(201, 197, 197,0.4)',margin:'0 12px'}}><i/></a></Link>
//           })
//   }
//   </div>
// </div>










//      <div className='categoriesCon3'>
      
      
//       {articles ? <BlogList articles={articles}/> : <BlogLoader/>}


//       <div className='blogNavCon'>
//         <div className='blogNav'>
//         {articles&&<button onClick={loadMore}>Load More</button>}
//         </div>
//       </div>
//       </div>


//       {articleViews ? <SlidingArticles articlesSlide={articleViews} title='Most Read Articles'/>: <SlidingArticlesLoader/>}
//         </>
//     )
// }

