import { baseUrl } from "@/components/BaseUrl";
import parse from "html-react-parser";
import useSWR from "swr";






export const getStaticProps=async ()=>{
  
    try{
      const res=await axios.get(`${baseUrl}/api/general_settings/getAboutUs`);
      const about_us= res.data.data;
      
      return {
        props:{about_us}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
}


export default function About_us({about_us}){
    const url=`${baseUrl}/api/general_settings/getAboutUs`;
    const fetcher = (...args) => fetch(...args).then(res => res.json());  
    const newUpdate1 = useSWR(url, fetcher, {fallbackData: {data:about_us}});

  
    return(
        <><div className="aboutusCon">
            <h1>About Us</h1>
            <div>{ parse(newUpdate1?.data?.data||'') }</div>
        </div>
                
  
        </>
    )
}