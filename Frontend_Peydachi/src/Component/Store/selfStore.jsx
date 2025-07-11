// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import axiosInstance from '../axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
    FaEdit,
    FaTimes,
    FaPlus,
    FaStar,
    FaStarHalfAlt,
    FaStar as FaStarEmpty,
    FaMapMarkerAlt,
    FaCubes,
    FaCalendarAlt,
    FaTrashAlt,
  } from 'react-icons/fa';
import ProductCard from './ProductCard';
import EditProductModal from './EditProductModal';
import { Navigate, useParams } from 'react-router-dom';
import { FaRegStar } from "react-icons/fa";
import ConfirmModal from './ConfirmModal';
import SelfProductModal from './SelfProductModal';
import UnauthorizedPage from '../Error/UnauthorizedPage';
const SelfStore = () => {
    const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
const [modalProduct, setModalProduct] = useState(null);
const [comments, setComments] = useState([]);
const chartRef = useRef(null);
const openProductModal = async (product) => {
  setModalProduct(product);
  setIsModalOpen(true);
  setComments([]);

  try {
    const res = await axiosInstance.post('/product_comment/get_product_comments', {
      product_id: product.id,
    });
    setComments(res.data);
  } catch (err) {
    console.error("خطا در گرفتن نظرات:", err);
    setComments([]);
  }

  setTimeout(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const ratingData = [5, 4, 3, 2, 1].map((r) => ({
      value: res.data.filter((c) => c.rating === r).length,
      name: `${r} Stars`,
    }));

    chart.setOption({
      animation: false,
      title: { text: 'Rating Distribution', left: 'center', textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item' },
      series: [{
        name: 'Ratings',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: ratingData,
      }]
    });

    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', onResize);
    };
  }, 0);
};

const closeProductModal = () => {
  setIsModalOpen(false);
  setModalProduct(null);
};

  const [searchTerm, setSearchTerm] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const showConfirmModal = ({ title, message, onConfirm }) => {
    setConfirmModalConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
      },
    });
  };
  
  const closeConfirmModal = () => {
    setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
  };
  
const [storeInfo, setStoreInfo] = useState({
name: "Organic Harvest Market",
owner_id: 1,
contact_info: {
email: "contact@organicharvest.com",
phone: "+1 (555) 123-4567",
website: "www.organicharvest.com"
},
description: "A premium store offering fresh organic produce, locally sourced goods, and artisanal products. We work directly with farmers to bring you the best quality food with sustainability in mind.",
location_longitude: "-122.4194",
location_latitude: "37.7749",
city_id: 1,
id: 101,
average_rating: 4.7,
average_product_rating: 4.5,
is_banned: false
});
const [products, setProducts] = useState([]);

const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
);

useEffect(() => {
  const getSelfStoreInfo =async()=>{
    try {
      const response = await axiosInstance.get('/seller/store/get_self_store', {
        headers: {
           'Accept': 'application/json'
        }
      });
     if (response.data) {
  setStoreInfo(response.data); 
  console.log('Store info:', response.data);
}

    } catch (error) {
      console.log(error);
    }
  }

  getSelfStoreInfo();
}, []);

const getSelfStoreProduct =async()=>{
  try {
    const response = await axiosInstance.get('/seller/product/get_self_products', {
      headers: {
         'Accept': 'application/json'
      }
    });
   if (response.data) {
setProducts(response.data); 
console.log('Store info:', response.data);
}
  } catch (error) {
    console.log(error);
  }
}
useEffect(() => {
  getSelfStoreProduct();
}, []);

