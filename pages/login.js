import axios from 'axios'
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { useLoader } from './_app';
import { baseUrl } from '../components/BaseUrl';
import { useEffect } from 'react';

export default function Login(){
const router=useRouter();
const {next}= router.query;
const {from}= router.query;
const { loading, setloading } = useLoader();
// alert(next)
function redirect(){
    
}
function handleSubmit(e){
        e.preventDefault();
        setloading(true)
        const formData=new FormData(e.target);
        axios.post(`/api/authentication/signin`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false)
            if(status==='success'){
                if(router.pathname!==router.asPath.split('?')[0]){
                    router.reload();
                    // router.push(baseUrl+router.asPath||`${baseUrl}/admin`,{ shallow: true })
                }else{
                    router.push(next||`${baseUrl}/admin`);
                }
            
            // router.push(next);
            
            }else{
            Swal.fire(
                'Alert!',
                `${status}`,
                'info'
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
     }

     useEffect(()=>{
        console.log('reqqs',router)
     })

    return(
        <>
        <div className='loginCon'>
        <div className='signincon'>
            <div className='siginheading'><p>Sign In</p></div>
            <form onSubmit={handleSubmit}>
            <div className='admineditnamecon'>
            <div className='admineditname'>
            <p style={{color:'black'}}>Email Address</p>
            <input type='email' name='email'/>
            </div>
        </div>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p style={{color:'black'}}>Password</p>
            <input type='password' name='password'/>
            </div>
        </div>
        <div className='usereditbtn'>
        <button>SUBMIT</button>
        </div>
        </form>
        </div>
        </div>
        </>
    )
}