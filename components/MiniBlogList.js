import Link from "next/link";
import Image from "next/image";

export default function MiniBlogList({title,articles}){
  const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
  let listing;

     listing=articles&&articles.map((article,i)=>{
      const {title,img,author,slug,categorySlug,description,views,likes,day,month,year}=article;

      return(
        <Link href={'/article'+slug} key={i} legacyBehavior>
        <a className='miniBlogCon'>
            
            <div className='miniBlogImg'>
                <Image 
                    src={img.url}
                    alt={title}
                    layout="fill"
                    blurDataURL="/favicon.io"
                    placeholder="blur"
                    priority
                />
            </div>

            <div className='miniBlogInfo'>
        
                <div>
                    <h3>{title}</h3>
                    <p><span>Author: </span>{author?.full_name}</p>
                    <p>{day} {months[month]}, {description}</p>
                </div>
            </div>

        </a>
      </Link>

      )
    })

 

    return(
        <>
        <div className='blogSliderHeading'><h2>{articles && articles.length!==0 ? title : ''}</h2></div>
        <div className='categories'>
            
          {articles&&listing}

        </div>
        </>
    )
}