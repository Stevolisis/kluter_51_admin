import Link from "next/link";
import Image from "next/image";

export default function SlidingArticles({articlesSlide,title}){
  const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
  let listing;

  if(articlesSlide){
    listing=articlesSlide.map((article,i)=>{
     const {title,img,author,categorySlug,slug,views,likes,day,month,year}=article;
 

     
     return(
     <Link href={categorySlug+slug} key={i} legacyBehavior><a className='blogCon'>
       <div className='blogImg'>
          <Image 
            src={img.url}
            alt={title}
            layout="fill"
            blurDataURL="/favicon.io"
            placeholder="blur"
            priority
          />
       </div>
       <div className='blogInfo'>
 
       <div className="blogMetaData">
       <div>by <span>{author&&author.full_name}</span> / <span>{day}th {months[month]}, {year}</span></div>
       <div></div>
       </div>
 
       <div className="blogInfoTitle">
       <h3>{title}</h3>
       </div>
       </div>
 
       <div className='blogDataCon'>
         <div className='blogData'>
         <i className='fa fa-eye'><p>{views}</p></i>
         <i className='fa fa-thumbs-up'><p>{likes}</p></i>
         </div>
         <div className='blogRead'><Link href='#'><p>Read</p></Link></div>
       </div>
       </a>
     </Link>
     )
   })
 }






  return(
      <>
        <div className='blogSliderHeading'><h2>{title}</h2></div>

        <div className='blogSliderCon'>
          <div className='blogSlider'>
            {listing}
          </div>
        </div>
      </>
    )
}