const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState({
name: "",
contact_info: {},
description: "",
location_longitude: "",
location_latitude: ""
});
useEffect(() => {
// Initialize edit data when store info changes
if (storeInfo) {
setEditData({
name: storeInfo.name,
contact_info: storeInfo.contact_info,
description: storeInfo.description,
location_longitude: storeInfo.location_longitude,
location_latitude: storeInfo.location_latitude
});
}
}, [storeInfo]);
useEffect(() => {
// Initialize the rating chart
if (!isEditing) {
const chartDom = document.getElementById('rating-chart');
if (chartDom) {
const myChart = echarts.init(chartDom);
const option = {
  animation: false,
  radar: {
  indicator: [
  { name: 'امتیاز فروشگاه', max: 5 },
  { name: 'امتیاز محصول ', max: 5 }
  ]
  },
  series: [{
    name: 'Ratings',
    type: 'radar',
    data: [{
      value: [storeInfo.average_rating, storeInfo.average_product_rating],
      name: 'Ratings',
      areaStyle: {
      color: 'rgba(25, 118, 210, 0.6)'
      },
      lineStyle: {
      color: '#1976D2'
      },
      itemStyle: {
      color: '#1976D2'
      }
    }]
  }]
};
myChart.setOption(option);
return () => {
myChart.dispose();
};
}
}
}, [isEditing, storeInfo.average_rating, storeInfo.average_product_rating]);
const [selectedProduct, setSelectedProduct] = useState(null);
const [isProductModalOpen, setIsProductModalOpen] = useState(false);
const [productEditData, setProductEditData] = useState({
    id: 0,
    name: '',
    description: '',
    quantity: 0,
    });
const [selectedFile, setSelectedFile] = useState(null);
const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        name: storeInfo.name,
        contact_info: { ...storeInfo.contact_info },
        description: storeInfo.description,
        location_longitude: storeInfo.location_longitude,
        location_latitude: storeInfo.location_latitude
    });
    }
};
const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setProductEditData({
        id:product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity
    });
    setIsProductModalOpen(true);
};
const handleProductModalClose = () => {
    setIsProductModalOpen(false);
    setSelectedProduct(null);
    setSelectedFile(null);
};
const handleProductInputChange = (e) => {
  const { name, value } = e.target;
  setProductEditData({ ...productEditData, [name]: value });
};
const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
  setSelectedFile(e.target.files[0]);
}
};
const handleUpdateProduct = async() => {
try {
  const response = await axiosInstance.put('/seller/product/update_product',
    {id: productEditData.id,
    name:productEditData.name,
    description:productEditData.description
  }, {
    headers: {
       'Accept': 'application/json'
    }
  });
 if (response.data) {
  console.log('updated ');
  await getSelfStoreProduct();
  handleProductModalClose();
 }
} catch (error) {
  console.log(error);
}
};
const handleUpdateQuantity = async() => {
    if (!selectedProduct) return;
    try {
      const response = await axiosInstance.put('/seller/product/update_product_quantity',{
        product_id: selectedProduct.id,
        quantity: productEditData.quantity
      }, {
        headers: {
           'Accept': 'application/json'
        }
      });
     if (response.data) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "موجودی بروزرسانی شد ",
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
      await getSelfStoreProduct();
      handleProductModalClose();
     }
    } catch (error) {
      console.log(error);
    }
};

const handleAskDeleteProduct = () => {
  showConfirmModal({
    title: 'حذف محصول',
    message: 'آیا مطمئن هستی می‌خوای این محصول رو حذف کنی؟ این عمل قابل بازگشت نیست.',
    onConfirm: handleDeleteProduct
  });
};
const handleAskRemovePic = () => {
  showConfirmModal({
    title: 'حذف عکس محصول',
    message: 'آیا مطمئن هستی می‌خوای عکس این محصول رو حذف کنی؟',
    onConfirm: handleRemovePic
  });
};
const handleAskUploadPic = () => {
  showConfirmModal({
    title: 'حذف عکس محصول',
    message: 'آیا مطمئن هستی می‌خوای عکس این محصول رو حذف کنی؟',
    onConfirm: handleUploadProductPic
  });
};



const handleDeleteProduct =async() => {
if (!selectedProduct) return;
console.log('Deleting product:', { product_id: selectedProduct.id });
try {
  const response = await axiosInstance.delete('/seller/product/delete_product', {
    headers: {
      'Accept': 'application/json'
    },
    data: {
      product_id: selectedProduct.id
    }
  });
  
  if (response.data) {
    console.log('deleted: ', response.data);
    await getSelfStoreProduct();
    setIsConfirmModalOpen(false)
    handleProductModalClose();
  }
} catch (error) {
  console.log(error);
}

};

