import {FaCheckCircle, FaExclamationCircle, FaUser,FaPhone , FaTag ,FaUserSlash , FaTrashAlt,FaRegClock, FaRegCommentDots} from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import showErrorToast from '../../utils/showErrorToast';
import formatDate from '../../utils/formatDate';
import axiosInstance from '../../axiosInstance';
const CommentManagement= () => {
const [activeTab, setActiveTab] = useState('text');
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [selectedUsers, setSelectedUsers] = useState([]);
const [showUserResults, setShowUserResults] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [commentToDelete, setCommentToDelete] = useState(null);
const [showResetModal, setShowResetModal] = useState(false);
const [notification, setNotification] = useState({
show: false,
message: '',
type: 'success'
});
const searchByText = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
        const response = await axiosInstance.post('/admin/store_comment/search_in_all_store_comments', {
            search : searchQuery
          });
    const data = response.data.filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()));
    setSearchResults(data);
    } catch (error) {
      showErrorToast(error);
    } finally {
    setIsLoading(false);
    }
};
const searchByUsername = async () => {
if (!searchQuery.trim()) return;
setIsLoading(true);
try {
    const response = await axiosInstance.post('/admin/user/search_users', {
        username: searchQuery
      });
const data = response.data.filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()));
setSelectedUsers(data);
setShowUserResults(true);
} catch (error) {
  showErrorToast(error);
} finally {
setIsLoading(false);
}
};
const getUserComments = async (userId) => {
setIsLoading(true);
try {
    const response = await axiosInstance.post('/admin/store_comment/get_user_store_comments', {
        user_id: userId
      });
      console.log(response);
    setSearchResults(response.data);
    setShowUserResults(false);
} catch (error) {
  showErrorToast(error);
} finally {
setIsLoading(false);
}
};
const deleteComment = async (commentId) => {
try {
    const response = await axiosInstance.delete('/admin/store_comment/admin_remove_store_comment',{data:  {store_comment_id: Number(commentId)}});
      console.log(response);
setSearchResults(prevResults => prevResults.filter(comment => comment.id !== commentId));
showNotification('کامنت حذف شد', 'success');
} catch (error) {
  showErrorToast(error);
} finally {
setShowDeleteModal(false);
setCommentToDelete(null);
}
};


    const handleSearch = () => {
        if (activeTab === 'text') {
            searchByText();
        } else {
            searchByUsername();
        }
    };
const confirmDeleteComment = (commentId) => {
setCommentToDelete(commentId);
setShowDeleteModal(true);
};

const showNotification = (message, type) => {
setNotification({ show: true, message, type });
setTimeout(() => {
setNotification(prev => ({ ...prev, show: false }));
}, 3000);
};

