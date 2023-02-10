import Link from "next/link";
import { useEffect,useState } from "react";
import CategorydropDown from './CategorydropDown'
import Navbar from './Navbar'
import NavbarController from './NavbarController'
import $ from 'jquery';
import axios from "axios";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Image from "next/image";
import { useLoader } from "../pages/_app";


export default function Header(){
  const [navStatus,setnavStatus]=useState(false);
  const [categories,setcategories]=useState(false);
  const [searchResult,setsearchResult]=useState([]);
  const [searchKey,setsearchKey]=useState('');
  const { logo } = useLoader();
  const router=useRouter();


  function dropdown2(){
    $('.filterSearch2').on('focus',function(){
      $('.filterCon').css('display','block')
      $('.filterCon2').css('display','none')
    });
    $('.filterSearch2').on('focusout',function(){
      $(document).on('click',function(e){
        if(e.target.className=='filterCon div'||e.target.className=='filterSearch2'){
          return
        }else{
          $('.filterCon').css('display','none')
        }
      })
    });
    }
    

    function loadCategories(){
      if($(window).innerWidth() > 780){
        axios.get('/api/categories/getCategories')
        .then(res=>{
        let data=res.data.data;
        let status=res.data.status;
        console.log('yuuuuuuuup',status)
        if(status==='success'){
          setcategories(data);
        }else{
          Swal.fire(
            'Error Occured',
            status,
            'error'
          )
        }
        })
      }

    }

    useEffect(()=>{
    
      if (searchKey.length >1){
      try{
      axios.get(`/api/searchAll?key=${searchKey}`)
        .then(res=>{
          let status=res.data.status;
          let data=res.data.data;
          if(status==='success'){
            setsearchResult(data)
          }else{
            return;
          }
        });
  
      }catch(err){
        Swal.fire(
          'Error Status',
          err,
          'error'
        )
      }

      }else{
        return;
      }
      
    },[searchKey])

  useEffect(()=>{
    dropdown2();  
  })

  useEffect(()=>{
    loadCategories();
  },[])


    return(
        <>

      <header>
      <div className="logoCon" onClick={()=>router.push('/')}>
        {logo&&<Image
          src={logo}
          width={140}
          height={25}
          alt={logo}
          blurDataURL="/favicon.io"
          priority
          />}
        </div>
      <div className="linksCon">
      <Link href='/'>Home</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/about.html'>About Us</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/#service'>Our Services</Link>
      <Link href='https://ototech22.github.io/OTOTECH-website/contact.html'>Contact</Link>
      </div>
      <div className="buttonCon">
      <Link href='#'>Contact Us</Link>
            <NavbarController navStatus={navStatus} setnavStatus={setnavStatus}/>
      </div>

      </header>


      <Navbar section='blog' navStatus={navStatus} setnavStatus={setnavStatus}/>




              <div className="barCon">
        <CategorydropDown/>

      <div className="searchCon">
      <i className="fa fa-search"></i>
      <input className='filterSearch2' type="text" name="search" placeholder="search topics, fields ..." value={searchKey} onChange={(e)=>setsearchKey(e.target.value)}/>
      </div>
      </div>

      <div className="filterCon">
      {
        searchResult&& searchResult.map((searchRes,i)=>{
          if(searchRes!==null){
            return <div key={i}><Link href={searchRes.title ? searchRes.categorySlug+'/' + searchRes.slug : searchRes.slug} legacyBehavior><a>{searchRes.title||searchRes.name}  <span style={{color:'dodgerblue',fontSize:'12px'}}>{searchRes.title?'Article':'Category'}</span></a></Link></div>
          }
        })
      }
		  </div>

      <div className="filterCon2">
        {categories&& categories.map((category,i)=>{
          return <div key={i}><Link href={category.slug}>{category.name}</Link></div>
        })}
		  </div>
        </>
    )
}
