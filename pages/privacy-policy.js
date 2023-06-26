import { baseUrl } from "@/components/BaseUrl";
import parse from "html-react-parser";
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
    const newUpdate1 = useSWR(url, fetcher, {fallbackData: {data:privacy_policy}});
    console.log('newUpdate1',parse(newUpdate1?.data?.data||''))

  
    return(
        <><div className="aboutusCon">
            <h1>Privacy Policy</h1>
            <div>{ parse(newUpdate1?.data?.data||'') }</div>
        </div>
                
  
        </>
    )
}