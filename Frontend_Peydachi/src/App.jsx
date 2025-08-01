import { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AdminStatsProvider } from './Component/Context/AdminStatsContext'; 
import './App.css'
import { CityProvider } from './Component/Context/CityContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AboutUs from './Component/About us/AboutUs';
import Login from './Component/SignUp-SignIn/Login';
import LandingPage from './Component/landingPage/LandingPage';
import Footer from './Component/Footer/footer';
import ErrorPage from './Component/Error/Error';
import UserInfo from './Component/UserInfo/UserInfo';
import { AuthProvider } from './Component/Context/AuthContext';
import { LoginProvider } from './Component/Context/LoginContext';
import AdminPage from './Component/Admin/Admin';
import SearchStore from './Component/otherServices/Store/SearchStore/SearchStore';
import AddStore from './Component/otherServices/Store/AddStoreRequest/AddStoreRequest';
import UserComment from './Component/otherServices/UserComments/UserComment';
import StoreProfile from './Component/Store/StoreProfile/StoreProfile';
import MainSearch from './Component/MainSearch/Search';
import SearchProduct from './Component/otherServices/Product/SearchProduct';
import AllNotifPage from './Component/Notification/AllNotifPage';
import Navbar from './Component/landingPage/navbar';
import ScrollToTop from './Component/utils/ScrollToTop';
import AddProduct from './Component/Store/AddProduct';
import StoreFullComment from './Component/Store/StoreProfile/StoreFullComment';
import SendReport from './Component/Report/SendReport';
import DashboardOverview from './Component/Admin/AdminDashboard/DashboardOverview';
import StoreManagement from './Component/Admin/AdminStore/StoreManagement';
import CityManagement from './Component/Admin/AdminCity/CityManagement';
import UserManagement from './Component/Admin/AdminUser/UserManagement';
import StoreCommentManagement from './Component/Admin/AdminCommet/StoreCommentManagement';
import AdminNotification from './Component/Admin/AdminNotif/AdminNotification';
import AdminFormsPage from './Component/Admin/AdminForm/AdminForm';
import AdminReports from './Component/Admin/AdminReports/AdminReports';
import StoreRequest from './Component/Admin/AdminReports/StoreRequests/StoreRequest';
import UserReports from './Component/Admin/AdminReports/UserReports/UserReports';
import CommentManagement from './Component/Admin/AdminCommet/CommentManagement';
import SelfStore from './Component/Store/selfStore';
import CenteredVideo from './Component/Criticism/Criticism';
import SignIn from './Component/SignUp-SignIn/SignIn/SignIn';
import SignUp from './Component/SignUp-SignIn/SignUp/SignUp';
import OTPVerification from './Component/SignUp-SignIn/Verify/PasswordVerification';
import PhoneVerification from './Component/SignUp-SignIn/Verify/PhoneVerification';


function App() {
  return (
    <AuthProvider>
      <CityProvider>
       <AdminStatsProvider>
      <Router>
        <ScrollToTop/>
        <div>
          <Navbar/>
          <div className="pt-[5rem]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/userInfo" element={<UserInfo />} />
            <Route path="/AddStoreRequest" element={<AddStore/>} />
            <Route path="/UserCommentReport" element={<UserComment/>} />
            <Route path="/SearchStore" element={<SearchStore/>} />
            <Route path="/StoreDetail/:id" element={<StoreProfile />} />
            <Route path="/Search" element={<MainSearch/>} />
            <Route path="/SearchProduct" element={<SearchProduct/>} />
            <Route path="/AllNotification" element={<AllNotifPage/>} />
            <Route path="/AddProduct" element={<AddProduct/>} />
            <Route path="/SelfStore" element={<SelfStore/>} /> 
            <Route path="/storeComments/:storeID" element={<StoreFullComment/>} />
            <Route path="/Report" element={<SendReport/>} />
            <Route path="/Criticism" element={<CenteredVideo/>} />
            <Route path="/login" element={
              <LoginProvider>
                <Login />
              </LoginProvider>
            }>
              <Route index element={<Navigate to="signin" replace />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="phone-verification" element={<PhoneVerification />} />
              <Route path="forgot-password" element={<OTPVerification />} />
            </Route>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<DashboardOverview/>} />
              <Route path="stores" element={<StoreManagement/>} />
              <Route path="cities" element={<CityManagement/>} />
              <Route path="users" element={<UserManagement/>} />
              <Route path="comments" element={<CommentManagement/>} />
              <Route path="/admin/reports" element={<AdminReports />}>
                <Route index element={<Navigate to="requests" replace />} />
                <Route path="requests" element={<StoreRequest />} />
                <Route path="reports" element={<UserReports />} />
              </Route>
              <Route path="notifications" element={<AdminNotification/>} />
              <Route path="adminManagement" element={<AdminFormsPage/>} />
              <Route path="/admin/storeComments/:storeId" element={<StoreCommentManagement />} />
            </Route>
          </Routes>
          </div>     
           <Footer/>
        </div>
      </Router>
      </AdminStatsProvider>
      </CityProvider>
    </AuthProvider>
  )
}

export default App
