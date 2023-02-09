export const pageview=(url)=>{
  window.gtag('config',process.env.GOOGLE_MEASUREMENT_ID,{
    page_path:url,
  })  
}
