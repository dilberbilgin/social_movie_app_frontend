'use client';

import { useState } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { UserRegistrationRequest } from '@/types'; // Tipleri buradan alıyoruz

export default function RegisterPage() {
  const [formData, setFormData] = useState<UserRegistrationRequest>({
    username: '',
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { t } = useTranslation();
  const { login } = useAuth(); // AuthContext'e erişim

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. ADIM: Backend'e kayıt isteği gönder (signup)
      const res = await authService.signup(formData);

      if (res.success) {
        /* STRATEJİ: Kullanıcı deneyimini artırmak için kayıt olan kullanıcıyı 
           tekrar giriş sayfasına göndermiyoruz. Backend signup sonrası 
           UserResponse dönüyor. Eğer Backend signup anında token dönmüyorsa 
           (senin UserResponse interface'inde token yok), 2 seçenek kalır:
           A) /login sayfasına yönlendir (Senin eski yöntemin)
           B) Kayıt sonrası otomatik bir de login isteği at (En profesyoneli)
        */

        // Senin mevcut Backend yapına göre (UserResponse token içermiyor):
        // Hemen ardından bir login isteği atıyoruz ki kullanıcı "tık" diye girsin.
        const loginRes = await authService.login({
          username: formData.username,
          password: formData.password
        });

        if (loginRes.success) {
          login({ username: loginRes.data.username }, loginRes.data.token);
          router.push('/');
        } else {
          // Login otomatik olamazsa yönlendir
          router.push('/login');
        }
      } else {
        // Backend'den gelen spesifik hata mesajı (Örn: "User already exists")
        setError(res.message);
      }
    } catch (err: any) {
      // 400 Hatalarında Backend genellikle validationErrors döner
      const backendError = err.response?.data?.message;
      setError(backendError || t("auth.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-yellow-500 mb-2 text-center">
          {t('auth.registerTitle')}
        </h1>
        
        {error && (
          <p className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/50 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          {/* Input alanları senin JSON çeviri anahtarlarınla besleniyor */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">{t('auth.username')}</label>
            <input 
              type="text"
              disabled={loading}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">{t('auth.email')}</label>
            <input 
              type="email"
              disabled={loading}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">{t('auth.password')}</label>
            <input 
              type="password"
              disabled={loading}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded transition-all active:scale-95 mt-4 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t('auth.processing') || 'Loading...'}
              </span>
            ) : t('auth.signupBtn')}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          {t('auth.alreadyHaveAccount')}{" "}
          <Link href="/login" className="text-yellow-500 hover:underline">
            {t('auth.loginNow')}
          </Link>
        </p>
      </div>
    </div>
  );
}