const handleRemovePic = async () => {
  if (!selectedProduct) return;
  try {
    const response = await axiosInstance.put('/seller/product/remove_product_pic', {
      product_id: selectedProduct.id
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.data) {
      console.log('updated: ', response.data);
      await getSelfStoreProduct();
      handleProductModalClose();
      // optionally update local state if needed
    }
  } catch (error) {
    console.log(error);
  }
 
};

const handleUploadProductPic = async () => {
    if (!selectedProduct || !selectedFile) {
      alert("لطفاً ابتدا یک فایل انتخاب کنید.");
      return;
    }
    const formData = new FormData();
    formData.append("product_id", selectedProduct.id);
    formData.append("pic", selectedFile);

    try {
      const response = await axiosInstance.put('/seller/product/add_product_pic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data) {
         Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "تصویر بروزرسانی شد ",
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
        await getSelfStoreProduct();
        setSelectedFile(null);
        handleProductModalClose();
      }
    } catch (error) {
      console.error("خطا در آپلود تصویر:", error);
      alert("مشکلی در آپلود تصویر رخ داد.");
    }
    
};

const handleInputChange = (e) => {
const { name, value } = e.target;
setEditData({ ...editData, [name]: value });
};
const handleContactInfoChange = (key, value) => {
setEditData({
...editData,
contact_info: {
...editData.contact_info,
[key]: value
}
});
};
const handleSaveChanges = async() => {
  
setStoreInfo({
...storeInfo,
name: editData.name,
contact_info: editData.contact_info,
description: editData.description,
location_longitude: editData.location_longitude,
location_latitude: editData.location_latitude
});
try {
  const response = await axiosInstance.put('/seller/store/update_store_info',editData, {
    headers: {
       'Accept': 'application/json'
    }
  });
  console.log(response);
 if (response.data) {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: " بروزرسانی شد ",
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
  //await getSelfStoreProduct();
  // handleProductModalClose();
 }
} catch (error) {
  console.log(error);
}
setIsEditing(false);


};

const formatDate = (dateString) => {
const date = new Date(dateString);
return date.toLocaleDateString('en-US', {
year: 'numeric',
month: 'long',
day: 'numeric'
});
};

const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };
  
