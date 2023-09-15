import axios from "axios";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect,useState } from "react";
import Swal from "sweetalert2";
import SlidingArticles from "@/components/SlidingArticles";
import parse, { attributesToProps } from 'html-react-parser';
import { RWebShare } from "react-web-share";
import {baseUrl} from '@/components/BaseUrl'
import { useLoader } from "../_app";
import SlidingArticlesLoader from "@/components/SlidingArticlesLoader";
import Comments from "@/components/Comments";
import CommentsLoader from "@/components/CommentsLoader";
import MiniBlogList from "@/components/MiniBlogList";
import BlogLoader from "@/components/BlogLoader";
import BlogFastLink from "@/components/BlogFastLink";
import BlogFastLinkLoader from "@/components/BlogFastLinkLoader";
import useSWR from "swr";
import { useRouter } from "next/router";

export const getStaticPaths = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/articles/getArticles`);
      const content = res.data.data;
  
      return {
        paths: content.map((article) => {
          return {
            params: {
              article: article.slug.split("/")[0] || "404",
            },
          };
        }),
        fallback: true,
      };
    } catch (err) {
      return {
        paths: [],
        fallback: true,
      };
    }
  };

  
export const getStaticProps=async({params})=>{

    try{
      const res=await axios.get(`${baseUrl}/api/articles/getArticle?article=${params.article}`);
      const res2=await axios.get(`${baseUrl}/api/articles/loadRelatedArticlesByCategory?slug=${res?.data?.data?.categorySlug}`)
      const res3=await axios.get(`${baseUrl}/api/articles/getArticlesByViews?limit=${12}`);
      const res4=await axios.get(`${baseUrl}/api/articles/getArticles?limit=${7}`);
      const content= res.data.data;
      const content2= res2.data.data;
      const articleViews= res3.data.data;
      const latestArticles= res4.data.data;

      const pageId=content._id;
      const categoryId=content.category
      
      return {
        props:{content,content2,articleViews,latestArticles,pageId,categoryId}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
}












export default function Article({error,content,content2,pageId,articleViews,latestArticles}){
  const { setloading } = useLoader();
  console.log('error2: ',error||'null5');
  console.log('final2',content||'null6');

    const months=['','January','February','March','April','May','June','July',
    'August','September','October','November','December'];
    const [liked, setLiked]=useState(false);
    const [windowLink, setwindowLink]=useState('');
    const [email, setemail]=useState('');
    const [full_name, setfull_name]=useState('');
    const [comments, setcomments]=useState(null); 
    const [shouldRender , setShouldRender]=useState(false);
    const router=useRouter();
    const params=router.query;
    const url = `${baseUrl}/api/articles/getArticle?article=${params.article}`;
    const url2 = `${baseUrl}/api/articles/loadRelatedArticlesByCategory?slug=${content?.categorySlug}`;
    const url3 = `${baseUrl}/api/articles/getArticlesByViews?limit=${12}`;
    const url4 = `${baseUrl}/api/articles/getArticles?limit=${7}`;
    const fetcher = (...args) => fetch(...args).then(res => res.json());
    const newUpdate1 = useSWR(url, fetcher, {fallbackData: {data:content}});
    const newUpdate2 = useSWR(url2, fetcher, {fallbackData: {data:content2}});
    const newUpdate3 = useSWR(url3, fetcher, {fallbackData: {data:articleViews}});
    const newUpdate4 = useSWR(url4, fetcher, {fallbackData: {data:latestArticles}});

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



useEffect(()=>{
setwindowLink(window.location.href)
checkLike()
userAuth();
setShouldRender(true);
},[])

useEffect(()=>{
    if(pageId){
        setView();
        loadComments()
    }

},[pageId])



return(
<>
  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
    <title>{newUpdate1?.data?.data?.title}</title>
    <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
    <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

    <link rel="icon" href="/logo.ico" />
    <meta name="theme-color" content="#177C65" />

    <meta property="og:title" content={newUpdate1?.data?.data?.title}/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://www.techreveal.vercel.app"/>
    <meta property="og:image" content={newUpdate1?.data?.data?.img.url}/>
    <meta property="og:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>

    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content={newUpdate1?.data?.data?.title}/>
    <meta name="twitter:image" content={newUpdate1?.data?.data?.img.url}/>
    <meta name="twitter:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
    <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
        crossOrigin="anonymous"
    ></script>
  </Head>






 
 <div className='articleHeadCon'>
    <div className='articleHead'><h1>{newUpdate1?.data?.data?.title}</h1>
    <p> { newUpdate1 && `Posed on ${months[newUpdate1?.data?.data?.month]} ${newUpdate1?.data?.data?.day}, ${newUpdate1?.data?.data?.year}`}</p>
    </div>
    <div className="articleImg">
    <div style={{width:'100%',height:'100%',position:'relative'}}>
        <Image 
        src={newUpdate1?.data?.data?.img?.url}
        alt='Cover Image'
        layout="fill"
        quality={90}
        // objectFit="fill"
        blurDataURL="/favicon.io"
        placeholder="blur"
        priority
        />
    </div>
    </div>

 </div>
 






 <div className="articleCreditCon">


    <div className='articleAuthorCon'>
        <div className='authorImg'>
           <Image
            src={newUpdate1?.data?.data?.author?.img?.url}
            alt='author Image'
            width={40}
            height={40}
            style={{borderRadius:'50%'}}
            placeholder='blur'
            blurDataURL="/imageLoader.png"
            priority
            />
        </div>

        <div className="articleAuthor">
            <p>AUTHOR</p>
            <p>{newUpdate1?.data?.data?.author?.full_name}</p>
            <p>{newUpdate1?.data?.data?.author?.description}</p>
            <div className="authorSocialLinks">
        {newUpdate1?.data?.data?.author?.whatsapp.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.whatsapp.link}`} legacyBehavior><a><i className='fa fa-whatsapp'/></a></Link>}
        {newUpdate1?.data?.data?.author?.dribble.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.dribble.link}`} legacyBehavior><a><i className='fa fa-dribble'/></a></Link>}
        {newUpdate1?.data?.data?.author?.github.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.github.link}`} legacyBehavior><a><i className='fa fa-github'/></a></Link>}
        {newUpdate1?.data?.data?.author?.linkedin.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.linkedin.link}`} legacyBehavior><a><i className='fa fa-linkedin'/></a></Link>}
        {newUpdate1?.data?.data?.author?.twitter.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.twitter.link}`} legacyBehavior><a><i className='fa fa-twitter'/></a></Link>}
        {newUpdate1?.data?.data?.author?.instagram.status==='inactive'|| ''? '' :<Link href={`${newUpdate1?.data?.data?.author?.instagram.link}`} legacyBehavior><a><i className='fa fa-instagram'/></a></Link>}
        </div>
           </div>
    </div>


    <div className="articleShareCon">
    <div className="articleShare">
        <RWebShare
            data={{
            text: "Like humans, flamingos make friends for life",
            url: `${windowLink}`,
            title: `${newUpdate1?.data?.data?.title}`,
            }}>
            <button onClick={()=>navigator.share({title:`${newUpdate1?.data?.data?.title}`,text:'OTOTCH BLOG',url:`${windowLink}}`})}>Share <i className="fa fa-share"/></button>
        </RWebShare>
            <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${windowLink}i&title=${newUpdate1?.data?.data?.title}&source=OTOTECH Blog`} legacyBehavior><a><i className="fa fa-linkedin"/></a></Link>
            <Link href={`https://twitter.com/intent/tweet?text=${windowLink}`} legacyBehavior><a><i className="fa fa-twitter"/></a></Link>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${windowLink}`} legacyBehavior><a><i className="fa fa-facebook"/></a></Link>
        </div>
    </div>


 </div>






 <div className="articleContentCon">

    <div className="article">{ parse(newUpdate1?.data?.data?.content||'',{
            replace:domNode=>{
                if(domNode.name==='a'){
                    const props = attributesToProps(domNode.attribs);
                    return <h1 {...props} >{domNode.children[0].data}</h1>
                }else if(domNode.name==='pre'){
                    const props = attributesToProps(domNode.attribs);
                    return <code {...props}>{domNode.children[0].data}</code>;
                }
            }
        })}
    </div>


    {
    shouldRender  && ( newUpdate4!==undefined ? 
        <BlogFastLink articles={newUpdate4?.data?.data} title='Latest News'/>
    : 
        <BlogFastLinkLoader/> )
    }

    
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
    shouldRender  && (newUpdate2!==undefined ? 
    <SlidingArticles articlesSlide={newUpdate2?.data?.data} title='Related Topics'/>
    : 
    <SlidingArticlesLoader/>)
}

<div className='miniBlogListCon'>
    
    {
        shouldRender  && (newUpdate3!==undefined ? 
        <MiniBlogList articles={newUpdate3?.data?.data} title='Trending News'/>
        : 
        <BlogLoader/>)
    }
    
</div>




</>
)
}