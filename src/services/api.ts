import axios from 'axios';

//  Backend bağlantı ayarları
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot adresi
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Interceptor (Haberci): Her istekten önce çalışır
api.interceptors.request.use((config) => {
  // 1. LocalStorage'dan seçili dili al, yoksa 'en' kullan (Defaulting)
  const lang = typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en';
  
  // 2. Her isteğe bu dili ekle (Backend'in messages.properties'i seçmesi için)
  config.headers['Accept-Language'] = lang;

  // URL Parametresi eklemesi (TMDB verileri ve veritabanı çevirileri için)
  // Bu sayede tüm isteklerin sonuna otomatik olarak ?lang=tr eklenir
  config.params = {
    ...config.params,
    lang: lang
  };
  
  // 3. Token varsa ekle
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;
