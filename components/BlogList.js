import Link from "next/link";
import Image from "next/image";
import parse from 'html-react-parser';

export default function BlogList({articles}){
  const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
  let listing;

     listing=articles&&articles.map((article,i)=>{
      const {title,img,author,slug,categorySlug,description,views,likes,day,month,year}=article;

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
          {/* <Image
            src={img.url}
            alt={title}
            layout="responsive"
            width={img.width}
            height={img.height}
            placeholder="blur"
            blurDataURL="/favicon.io"
            priority
            style={{
              objectFit: "cover",
              objectPosition: "center",
          }}
          /> */}
        </div>
        <div className='blogInfo'>
  
        <div className="blogMetaData">
        <div>by <span>{author&&author.full_name}</span> / <span>{day}th {months[month]}, {year}</span></div>
        <div></div>
        </div>
  
        <div>
        <h3>{title}</h3>
          <p>{parse(description)}</p> 
        </div>
        </div>
  
        <div className='blogDataCon'>
          <div className='blogData'>
          <i className='fa fa-eye'><p>{views}</p></i>
          <i className='fa fa-thumbs-up'><p>{likes}</p></i>
          </div>
          <div className='blogRead'><Link href={categorySlug+slug}><p>Read</p></Link></div>
        </div>
        </a>
      </Link>

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