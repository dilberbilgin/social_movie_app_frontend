import axios from 'axios';

//  Backend bağlantı ayarları
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Spring Boot adresi
  headers: {
    'Content-Type': 'application/json',
  },
});

// //  Interceptor (Haberci): Her istekten önce çalışır
// api.interceptors.request.use((config) => {
//   // 1. LocalStorage'dan seçili dili al, yoksa 'en' kullan (Defaulting)
//   const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';
  
//   // 2. Her isteğe bu dili ekle (Backend'in messages.properties'i seçmesi için)
//   config.headers['Accept-Language'] = lang;

//   // URL Parametresi eklemesi (TMDB verileri ve veritabanı çevirileri için)
//   // Bu sayede tüm isteklerin sonuna otomatik olarak ?lang=tr eklenir
//   config.params = {
//     ...config.params,
//     lang: lang
//   };
  
//   // 3. Token varsa ekle
//   const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
  
//   return config;
// });

api.interceptors.request.use((config) => {
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';
  config.headers['Accept-Language'] = lang;

  // Sadece ihtiyacı olan istekler için params ekle
  config.params = { ...config.params, lang };

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // EĞER TOKEN VARSA VE "null" STRİNG DEĞİLSE EKLE
  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 401 HATASI ALIRSAK TOKEN'I SİL (Interceptor Response)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token'); // Geçersiz token'ı temizle
      // Opsiyonel: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
