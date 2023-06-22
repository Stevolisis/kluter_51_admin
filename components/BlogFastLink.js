import Link from "next/link";

export default function BlogFastLink({title,articles}){

    let listing=articles&&articles.map((article,i)=>{
        const {title,categorySlug,slug}=article;
  
        return(
            <Link href={categorySlug+slug} className="BlogFastLinkBlock" key={i}>
                <p>{title}</p>
            </Link>
  
        )
      })

    return(
        <div className="BlogFastLinkCon">
        <div className="BlogFastLinkHeader"><h1>{title}</h1></div>
            <div className="BlogFastLink1">
                {listing}
            </div>
    </div>
    )
}