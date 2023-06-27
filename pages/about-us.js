import { baseUrl } from "@/components/BaseUrl";
import axios from "axios";
import parse from "html-react-parser";
import Swal from "sweetalert2";
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
    const { error, data } = useSWR(url, fetcher, {fallbackData: {data:about_us}});

    
    if(error) {
      Swal.fire(
        'Error',
        error.message,
        'warning'
      ) 
    }
  
    return(
        <><div className="aboutusCon">
            <h1>About Us</h1>
            <div>{ parse(data?.data||'') }</div>
        </div>
                
  
        </>
    )
}