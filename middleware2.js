import { NextResponse } from "next/server"
import { baseUrl } from "./components/BaseUrl"

export default async function middleware(req) {
  let cookie=req.cookies.get('adminPass');
  let next=req.url.split(baseUrl)[1];


    if (req.url.includes('/admin')) {
      if (req.method == "HEAD") {
        return NextResponse.error();
      }

      if(req.cookies.get('adminPass')== undefined){

        return NextResponse.rewrite(`${baseUrl}/login?next=${next}&from=adminRoutes`); 

      }else{

       const res=await fetch(`${baseUrl}/api/authentication/adminAuth?cookie=${cookie}`)
       if(res.status!==404){
        return NextResponse.next();
      }else{
        return NextResponse.rewrite(`${baseUrl}/login?next=${next}&from=adminRoutes`);
      }

      }

    }

}