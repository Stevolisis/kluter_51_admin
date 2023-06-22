import Link from "next/link"

export default function BlogFastLinkLoader(){

    let listing=[1,2,3,4,5,6,7].map((i)=>{
  
        return(
            <Link href='/' className="BlogFastLinkBlock" key={i}>
                <p>-------</p>
            </Link>
  
        )
      })

    return(
        <div className="BlogFastLinkCon">
        <div className="BlogFastLinkHeader"><h1>-----</h1></div>
            <div className="BlogFastLink1">
                {listing}
            </div>
    </div>
    )
}