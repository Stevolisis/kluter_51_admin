import { useState,useRef, useEffect } from "react"
import Swal from 'sweetalert2';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import axios from "axios";
import { useLoader } from "../../../_app";
import { ThreeDots } from "react-loader-spinner";
import {baseUrl} from '../../../../components/BaseUrl';
// const SunEditors=dynamic(import("@/components/SunEditor"), { ssr: false });
const SunEditors = dynamic(() =>
import("@/components/SunEditor"), { ssr: false ,loading: () => 
<div style={{width:'100%',height:'600px',background:'#f5f6f6',display:'flex',justifyContent:'center',alignItems:'center'}}>
    <ThreeDots
        height="40" 
        width="40" 
        radius="9"
        color="#177C65" 
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
    />
</div>
});



export default function sendEmail(){
    const [subscribers,setSubscribers]=useState([]);
    const [content, setContent] = useState('');
    const {setloading}=useLoader();
    const router=useRouter();

    function loadSubscribers(){
        axios.get('/api/news_letter/getSubscribers?limit=0')
        .then(res=>{
            let data=res.data.data;
            if(res.data.status==='success'){
                setSubscribers(data)
            }else{
                Swal.fire(
                    'Error',
                    res.data.status,
                    'warning'
                )
            }
        }).catch(err=>{
            Swal.fire(
                'Error',
                'Error Occured at Axios',
                'warning'
            )           
        });
    }


    function handleSubmit(e){
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "Confirm Action On Article",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Edit it!',
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
                setloading(true)
        const formData=new FormData(e.target);
        formData.append('content',content);
        formData.append('id',id);
        axios.post(`${baseUrl}/api/news_letter/sendEmail`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false)
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'Email Sent',
                    'success'
                )
            }else if(status==='Invalid User'){
                router.push(`/login?next=${router.asPath}`)
            }else{
                Swal.fire(
                    'Error Occured',
                    status,
                    'warning'
                )  
            }
        }).catch(err=>{
            setloading(false)
            Swal.fire(
                'Error Occured',
                err.message,
                'error'
            )
        })
    }else{
        setloading(false);
        return;
    }
    })
    }
    
    useEffect(()=>{
        loadSubscribers();
    },[])



    return(
        <>
        <div className='mainHeading'>
            <p>Send Mails</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Subject</p>
            <input type='text' name='title'/>
            </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Subscribers</p>
            <select name='category'>
            {subscribers.map(subs=>{
                return <option value={subs._id} key={subs._id}>{subs.email}</option>
            })}
            </select>
            </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Message</p>
                <SunEditors content={content} setContent={setContent}/>
            </div>
        </div>

        <div className='admineditbtn'>
        <button>SEND</button>
        </div>
        </div>
        </form>  
        </>
    )
}