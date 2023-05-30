import axios from "axios";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect,useState } from "react";
import Swal from "sweetalert2";
import SlidingArticles from "../../../components/SlidingArticles";
import parse, { attributesToProps } from 'html-react-parser';
import { RWebShare } from "react-web-share";
import {baseUrl} from '../../../components/BaseUrl'
import { useLoader } from "../../_app";
import SlidingArticlesLoader from "../../../components/SlidingArticlesLoader";
import Comments from "../../../components/Comments";
import CommentsLoader from "../../../components/CommentsLoader";


export const getStaticPaths=async()=>{
    
    try{
        const res2=await axios.get(`${baseUrl}/api/articles/getArticles`);
        const content= res2.data.data;

        return{
            paths:content.map(article=>{
                return {
                    params:{
                        blogCategory:article.categorySlug.split('/')[0]||"404",
                        article:article.slug.split('/')[0]||"404"
                    }
                }
            }),
            fallback:true
    }
    }catch(err){
        return {
        props:{error:err.message}
        } 
    }  
}

export const getStaticProps=async({params})=>{
    // let error=context.query;


    try{
      const res=await axios.get(`${baseUrl}/api/articles/getArticle?category=${params.blogCategory}&article=${params.article}`);
      const res2=await axios.get(`${baseUrl}/api/articles/loadRelatedArticlesByCategory?slug=${params.blogCategory}`)
      const content= res.data.data;
      const content2= res2.data.data;

      const pageId=content._id;
      const categoryId=content.category;
      const img_link=content.img.url;
      const img_link2=content.author&& content.author.img.url;
      const whatsapp=content.author&&content.author.whatsapp;
      const dribble=content.author&&content.author.dribble;
      const github=content.author&&content.author.github;
      const linkedin=content.author&&content.author.linkedin;
      const twitter=content.author&&content.author.twitter;
      const instagram=content.author&&content.author.instagram;
      
      return {
        props:{content,content2,pageId,categoryId,img_link,img_link2,whatsapp,dribble,github,linkedin,twitter,instagram}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
}
















export default function Article({error,content,content2,pageId,categoryId,img_link,img_link2,whatsapp,dribble,github,linkedin,twitter,instagram}){
    if(error){
        Swal.fire(
          'Error Occured',
          error,
          'error'
        )
  }

  const { loading, setloading } = useLoader();

    const months=['January','February','March','April','May','June','July',
    'August','September','October','November','December'];
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [liked, setLiked]=useState(false);
    const [windowLink, setwindowLink]=useState('');
    const [email, setemail]=useState('');
    const [full_name, setfull_name]=useState('');
    const [comments, setcomments]=useState(null); 
    const [shouldRender , setShouldRender]=useState(false);



    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

    function checkLike(){
        let checkTracker=localStorage.getItem('likeTracker');

        if(checkTracker){

        let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
        if(likeTracker.includes(window.location.href)){
            setLiked(true)
        }else{
        setLiked(false)                         
        } 

        }else{
            return;
        }
          
    }

    function handleLikeBtn(){
        if(liked===false){
            axios.post('/api/likes/addLike',{page_link:window.location.href,pageId:pageId})
            .then(res=>{
                let status=res.data.status;
            

                if(status==='success'){
                if (typeof window !== 'undefined') {
                    let item = localStorage.getItem('likeTracker');

                if(item){
                    let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));

                    if(likeTracker.includes(window.location.href)){
                        return;
                    }else{
                    likeTracker.push(`${window.location.href}`);
                    localStorage.setItem('likeTracker',JSON.stringify(likeTracker));                          
                    }
                    
                    Toast.fire({
                    icon: 'success',
                    title: ''
                    });

                }else{
                    localStorage.setItem('likeTracker',JSON.stringify([]));
                    let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
                    likeTracker.push(`${window.location.href}`);
                    localStorage.setItem('likeTracker',JSON.stringify(likeTracker));

                    Toast.fire({
                    icon: 'success',
                    title:''
                });                
                    }   
                }

                }else{
                    Toast.fire({
                        icon: 'warning',
                        title: ''
                    })
                }
            }).catch(err=>{
                Toast.fire({
                    icon: 'error',
                    title: ''
                })
            })
        }else{
            let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
            let indexTracker=likeTracker.indexOf(window.location.href);
            likeTracker.splice(indexTracker,indexTracker+1);
            localStorage.setItem('likeTracker',JSON.stringify(likeTracker));  
                    }
    }


     function setView(){
        if(pageId===''){
            return;
        }else{
            axios.post('/api/views/addView',{page_link:window.location.href,pageId:content && pageId})
        .then(res=>{
            return;
        }).catch(err=>{
            return;
        })
        }
     }

     function setComment(e){
        e.preventDefault();
        setloading(true);
        const formData=new FormData(e.target);
        formData.append('page_link',window.location.href);
        formData.append('pageId',pageId);

        axios.post('/api/comments/addComment',formData)
        .then(res=>{
            let status=res.data.status;
            let data=res.data.data;
            setloading(false);

            if(status==='success') Toast.fire({icon: 'success',title: ''})
            loadComments();
            userAuth();
           
        }).catch(err=>{
            setloading(false);
        })
     }



     function loadComments(){
       if(pageId===''){
       return;
       }else{
        axios.get(`/api/comments/getPageComments?pageId=${pageId}`)
        .then(res=>{
            let data=res.data.data;
            let status=res.data.status;
    
            if(status==='success'){
                setcomments(data);
            }else{
                return;
            }
        }).catch(err=>{
           return;
        })
       }
    }





    function userAuth(){
         axios.get('/api/users/userAuth')
         .then(res=>{
             let data=res.data.data;
             let status=res.data.status;
             if(status==='success'){
                setfull_name(data.full_name);
                setemail(data.email);
            }else{
               return;
            }

         }).catch(err=>{
             return;
         })
     }


    //  function loadArticlesByCategory(){
    //     if(pageId===''){
    //         return;
    //     }else{
    //     axios.get(`/api/articles/loadRelatedArticlesByCategory?id=${categoryId}`)
    //     .then(res=>{
    //         let status=res.data.status;
    //         let data=res.data.data;
    //         if(status==='success'){
    //             setarticlesSlide(data)
    //         }else{
    //             Swal.fire(
    //                 'Error Occured',
    //                 res.data.status,
    //                 'warning'
    //             )
    //         }
    //     }).catch(err=>{
    //         Swal.fire(
    //             'Error Occured',
    //             err.message,
    //             'error'
    //         )           
    //     });            
    //     }

    //   }


   useEffect(()=>{
    setwindowLink(window.location.href)
    checkLike()
    userAuth();
    setShouldRender(true)
   },[])

    useEffect(()=>{
        if(pageId){
            setView();
            loadComments()
            setarticlesSlide(content2);
        }
    },[pageId])



    return(
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <title>{content && content.title}</title>
        <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

        <link rel="icon" href="/logo.ico" />
        <meta name="theme-color" content="#177C65" />

        <meta property="og:title" content={content && content.title}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content="https://www.techreveal.vercel.app"/>
        <meta property="og:image" content={content&&content.img.url}/>
        <meta property="og:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>

        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={content && content.title}/>
        <meta name="twitter:image" content={content&&content.img.url}/>
        <meta name="twitter:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
            crossOrigin="anonymous"
        ></script>
      </Head>






     
     <div className='articleHeadCon'>
        <div className='articleHead'><h1>{content && content.title}</h1>
        <p> {content && `Posed on ${months[content.month]} ${content.day}, ${content.year}`}</p>
        </div>
        <div className="articleImg">
        <div style={{width:'100%',height:'100%',position:'relative'}}>
           {img_link && 
            <Image 
            src={img_link}
            alt='Cover Image'
            layout="fill"
            quality={90}
            // objectFit="fill"
            blurDataURL="/favicon.io"
            placeholder="blur"
            priority
            />}
        </div>
        </div>

     </div>
     






     <div className="articleCreditCon">


        <div className='articleAuthorCon'>
            <div className='authorImg'>
               {img_link2 && <Image
                src={img_link2}
                alt='author Image'
                width={40}
                height={40}
                style={{borderRadius:'50%'}}
                placeholder='blur'
                blurDataURL="/imageLoader.png"
                priority
                />}
            </div>

            <div className="articleAuthor">
                <p>AUTHOR</p>
                <p>{content && content.author&& content.author.full_name}</p>
                <p>{content && content.author&& content.author.description}</p>
                <div className="authorSocialLinks">
            {whatsapp&&whatsapp.status==='inactive'|| ''? '' :<Link href={`${whatsapp&&whatsapp.link}`} legacyBehavior><a><i className='fa fa-whatsapp'/></a></Link>}
            {dribble&&dribble.status==='inactive'|| ''? '' :<Link href={`${dribble&&dribble.link}`} legacyBehavior><a><i className='fa fa-dribble'/></a></Link>}
            {github&&github.status==='inactive'|| ''? '' :<Link href={`${github&&github.link}`} legacyBehavior><a><i className='fa fa-github'/></a></Link>}
            {linkedin&&linkedin.status==='inactive'|| ''? '' :<Link href={`${linkedin&&linkedin.link}`} legacyBehavior><a><i className='fa fa-linkedin'/></a></Link>}
            {twitter&&twitter.status==='inactive'|| ''? '' :<Link href={`${twitter&&twitter.link}`} legacyBehavior><a><i className='fa fa-twitter'/></a></Link>}
            {instagram&&instagram.status==='inactive'|| ''? '' :<Link href={`${instagram&&instagram.link}`} legacyBehavior><a><i className='fa fa-instagram'/></a></Link>}
            </div>
               </div>
        </div>


        <div className="articleShareCon">
        <div className="articleShare">
            <RWebShare
            data={{
            text: "Like humans, flamingos make friends for life",
            url: `${windowLink}`,
            title: `${content && content.title}`,
            }}>
            <button onClick={()=>navigator.share({title:`${content && content.title}`,text:'OTOTCH BLOG',url:`${windowLink}}`})}>Share <i className="fa fa-share"/></button>
            </RWebShare>
                <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${windowLink}i&title=${content && content.title}&source=OTOTECH Blog`} legacyBehavior><a><i className="fa fa-linkedin"/></a></Link>
                <Link href={`https://twitter.com/intent/tweet?text=${windowLink}`} legacyBehavior><a><i className="fa fa-twitter"/></a></Link>
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${windowLink}`} legacyBehavior><a><i className="fa fa-facebook"/></a></Link>
            </div>
        </div>


     </div>






     <div className="articleContentCon">
        <div >{content && parse(content.content,{
            replace:domNode=>{
                if(domNode.name==='a'){
                    const props = attributesToProps(domNode.attribs);
                    return <h1 {...props} >{domNode.children[0].data}</h1>
                }else if(domNode.name==='pre'){
                    console.log('pre',domNode)
                    const props = attributesToProps(domNode.attribs);
                    return <code {...props}>{domNode.children[0].data}</code>;
                }
            }
        })}</div>
     </div>









     <div className="likeArticleCon">
    <button onClick={()=>{setLiked(!liked),handleLikeBtn()}} style={{background:`${liked==true ? '#9c9a9a' : '#177C65'}`,
     boxShadow:`${liked==true ? 'none' : '-1px 2px 4px rgba(0, 0, 0, 0.2)'}`}}>
        <i className='fa fa-thumbs-up'></i>
        </button>
     </div>






     <div className='commentBoxCon'>

        <form onSubmit={setComment}>
            <h3>Leave a Comment</h3>
        <input required='required' type='text' name='full_name' placeholder="Full Name" value={full_name} onChange={(e)=>setfull_name(e.target.value)}/>
        <input required='required' type='email' name='email' placeholder="E-mail Address" value={email} onChange={(e)=>setemail(e.target.value)}/>
        <textarea required='required' placeholder="Your Comment" name='comment'/>
        <button>Submit</button>
        </form>

     </div>




    {comments!==null ? <Comments comments={comments}/> : <CommentsLoader/>}

    {
        shouldRender  && (articlesSlide!==null ? 
        <SlidingArticles articlesSlide={articlesSlide} title='Related Topics'/>
        : 
        <SlidingArticlesLoader/>)
    }



    </>
    )
}