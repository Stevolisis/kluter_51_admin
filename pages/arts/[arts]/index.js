import { baseUrl } from '@/components/BaseUrl';
import axios from 'axios';
import parse from 'html-react-parser';

export const getStaticPaths=async()=>{
    
    try{
        const res2=await axios.get(`${baseUrl}/api/categories/getCategories`);
        console.log('res2',res2.data);
        const content= res2.data.data;

        return{
            paths:content.map(article=>{
                console.log('article',article)
                return {
                    params:{
                        arts:article.slug.split('/')[0]
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
        const res=await axios.get(`${baseUrl}/api/categories/getCategoryByName?category=${params.arts}`);
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

export default function Arts({content}){
console.log('content',content&&content.name);

    return(
        <>
            <div style={{paddingTop:'200px'}}><h1>{content&&content.name+': '}</h1>{}</div>
        </>
    )
}