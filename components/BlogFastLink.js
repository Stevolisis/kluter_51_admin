import Link from "next/link";

export default function BlogFastLink({title,articles}){
    let listing;

    if(articles){
        listing=articles&&articles.map((article,i)=>{
            const {title,categorySlug,slug}=article;
      
            return(
                <Link href={'/article'+slug} className="BlogFastLinkBlock" key={i}>
                    <p>{title}</p>
                </Link>
      
            )
          })
    }

    return(
        <div className="BlogFastLinkCon">
        <div className="BlogFastLinkHeader"><h1>{articles && articles.length!==0 ? title : ''}</h1></div>
            <div className="BlogFastLink1">
                {listing}
            </div>
    </div>
    )
}