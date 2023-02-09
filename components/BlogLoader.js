import Link from "next/link";
import Image from "next/image";

export default function BlogLoader(){
  const articles=[1,2,3,4]
  const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
  let listing;

     listing=articles&&articles.map((article,i)=>{

      return(
      <></>

      )
    })

 

    return(
        <>
        <div className='categories'>
          {articles&&listing}



        
        </div>
        </>
    )
}












