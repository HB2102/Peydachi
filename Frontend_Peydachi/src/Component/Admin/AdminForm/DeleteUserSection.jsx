import React, { useState } from 'react';
import axiosInstance from '../../axiosInstance';
import Swal from "sweetalert2"; 
import showErrorToast from '../../utils/showErrorToast'; 
const DeleteUserSection = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [promoteModal, setPromoteModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
        const response = await axiosInstance.post('/admin/user/search_users', {username : searchUsername});
        console.log(response);
       setSearchResults(response.data)
      } catch (error) {
        showErrorToast(error);
      }
  };

  const handleDelete = async () => {
    try {
        const response = await axiosInstance.delete('/super_admin/admin/delete_user',{data:  {user_id: Number(selectedUserId)}});
        if (response.status ===200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "کاربر حذف شد",
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
        setSearchUsername('');
        setSearchResults([]);
        setSelectedUserId(null);
        setSelectedUserInfo(null);
        setShowModal(false);
        }

    } catch (err) {
      showErrorToast(err);
    }
  };
  const handlePromote = async () => {
    try {
        const response = await axiosInstance.put('/super_admin/admin/promote_user_to_admin', {
            user_id: selectedUserId
        });
        if (response.status ===200) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: " ارتقای کاربر انجام شد",
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
        setPromoteModal(false);
        setSelectedUserId(null);
        setSearchResults([]);
        setSearchUsername('');
        }

    } catch (err) {
      showErrorToast(err);
    }
  };
  
  const handleConfirmClick = () => {
    const user = searchResults.find((u) => u.id === selectedUserId);
    setSelectedUserInfo(user);
    setShowModal(true);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 text-center">حذف کاربر / ارتقا کاربر </h3>

      {/* فیلد جستجو */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="نام کاربری"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          className="border border-blue-800 text-blue-800 px-4 py-2 rounded hover:bg-blue-100"
        >
          جستجو
        </button>
      </div>

      {/* نمایش لیست نتایج */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-700">کاربر مورد نظر را انتخاب کنید:</p>
          <ul className="space-y-1 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <li key={user.id} className="hover:bg-blue-50 p-1 flex items-center gap-2">
                <input
                  type="radio"
                  id={`user-${user.id}`}
                  name="selectedUser"
                  value={user.id}
                  checked={selectedUserId === user.id}
                  onChange={() => setSelectedUserId(user.id)}
                />
                <label htmlFor={`user-${user.id}`} className="text-sm text-gray-800">
                  {user.username}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}


        {selectedUserId && (
            <>
                <button
                onClick={handleConfirmClick}
                className="w-full border-1 border-red-600 text-red-600 hover:bg-red-100 px-4 py-2 rounded "
                >
                حذف کاربر
                </button>
                <button
                onClick={() => setPromoteModal(true)}
                className="w-full border-1 border-green-800 text-green-800 hover:bg-green-100 px-4 py-2 rounded"
                >
                ارتقا به ادمین
                </button>


            </>

        
      )}
      {/* مودال تأیید */}
      {promoteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">تأیید ارتقا</h4>
            <p className="text-sm text-gray-700 mb-4">
                آیا مطمئن هستید که می‌خواهید این کاربر را به ادمین ارتقا دهید؟
            </p>

            <div className="flex justify-end gap-3">
                <button
                onClick={() => setPromoteModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                انصراف
                </button>
                <button
                onClick={handlePromote}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                تأیید و ارتقا
                </button>
            </div>
            </div>
        </div>
        )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">تأیید حذف کاربر</h4>
            <p className="text-sm text-gray-700 mb-2">
              آیا مطمئن هستید که می‌خواهید کاربر را حذف کنید؟
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                تأیید و حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default DeleteUserSection;
