import { baseUrl } from "@/components/BaseUrl";
import axios from "axios";
import parse from "html-react-parser";
import Swal from "sweetalert2";
import useSWR from "swr";






export const getStaticProps=async ()=>{
  
    try{
      const res=await axios.get(`${baseUrl}/api/general_settings/getPrivacyPolicy`);
      const privacy_policy= res.data.data;
      
      return {
        props:{privacy_policy}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
}


export default function Privacy_policy({privacy_policy}){
    const url=`${baseUrl}/api/general_settings/getPrivacyPolicy`;
    const fetcher = (...args) => fetch(...args).then(res => res.json());  
    const { error, data } = useSWR(url, fetcher, {fallbackData: {data:privacy_policy}});

    if(error) {
      Swal.fire(
        'Error',
        error.message,
        'warning'
      ) 
    }
  
    return(
        <><div className="aboutusCon">
            <h1>Privacy Policy</h1>
            <div>{ parse(data?.data||'') }</div>
        </div>
                
  
        </>
    )
}