return (
<div dir='rtl'  className="min-h-screen bg-gradient-to-r from-blue-50 to-white">
{Cookies.get('auth_token') ?<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
{/* {Object.entries(storeInfo.contact_info || {}).map(([key, value]) => (
  <div key={key} className="flex">
    <span className="text-gray-500 capitalize w-24">{key}:</span>
    <span className="ml-6  text-gray-800">{value}</span>
  </div>
))} */}
{/* Store Information Card */}
<div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
<div className="p-6">
<div className="flex justify-between items-start mb-4">
<div>
<h2 className="text-2xl font-iran font-bold  text-gray-800">اطلاعات فروشگاه</h2>
<p className="text-gray-500">جزئیات و تنظیمات فروشگاه خود را مدیریت کنید</p>
</div>
<button
onClick={handleEditToggle}
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center !rounded-button whitespace-nowrap cursor-pointer"
>
{isEditing ? (
  <>
    <FaTimes className="ml-2" />
    لغو ویرایش
  </>
) : (
  <>
    <FaEdit className="ml-2" />
    ویرایش اطلاعات
  </>
)}

</button>
</div>
{isEditing ? (
<div className="space-y-6">
<div>
<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
نام فروشگاه
</label>
<input
type="text"
id="name"
name="name"
value={editData.name}
onChange={handleInputChange}
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
/>
</div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
        توضیحات فروشگاه
        </label>
        <textarea
        id="description"
        name="description"
        rows={4}
        value={editData.description}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        ></textarea>
      </div>
      <div>
        <div className="space-y-3">
            {Object.entries(editData.contact_info).map(([key, value]) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                  <span className="text-gray-600 capitalize">{key}:</span>
                </div>
                <div className="md:col-span-2">
                  <input
                  type="text"
                  value={value}
                  onChange={(e) => handleContactInfoChange(key, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            ))}
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center cursor-pointer whitespace-nowrap !rounded-button">
            <FaPlus className="ml-1" /> افزودن
          </button>

        </div>
      </div>
    <div>
    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center cursor-pointer whitespace-nowrap !rounded-button">
    <FaMapMarkerAlt className="ml-2 text-blue-600" />
    تغییر موقعیت فروشگاه
    </button>
    </div>
    <div className="flex justify-end">
    <button
    onClick={handleSaveChanges}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer whitespace-nowrap !rounded-button"
    >
    ذخیره تغییرات
    </button>
    </div>
  </div>
  ) : (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2 space-y-6">
  <div>
  <h3 className="text-xl font-bold text-gray-800 mb-2">{storeInfo.name}</h3>
  <div className="flex items-center mb-4">
  <div className="flex ml-3">
  {renderStars(storeInfo.average_rating)}
  </div>
  <span className="text-gray-600 text-sm pt-1">
  {(storeInfo.average_rating ?? 0).toFixed(1)}
  </span>
  </div>
  <p className="text-gray-600 text-justify">{storeInfo.description}</p>
  </div>
  <div>
  <h4 className="text-md font-semibold text-gray-700 mb-3">اطلاعات تماس</h4>
  <div className="space-y-2">
        {Object.entries(storeInfo.contact_info).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="text-gray-500 capitalize w-24">{key}:</span>
            <span className="text-gray-800 mr-1">{value}</span>
          </div>
        ))}
  </div>
  </div>
  <div>
  <h4 className="text-md font-semibold text-gray-700 mb-3">وضعیت </h4>
  <div className="flex items-center">
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${storeInfo.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
  <span className={`w-2 h-2 rounded-full ml-2 ${storeInfo.is_banned ? 'bg-red-600' : 'bg-green-600'}`}></span>
  {storeInfo.is_banned ? 'مسدود شده' : 'فعال'}
  </span>
  </div>
  </div>
  </div>
  <div className="lg:col-span-1">
      <h4 className="text-md font-semibold text-gray-700 mb-3"> رتبه‌بندی عملکرد</h4>
      <div id="rating-chart" className="w-full h-64"></div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs text-blue-600 font-medium mb-1">امتیاز فروشگاه </div>
          <div className="text-2xl font-bold text-blue-800">{(storeInfo.average_rating ?? 0).toFixed(1)}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs text-blue-600 font-medium mb-1">امتیاز محصولات</div>
          <div className="text-2xl font-bold text-blue-800">{(storeInfo.average_product_rating ?? 0).toFixed(1)}</div>
        </div>
      </div>
  </div>
  </div>
  )}
  </div>
</div>
{/* Products Section */}
<div className="mb-8">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0 lg:space-x-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">محصولات</h2>
        <p className="text-gray-500">مدیریت محصولات فروشگاه</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={()=>navigate('/AddProduct')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center cursor-pointer whitespace-nowrap !rounded-button">
          <FaPlus  className="ml-2" /> افزودن محصول
        </button>
      </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {filteredProducts.map((product) => (
      <ProductCard
      key={product.id}
      product={product}
      onEdit={handleProductEdit}
      onView={openProductModal}
      formatDate={formatDate}
    />    
    ))}
  </div>
</div>
</main> : <UnauthorizedPage/>}

{/* Product Edit Modal */}
{isProductModalOpen && selectedProduct && (
  <EditProductModal
    selectedProduct={selectedProduct}
    selectedFile={selectedFile}
    productEditData={productEditData}
    onClose={handleProductModalClose}
    onChange={handleProductInputChange}
    onFileChange={handleFileChange}
    onUpdateQuantity={handleUpdateQuantity}
    onDelete={handleAskDeleteProduct}
    onRemovePic={handleAskRemovePic}
    onSave={handleUpdateProduct}
    clearSelectedFile={() => setSelectedFile(null)}
    handleUploadProductPic ={handleAskUploadPic}
  />
)}

<ConfirmModal
  isOpen={confirmModalConfig.isOpen}
  title={confirmModalConfig.title}
  message={confirmModalConfig.message}
  onConfirm={confirmModalConfig.onConfirm}
  onCancel={closeConfirmModal}
/>
<SelfProductModal   selectedProduct={modalProduct}
  isModalOpen={isModalOpen}
  comments={comments}
  chartRef={chartRef}
  closeProductModal={closeProductModal}
  getCityName={(id) => 'نام شهر'} // اگر لازم نیست واقعی باشه
  formatDate={formatDate}
  toggleFavorite={() => {}} // چون در صفحه فروشنده نیست
  favorites={[]} // خالی می‌تونه بمونه
  />
</div>
);
};
export default SelfStore