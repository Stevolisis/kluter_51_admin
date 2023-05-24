
export const pageview2=(url)=>{
  window.gtag('config',process.env.GOOGLE_MEASUREMENT_ID,{
    page_path:url,
  })  
}
export const pageview = (url) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', process.env.GOOGLE_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

