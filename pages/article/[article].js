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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";


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
      const contentSSR= res.data.data;
      const relatedArticlesSSR= res2.data.data;
      const articleViews= res3.data.data;
      const latestArticles= res4.data.data;

      const pageId=contentSSR._id;
      const categoryId=content.category

      return {
        props:{contentSSR,relatedArticlesSSR,articleViewsSSR,latestArticlesSSR,pageId,categoryId}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
}












export default function Article({error,contentSSR,relatedArticlesSSR,pageId,articleViewsSSR,latestArticlesSSR}){
    const { setloading } = useLoader();
    const months=['','January','February','March','April','May','June','July',
    'August','September','October','November','December'];
    const [liked, setLiked]=useState(false);
    const [windowLink, setwindowLink]=useState('');
    const [email, setemail]=useState('');
    const [full_name, setfull_name]=useState('');
    const [shouldRender , setShouldRender]=useState(false);
    const queryClient = useQueryClient();
    const search = useSearchParams();
    const params = {article: search.get('article')};
    const { data:{data:{data:content}} } = useQuery({
        queryKey:['article'],
        queryFn:async()=>{
            const result = await axios.get(`/api/articles/getArticle?article=${params.article}`);
            return result;
        },
        initialData: {data:{data:contentSSR}}
    });

    const { data:{data:{data:relatedArticles}} } = useQuery({
        queryKey:['relatedArticles'],
        queryFn:async()=>{
            const result = await axios.get(`/api/articles/loadRelatedArticlesByCategory?slug=${contentSSR?.categorySlug}`);
            return result;
        },
        initialData: {data:{data:relatedArticlesSSR}}
    });
    
    const { data:{data:{data:articleViews}} } = useQuery({
        queryKey:['articleViews'],
        queryFn:async()=>{
            const result = await axios.get(`/api/articles/getArticlesByViews?limit=12`);
            return result;
        },
        initialData: {data:{data:articleViewsSSR}}
    });

    const { data:{data:{data:latestArticles}} } = useQuery({
        queryKey:['latestArticles'],
        queryFn:async()=>{
            const result = await axios.get(`/api/articles/getArticles?limit=7`);
            return result;
        },
        initialData: {data:{data:latestArticlesSSR}}
    });

    const { data:{data:{data:comments}} } = useQuery({
        queryKey:['comments'],
        queryFn:async()=>{
            const result = await axios.get(`/api/comments/getPageComments?pageId=${pageId}`);
            return result;
        },
        initialData: {data:{data:[]}}
    });

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

    const setComment=useMutation({
        mutationFn: async(e) => {
            e.preventDefault();
            const formData=new FormData(e.target);
            formData.append('page_link',window.location.href);
            formData.append('pageId',pageId);
            const result = await axios.post(`/api/comments/addComment`,formData);
            return result;
        },
        onSuccess:()=>{
            Toast.fire({icon: 'success',title: ''})
            queryClient.invalidateQueries(['comments']);
            userAuth();
        },
    });
    if (setComment.isLoading) {
        setloading(true);
    }else{
        setloading(false);
    }
    if (setComment.isError) {
        Toast.fire({icon: 'error',title: 'Error Occured'});
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
    checkLike();
    userAuth();
    setShouldRender(true);
},[]);

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
    <title>{content?.title}</title>
    <meta name="description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
    <meta name="keywords" content="tech blog, technology, tech news, updates, insights, latest technology ,Web Technology, app development"/>

    <link rel="icon" href="/logo.ico" />
    <meta name="theme-color" content="#177C65" />

    <meta property="og:title" content={content?.title}/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://www.techreveal.vercel.app"/>
    <meta property="og:image" content={content?.img.url}/>
    <meta property="og:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>

    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:title" content={content?.title}/>
    <meta name="twitter:image" content={content?.img.url}/>
    <meta name="twitter:description" content="Get the latest technology news, updates, and insights from our expert writers. Stay ahead of the curve with our tech blog."/>
    <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7953128690140311"
        crossOrigin="anonymous"
    ></script>
  </Head>






 
 <div className='articleHeadCon'>
    <div className='articleHead'><h1>{content?.title}</h1>
    <p> { content && `Posed on ${months[content?.month]} ${content?.day}, ${content?.year}`}</p>
    </div>
    <div className="articleImg">
    <div style={{width:'100%',height:'100%',position:'relative'}}>
        <Image 
        src={content?.img?.url}
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
            src={content?.author?.img?.url}
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
            <p>{content?.author?.full_name}</p>
            <p>{content?.author?.description}</p>
            <div className="authorSocialLinks">
        {content?.author?.whatsapp.status==='inactive'|| ''? '' :<Link href={`${content?.author?.whatsapp.link}`} legacyBehavior><a><i className='fa fa-whatsapp'/></a></Link>}
        {content?.author?.dribble.status==='inactive'|| ''? '' :<Link href={`${content?.author?.dribble.link}`} legacyBehavior><a><i className='fa fa-dribble'/></a></Link>}
        {content?.author?.github.status==='inactive'|| ''? '' :<Link href={`${content?.author?.github.link}`} legacyBehavior><a><i className='fa fa-github'/></a></Link>}
        {content?.author?.linkedin.status==='inactive'|| ''? '' :<Link href={`${content?.author?.linkedin.link}`} legacyBehavior><a><i className='fa fa-linkedin'/></a></Link>}
        {content?.author?.twitter.status==='inactive'|| ''? '' :<Link href={`${content?.author?.twitter.link}`} legacyBehavior><a><i className='fa fa-twitter'/></a></Link>}
        {content?.author?.instagram.status==='inactive'|| ''? '' :<Link href={`${content?.author?.instagram.link}`} legacyBehavior><a><i className='fa fa-instagram'/></a></Link>}
        </div>
           </div>
    </div>


    <div className="articleShareCon">
    <div className="articleShare">
        <RWebShare
            data={{
            text: "Like humans, flamingos make friends for life",
            url: `${windowLink}`,
            title: `${content?.title}`,
            }}>
            <button onClick={()=>navigator.share({title:`${content?.title}`,text:'OTOTCH BLOG',url:`${windowLink}}`})}>Share <i className="fa fa-share"/></button>
        </RWebShare>
            <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${windowLink}i&title=${content?.title}&source=OTOTECH Blog`} legacyBehavior><a><i className="fa fa-linkedin"/></a></Link>
            <Link href={`https://twitter.com/intent/tweet?text=${windowLink}`} legacyBehavior><a><i className="fa fa-twitter"/></a></Link>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${windowLink}`} legacyBehavior><a><i className="fa fa-facebook"/></a></Link>
        </div>
    </div>


 </div>






 <div className="articleContentCon">

    <div className="article">{ parse(content?.content||'',{
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
    shouldRender  ? ( latestArticles!==undefined ? 
        <BlogFastLink articles={latestArticles} title='Latest News'/>
    : 
        <BlogFastLinkLoader/> )
    : 
        <BlogFastLinkLoader/>
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
    shouldRender && (relatedArticles!==undefined ? 
    <SlidingArticles articlesSlide={relatedArticles} title='Related Topics'/>
    : 
    <SlidingArticlesLoader/>)
}

<div className='miniBlogListCon'>
    
    {
        shouldRender && (articleViews!==undefined ? 
        <MiniBlogList articles={articleViews} title='Trending News'/>
        : 
        <BlogLoader/>)
    }
    
</div>




</>
)
}