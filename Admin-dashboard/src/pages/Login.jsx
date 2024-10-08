import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import bg from "../assets/bg-pink.webp"

import eye from "../assets/eye-slash.svg"
import eyeO from "../assets/eye-open.svg"
import { RiLockPasswordFill } from "react-icons/ri";
import {toast } from 'react-toastify';
import { FaCircleUser } from "react-icons/fa6";
import api from "../../utils/api";
import { AuthContext } from "../../context/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [ShowPassword,setShowPwd] = useState(false) ; 
    const [userName,setUserName] = useState('') ; 
    const [password,setPassword] = useState('');
    const authContext = useContext(AuthContext);
    const handleLogin = async (event)=>{
        event.preventDefault(); 
    if(userName==='' || password==='')
    {
        toast.error('Please Fill all the fields'); 
    }else{
        const data = {
        username: userName,
        password
            }
            try {
                const response =await api.post('/api/user/login',JSON.stringify(data))
                if(response.statusText==="OK")
                {
                    const token = response.data.token   
                    await authContext.setUserAuthInfo(token)
                    navigate('/')
                }
                
            }
            catch(error){
                
                if(error.response?.data?.message)
                {
                    toast.error(error.response.data.message)
                }
                else{
                    toast.error(error.message)
                }   

            }
        }
    }
    // const [err,setErr] = useState(null) ;
    
    if(localStorage.getItem("token")) 
    {
       return( <Navigate to="/" />)
    }else{

    return ( 
    <div className="lg:bg-pink-100 h-screen  flex justify-start items-center bg-image ">
        <div className="lg:w-1/2  overflow-hidden bg-primary-pink lg:rounded-r-lg rounded-lg shadow-lg lg:h-screen h-fit w-fit mx-auto lg:pb-0 pb-10">
            <h1 className="text-center text-3xl font-bold pt-16 text-white">Login</h1>
            <form className="flex justify-center items-center  flex-col lg:mt-[150px] mt-20" onSubmit={handleLogin}>
                <div>
                    <h3 className="font-semibold mb-1 ml-[30px] text-white"> Email Or UserName</h3>
                    <div className="flex justify-start items-center">
                        <FaCircleUser width={30} color="white" className="relative left-10 w-[30px] h-[30px]"/>
                        <input value={userName} onChange={(e)=>{setUserName(e.target.value)}} className=" placeholder-[#ffffffc2] text-white focus:outline-none focus:bg-primary-pink active:bg-primary-pink pl-14 pr-14 block py-3 sm:w-[350px] xl:w-[500px] w-[300px] bg-primary-pink  border-x-0 border-t-0 border-2 " type="text" placeholder="la_user@esi.dz" />
                    </div>
                    </div>
                    <div className="ml-[25px] mt-8">
                    <h3 className="font-semibold mb-1 ml-[30px] text-white"> Password</h3>
                    <div className="flex justify-start items-center ">
                        <RiLockPasswordFill width={30} color="white" className="relative left-10 w-[30px] h-[30px]"/>
                        <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className="placeholder-[#ffffffc2] text-white focus:outline-none focus:bg-primary-pink active:bg-primary-pink pl-14 block py-3 pr-14  border-x-0 border-t-0 sm:w-[350px]  xl:w-[500px]  w-[300px] border-2  bg-primary-pink text-lg" type={(ShowPassword) ? "text" : "password" } placeholder="................."/>

                        <button onClick={(e)=>{e.preventDefault(); setShowPwd(!ShowPassword)}}>
                        <img src={(! ShowPassword) ? eye : eyeO}  alt="pwd" width={25} className=" relative right-10" />
                        </button>

                    </div>
                {/* {err && <h3 className="text-[18px] text-red-600 font-bold w-full text-center mt-2">{err} </h3> } */}
                </div>
            
                {/* <Link to='/singup' className=" self-end text-white mt-4 hover:underline hover:cursor-pointer mr-16">You don't have an account ?</Link> */}
                <div className="flex sm:flex-row flex-col justify-between items-center  mt-10">
                    <button className="bg-white  rounded-lg text-primary-pink hover:bg-black  p-2 px-10 font-semibold sm:mt-0 mt-6" type="submit">Login</button>
                </div>
            </form>
        </div>
        <div className="xl:w-2/3 lg:w-1/2 lg:block hidden  h-screen  overflow-hidden relative">
            <h3 className="text-primary-pink font-bold  text-[65px] absolute top-[40%]  xl:left-1/3 left-[20%] ">LAIB CLINIC</h3>
            <img src={bg} alt="bg"  className="h-full w-full object-cover"/>
        </div>
        


    </div> );
}
}
 
export default Login;