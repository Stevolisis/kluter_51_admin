import { baseUrl } from '@/components/BaseUrl';
import axios from 'axios';
import parse from 'html-react-parser';

export const getStaticPaths=async()=>{
    
    try{
        const res2=await axios.get(`${baseUrl}/api/articles/getArticles`);
        console.log('res2',res2.data);
        const content= res2.data.data;

        return{
            paths:content.map(article=>{
                console.log('article',article)
                return {
                    params:{
                        arts:article.articleSlug.split('/')[0],
                        art:article.slug.split('/')[0]
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
    console.log('params',params);
    try{
        const res=await axios.get(`${baseUrl}/api/articles/getArticle?category=${params.arts}&article=${params.art}`);
        console.log('res',res.data);
        const content= res.data.data;
        return {
            props:{content}
        }
    }catch(err){
        return {
          props:{error:err.message}
        } 
    }  
}

export default function Art({content}){
console.log('content',content&&content.title);

    return(
        <>
            <div style={{paddingTop:'200px'}}><h1>{content&&content.title+': '}</h1>{}</div>
        </>
    )
}