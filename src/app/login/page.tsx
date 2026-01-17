"use client";

import { useState } from "react";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext"; // Eksik olan import

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Clean Code: Kullanıcıya işlem yapıldığını hissettir

  const router = useRouter();
  const { t } = useTranslation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // İşlem başladı
    try {
      const res = await authService.login(formData);
      if (res.success) {
        // // Hem localStorage hem State tek merkezden güncelleniyor
        // login(res.data.username, res.data.token);
        // username yerine tüm objeyi (veya ismi içeren bir objeyi) gönderiyoruz
        const userData = { username: res.data.username };

        // Context'e veriyi paslıyoruz (Single Responsibility)
        login(userData, res.data.token);
        router.push("/"); // Başarılıysa evine dön
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(t("auth.errorGeneric"));
    } finally {
      setLoading(false); // İşlem bitti (hata olsa da olmasa da)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6 text-center">
          {t("auth.loginTitle")}
        </h1>

{/* Hata Mesajı Alanı: Sadece hata varsa render edilir */}
        {error && (
          //<div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/50 text-center">
          <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm border border-red-500/50 text-center animate-pulse">  
          {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              {t("auth.username")}
            </label>
            <input
              type="text"
              disabled={loading} // İşlem sırasında inputu kilitle
             // className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-yellow-500"
             className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all" 
             onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">
              {t("auth.password")}
            </label>
            <input
              type="password"
              disabled={loading}
              //className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:border-yellow-500"
              className="w-full bg-gray-700 border border-gray-600 rounded p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
          //   className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded transition-all active:scale-95 mt-4"
          // >
          className={`w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 rounded transition-all active:scale-95 mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {/* {t("auth.loginBtn")} */}
            {loading ? t("auth.processing") : t("auth.loginBtn")}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6 text-sm">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-yellow-500 hover:underline">
            {t("auth.signupNow")}
          </Link>
        </p>
      </div>
    </div>
  );
}
