import React , { useState ,useEffect } from "react";
import Swal from "sweetalert2";  
import { useNavigate } from 'react-router-dom';
import { TbMapSearch } from "react-icons/tb";
import { IoIosMenu,IoMdClose } from "react-icons/io";
import { useAuth } from '../Context/AuthContext';
import { useLocation } from 'react-router-dom';
import { isLoggedIn, getAccessToken } from '../utils/auth';
import Cookies from 'js-cookie';
import Notifications from "../Notification/Notification";
const Navbar = ()=>{
  
  const { logout } = useAuth();
   const { role } = useAuth(); 
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const location = useLocation();

    useEffect(() => {
      setIsMenuOpen(false); 
    }, [location.pathname]);
    
    const handleLinks=(link)=>{
      navigate(link)
    }

    const [isLogged, setIsLogged] = useState(isLoggedIn());

      useEffect(() => {
        const interval = setInterval(() => {
          setIsLogged(isLoggedIn());
        }, 1000);
        return () => clearInterval(interval);
      }, []);

    const handleLogOut = () => {
      Cookies.remove('auth_token'); 
      Cookies.remove('refresh_token'); 
      logout();
      Swal.fire({
                position: "top-end",
                icon: "success",
                title: " خارج شدید",
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
      
  };



    return(
        <div className="fixed w-full z-50 bg-white backdrop-blur-sm border-b border-gray-100" dir='rtl'>
        <div  className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
             <a href="/"><TbMapSearch className="z-10 text-blue-600 text-6xl "/></a>
              
              <a href="/" className="text-3xl font-bold text-gray-800">پیداچی</a>
            </div>
            <div className="sm:hidden">
              {isMenuOpen ? (
                <IoMdClose onClick={toggleMenu} className="h-6 w-6 cursor-pointer text-blue-800" strokeWidth={2} />
              ) : (
                <IoIosMenu onClick={toggleMenu} className="h-6 w-6 cursor-pointer text-blue-800" strokeWidth={2} />
              )}
            </div>
            <nav className={`${
                  isMenuOpen
                    ? 'block sm:hidden fixed inset-x-0 top-full left-0 w-4/5 m-auto bg-white shadow-lg mt-3 rounded-lg p-6 z-10'
                    : 'hidden sm:flex mt-3 rounded-lg p-6 sm:p-0 z-10'
                }
              `}
            >          
                <ul
                    onClick={() => {
                      if (window.innerWidth < 640) toggleMenu(); 
                    }}
                    className="flex flex-col items-center sm:flex-row sm:space-x-4 gap-4"
                  >                 
                  {isLogged ? <li onClick={()=>handleLinks('userInfo')} className="relative w-full text-center text-gray-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-900 hover:text-gray-800 hover:rounded-xl  px-2 py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300 sm:transition-all  sm:after:content-[''] sm:after:absolute sm:after:block sm:after:w-0 after:h-0.5 sm:after:bg-blue-600 sm:after:transition-all sm:after:duration-300 sm:after:left-1/2 sm:after:bottom-0 sm:hover:after:w-full sm:hover:after:left-0">
                    اطلاعات کاربر
                  </li> : null }
                  <li onClick={()=>handleLinks('Report')} className="relative w-full text-center text-gray-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-900 hover:text-gray-800 hover:rounded-xl px-2 py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300 sm:transition-all  sm:after:content-[''] sm:after:absolute sm:after:block sm:after:w-0 after:h-0.5 sm:after:bg-blue-600 sm:after:transition-all sm:after:duration-300 sm:after:left-1/2 sm:after:bottom-0 sm:hover:after:w-full sm:hover:after:left-0">
                    ثبت درخواست
                  </li>
                  {isLogged && (role === 'seller') ? <li onClick={()=>handleLinks('selfStore')} className="relative w-full text-center text-blue-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-700 hover:text-blue-800 hover:rounded-xl  py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300">
                    پنل فروشگاه
                  </li> : null }
                  {isLogged && (role === 'admin' || role=== 'superadmin') ? <li onClick={()=>handleLinks('Admin')} className="relative w-full text-center text-blue-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-700 hover:text-blue-800 hover:rounded-xl  py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300">
                    پنل ادمین
                  </li> : null }
                  {!isLogged ? 
                  ( <li id="r0-1" onClick={()=>handleLinks('login')} className="relative w-full text-center text-gray-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-900 hover:text-gray-800 hover:rounded-xl  px-2 py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300 sm:transition-all  sm:after:content-[''] sm:after:absolute sm:after:block sm:after:w-0 after:h-0.5 sm:after:bg-blue-600 sm:after:transition-all sm:after:duration-300 sm:after:left-1/2 sm:after:bottom-0 sm:hover:after:w-full sm:hover:after:left-0">
                  ورود/ثبت‌نام  
                    </li>):
                  ( <>
                    <li  onClick={handleLogOut} className="  relative w-full text-center text-gray-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-900 hover:text-gray-800 hover:rounded-xl  px-2 py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300 sm:transition-all  sm:after:content-[''] sm:after:absolute sm:after:block sm:after:w-0 after:h-0.5 sm:after:bg-blue-600 sm:after:transition-all sm:after:duration-300 sm:after:left-1/2 sm:after:bottom-0 sm:hover:after:w-full sm:hover:after:left-0">
                      خروج
                    </li>
                  </>) }  
                  { isLogged && role ? <li className="relative w-full text-blue-600 sm:hover:bg-transparent hover:bg-gray-100 sm:hover:text-blue-700 hover:text-blue-800 hover:rounded-xl  py-2 cursor-pointer whitespace-nowrap !rounded-button transition-colors duration-300">
                    <Notifications/>
                  </li> : null }

                  
              </ul>
            </nav>
            </div>
      </div>
    )
}

export default Navbar;