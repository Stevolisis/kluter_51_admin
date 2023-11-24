import { baseUrl } from '@/components/BaseUrl';
import { useRouter } from 'next/router';
import { useEffect } from 'react'


export default function Home() {
  const router=useRouter();

  useEffect(()=>{
    router.push(next||`${baseUrl}/admin`);
  },[]);


  return (
    <>
      <div>Redirecting you to admin panel</div>
    </>
  )
}
