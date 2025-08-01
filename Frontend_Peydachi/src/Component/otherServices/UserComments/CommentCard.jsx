import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axiosInstance from '../../axiosInstance';
import showErrorToast from '../../utils/showErrorToast';
import formatDate from '../../utils/formatDate';
import { MdDelete } from "react-icons/md";
const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="font-iran fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
        <h2 className="text-lg font-bold text-gray-800 mb-4">حذف کامنت</h2>
        <p className="text-gray-600 mb-6">آیا مطمئنی می‌خوای این کامنت رو حذف کنی؟ این عمل قابل بازگشت نیست.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            لغو
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentCard = ({ item, isStore, onDelete }) => {

  const [showConfirm, setShowConfirm] = useState(false);

      const handleDeleteConfirmed = async (id) => {
        try {
          const url = isStore
            ? '/store_comment/user_delete_store_comment'
            : '/product_comment/user_delete_product_comment';
      
          const key = isStore ? 'store_comment_id' : 'product_comment_id';
      
          const response = await axiosInstance.delete(url, {
            data: { [key]: id },
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (response.status === 200) {
            console.log("comment deleted");
            if (onDelete) onDelete();
          }
          
        } catch (error) {
          showErrorToast(error);
        }
      };
      
    

    const renderStars = (rating) => (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      )
      return(<div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md shadow-gray-200 transition" dir='rtl'>
        <div className="flex gap-2 mb-4">
          <img
            src={isStore ? item.storeImage : item.productImage}
            alt={isStore ? item.storeName : item.productName}
            className={`${
              isStore ? 'w-12 h-12' : 'w-16 h-16 rounded-md'
            } object-cover object-top mr-4`}
          />
          <div>
            
            <h3 className="font-bold text-gray-800">
              {isStore ? item.storeName : item.productName}
            </h3>
            
            {!isStore && <p className="text-sm text-gray-600">از {item.storeName}</p>}
            <div className="flex items-center gap-1 mt-1">
              {renderStars(item.rating)}
              <span className="text-xs text-gray-500 mr-2">{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700">{item.comment}</p>
        <div className="flex items-center justify-between">
          <div className="flex text-gray-500 text-sm items-center">
          </div>
          <div className="flex space-x-2 text-sm">
          <button
            onClick={() => setShowConfirm(true)}
            className="text-red-600 text-2xl"
          >
            <MdDelete />
          </button>
          <ConfirmModal
            isOpen={showConfirm}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => {
              handleDeleteConfirmed(item.id);
              setShowConfirm(false);
            }}
          />
          </div>
        </div>
      </div>)
    
            }
  export default CommentCard