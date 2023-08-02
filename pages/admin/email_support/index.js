import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import axios from 'axios';
import { useLoader } from "../../_app";
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminEmail(){
    const [subscribers,setSubscribers]=useState([])
    const [dataLoad,setdataLoad]=useState(false);

    return(
        <>
        <div className='mainHeading'>
            <p>Subscribers</p>
            <Link href='email_support/sendEmail'>SEND MAIL</Link>
        </div>

        <div className='adminstat3con'>
            <div className='adminstat3'>
                <div className='adminstat3info2'>
                    <table>
                    <tbody>

                        <tr>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Delete</th>
                        </tr>

                        {subscribers && subscribers.map((comment,i)=>{
                            return(
                            <tr key={i}>
                            <td>{comment.pageId===null ? 'Invalid' : comment.pageId.title}</td>
                            <td>{comment.user===null ? 'Invalid' :comment.user.email}</td>
                            <td>{comment.day}th {months[comment.month]}, {comment.year}</td>
                            <td><button onClick={()=>deleteComment(comment._id)}>Delete</button></td>
                            <td><button onClick={()=>view(i)}>View</button></td>
                            </tr>
                            )
                        })}

                    </tbody>
                    </table>
                </div>
            </div>
        <div className='adminmorebtn'>
        <div>
            {
            dataLoad&&<ThreeDots
            height="40" 
            width="40" 
            radius="9"
            color="#177C65" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
            />
            }
        </div>

        <button>See More</button>
        </div>
        </div>
        </>
    )

}