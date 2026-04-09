import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR: İstek gönderilirken çalışır
api.interceptors.request.use((config) => {
  // 1. Dil Yönetimi
  const lang =
    typeof window !== "undefined" ? localStorage.getItem("lang") || "en" : "en";
  config.headers["Accept-Language"] = lang;
  config.params = { ...config.params, lang };

  // 2. Token Yönetimi
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Sadece gerçek ve geçerli bir token varsa header'a ekle
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR: Yanıt dönerken çalışır
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Eğer backend 401 (Yetkisiz) dönerse, bozuk token'ı temizle
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Kullanıcıyı login sayfasına atmak istersen:
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