useEffect(() => {
    setSearchResults([]);
    setSelectedUsers([]);
    setShowUserResults(false);
}, [activeTab]);
return (
<div className=" bg-gray-50">
{/* Main Content */}
<main className="container mx-auto px-4 py-8">
{/* Search Section */}
<div className="bg-white rounded-lg shadow-md p-6 mb-8">
<div className="flex justify-between md:flex-row flex-col border-b border-gray-200 mb-6">
    
        <div className="">
            <button
            className={`px-4 py-2 font-medium text-sm mr-4 border-b-2 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'text' ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('text')}
            >
           جستجو با متن کامنت
            </button>
            <button
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'username' ? 'border-blue-800 text-blue-800' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('username')}
            >
           جستجو با نام‌کاربری
            </button>
        </div>
    <div className="">

    </div>
</div>
<div className="flex items-center">
<div className="relative flex-1">
<input
type="text"
placeholder={activeTab === 'text' ? "جستجو در کامنت‌ها" : "نام‌کاربری را وارد کنید"}
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-800 focus:border-blue-800 outline-none text-sm"
onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
/>
</div>
<button
onClick={handleSearch}
className="mr-4 bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
>
جستجو
</button>
</div>
</div>
{/* User Results (for username search) */}
{showUserResults && (
<div className="bg-white rounded-lg shadow-md p-6 mb-8">
<h2 className="text-lg font-semibold mb-4">کاربران پیدا شده</h2>
{selectedUsers.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{selectedUsers.map(user => (
<div
key={user.id}
className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
onClick={() => getUserComments(user.id)}
>
<div className="flex items-center">
<div className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center">
<FaUser className='inline' />
</div>
<div className="mr-3">
<h3 className="font-medium">{user.username}</h3>
<p className="text-sm text-gray-500">{user.email}</p>
</div>
</div>
<div className="mt-3 text-sm text-gray-600">
<p>
<FaPhone className="inline ml-2" />
{user.phone_number}
</p>
<p className="mt-1">
<FaTag className="ml-2 inline" />
{user.is_seller ? 'فروشنده' : 'کاربر'}
{user.is_admin && '، ادمین'}
{user.is_super_admin && '، سوپر ادمین '}
{user.is_banned && '، مسدود شده'}
</p>
</div>
</div>
))}
</div>
) : (
<div className="text-center py-8 text-gray-500">
<FaUserSlash className="text-4xl mb-3 inline" />
<p>هیچ کاربری مطابق با معیارهای جستجوی شما یافت نشد</p>
</div>
)}
</div>
)}
{/* Comments Results */}
<div className="bg-white rounded-lg shadow-md p-6">
<h2 className="text-lg font-semibold mb-4">نظرات</h2>
{isLoading ? (
<div className="flex justify-center items-center py-12">
<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
</div>
) : searchResults.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{searchResults.map(comment => (
<div key={comment.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
<div className="p-5">
<div className="flex justify-between items-start mb-3">
<div className="flex items-center">
<div className="w-8 h-8 rounded-full bg-blue-800 text-white flex items-center justify-center">
<FaUser className='text-xs inline' />
</div>
<span className="mr-2 font-medium">{comment.user_name}</span>
</div>
<button
onClick={() => confirmDeleteComment(comment.id)}
className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
aria-label="حذف نظر"
>
<FaTrashAlt className='inline' />
</button>
</div>
<p className="text-gray-700 mb-3">{comment.text}</p>
<div className="text-xs text-gray-500">
<FaRegClock className="inline ml-1" />
{formatDate(comment.date_added)}
</div>
</div>
</div>
))}
</div>
) : (
<div className="text-center py-12 text-gray-500">
<FaRegCommentDots className="text-5xl mb-3 inline" />
<p>نظری یافت نشد</p>
<p className="text-sm mt-2">سعی کنید معیارهای جستجوی خود را تنظیم کنید</p>
</div>
)}
</div>
</main>
{/* Delete Confirmation Modal */}
{showDeleteModal && (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
<h3 className="text-xl font-semibold mb-4">تایید حذف</h3>
<p className="text-gray-600 mb-6">آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟ این اقدام قابل بازگشت نیست.</p>
<div className="flex justify-end space-x-3">
<button
onClick={() => setShowDeleteModal(false)}
className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
>
لغو
</button>
<button
onClick={() => commentToDelete !== null && deleteComment(commentToDelete)}
className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
>
حذف
</button>
</div>
</div>
</div>
)}
{/* Reset Rating Confirmation Modal */}
{showResetModal && (
<div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
<div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
<h3 className="text-xl font-semibold mb-4">بازنشانی رتبه فروشگاه</h3>
<p className="text-gray-600 mb-6">آیا مطمئن هستید که می‌خواهید رتبه‌بندی این فروشگاه را مجدداً تنظیم کنید؟ این کار قابل بازگشت نیست.</p>
<div className="flex justify-end space-x-3">
<button
onClick={() => setShowResetModal(false)}
className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
>
لغو
</button>

</div>
</div>
</div>
)}
{/* Notification Toast */}
{/* Notification Toast */}
<div
  className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 
    transition-all duration-500 ease-in-out transform
    ${notification.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} 
    ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}
  `}
>
  <div className="flex items-center">
    {notification.type === 'success' ? (
      <FaCheckCircle className="ml-2" />
    ) : (
      <FaExclamationCircle className="ml-2" />
    )}
    <span>{notification.message}</span>
  </div>
</div>

</div>
);
};
export default CommentManagement