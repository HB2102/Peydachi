// src/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const BASE_URL = "http://127.0.0.1:8000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// هندل کردن درخواست ها
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');

    // 👇 اگر در ریکوئست گفتیم Authorization=null، باید حذفش کنیم
    if (config.headers && config.headers.Authorization === null) {
      delete config.headers.Authorization;
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// هندل کردن پاسخ ها
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if ((error.response?.status === 401 || error.response?.status === 406) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) {
          console.error("No refresh token available.");
          forceLogout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${BASE_URL}/authentication/refresh_token`, {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          }
        });

        if (res.status === 200) {
          const newAccessToken = res.data;
          Cookies.set('auth_token', newAccessToken, { expires: 3, secure: true, sameSite: 'Strict' });

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } else {
          forceLogout();
          return Promise.reject(error);
        }

      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        forceLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// تابع logout حرفه‌ای با SweetAlert
// function forceLogout() {
//   Cookies.remove('auth_token');
//   Cookies.remove('refresh_token');

//   Swal.fire({
//     title: 'اتمام دسترسی',
//     text: 'مدت زمان دسترسی شما تمام شده، لطفاً دوباره وارد شوید.',
//     icon: 'warning',
//     confirmButtonText: 'باشه',
//     confirmButtonColor: '#3085d6',
//     timer: 3000,
//     timerProgressBar: true,
//     toast: false,
//     position: 'center'
//   }).then(() => {
//     window.location.href = "/login";
//   });
// }

export default axiosInstance;
