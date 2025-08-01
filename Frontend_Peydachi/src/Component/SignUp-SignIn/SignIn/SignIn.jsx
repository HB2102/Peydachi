import React, { useState } from 'react';
 import Swal from "sweetalert2";  
 import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { useAuth } from '../../Context/AuthContext';
import showErrorToast from '../../utils/showErrorToast';
import { useLogin } from '../../Context/LoginContext';
const SignIn= () => {
  const navigate = useNavigate();
  const { login } = useAuth()
  const { rememberMe, setRememberMe, username, setusername } = useLogin();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit =async (e) => {
    e.preventDefault();
    try{

      const response = await axiosInstance.post('/authentication/token', 
        { username, password }, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      if (response.status === 200) {
        if (rememberMe) {
          Cookies.set('auth_token', response.data.access_token, { expires: 3, secure: true, sameSite: 'Strict' });
          Cookies.set('refresh_token', response.data.refresh_token, { expires: 3, secure: true, sameSite: 'Strict' });
        } else {
          Cookies.set('auth_token', response.data.access_token, { secure: true, sameSite: 'Strict' });
          Cookies.set('refresh_token', response.data.refresh_token, { secure: true, sameSite: 'Strict' });
        }


        const userData = {
          userID: response.data.userID,
          username: response.data.username,
          role: response.data.is_super_admin
            ? 'superadmin'
            : response.data.is_admin
            ? 'admin'
            : response.data.is_seller
            ? 'seller'
            : 'user',
        };
       login(userData);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "خوش آمدید",
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: {
            popup: 'w-2 h-15 text-sm flex items-center justify-center', 
            title: 'text-xs', 
            content: 'text-xs',
            icon : 'text-xs mb-2'
          }
      });
      navigate('/', { replace: true });
      }
    }
    catch(error){
      showErrorToast(error);
    }
  };

  return (
    
    <motion.div initial={{ x: "-7rem", opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{
      duration: 2,
      type: "spring",
    }}
     className="w-full md:w-1/2 p-8 flex flex-col justify-center g:h-[75vh]" dir='rtl'>
    <div className="max-w-sm mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">ورود</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative">
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="نام کاربری"
              required
            />
            <i className="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"></i>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              placeholder="پسورد"
              required
            />
            <i 
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div > <input 
            type="checkbox" 
            id="remember" 
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-blue-500 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="remember" className="mr-2 text-[13px] text-gray-600 cursor-pointer">مرا به خاطر بسپار</label></div>
          <div className="cursor-pointer text-xs text-gray-500" onClick={() => {
            navigate('/login/forgot-password');
          }}>
            فراموشی رمز عبور
          </div>

        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors duration-200 ease-in-out font-medium"
        >
          ورود
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          حساب کاربری ندارید؟ <a className="inline text-blue-500 hover:underline cursor-pointer" onClick={() => navigate('/login/signup')}>ثبت‌نام</a>
        </p>
      </div>
      
     
    </div>
  </motion.div>
  );
};

export default SignIn;
