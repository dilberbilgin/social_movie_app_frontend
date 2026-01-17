🎬 Social Movie Club - Frontend Geliştirme Rehberi (V1.0)
Bu rehber, projenin başlangıcından Auth ve i18n sistemlerinin kurulumuna kadar olan süreci ve mimari kararları belgeler.

1. Başlangıç ve Kurulum
Proje, modern web standartlarını karşılamak amacıyla Next.js 14+ (App Router) mimarisi üzerine inşa edildi.

Teknoloji Yığını: React, Next.js, TypeScript, Tailwind CSS.

Paket Yönetimi: npm kullanıldı.

API İletişimi: axios kütüphanesi kuruldu (npm install axios).

Dosya Konumu: Proje, ana klasörün altında social-movie-frontend (veya senin isimlendirdiğin haliyle) ayrı bir dizinde durur. Backend projesinden bağımsız çalışır.

2. Klasör Yapısı ve Mimari
SOLID prensiplerine uygun olarak sorumluluklar ayrıştırılmıştır:

src/app/: Sayfalar (Routes) ve Layout burada bulunur. Her klasör (örn: /login) bir URL'e karşılık gelir.

src/components/: Tekrar kullanılabilir arayüz parçaları (Navbar, MovieCard vb.).

src/context/: Uygulamanın "beyni" olan global durum yönetimi (Auth, Dil seçimi).

src/services/: API çağrılarının (Axios) toplandığı yer.

src/locales/: Dil çeviri dosyaları (JSON).

src/types/: TypeScript interface tanımlamaları (Backend DTO karşılıkları).

3. Önemli Sistemler ve Nasıl Kullanılırlar?
A. Çok Dillilik (i18n) - LanguageContext
Backend'deki messages.properties yapısını Frontend'de simüle ettik.

Kullanım: Bir bileşende metin yazmak yerine const { t } = useTranslation(); hook'u çağrılır.

Dikkat: t('auth.loginTitle') şeklinde çağrılan anahtar, locales/tr.json ve en.json dosyalarında mutlaka tanımlı olmalıdır.

B. Kimlik Doğrulama - AuthContext
Giriş yapan kullanıcının bilgisini tüm uygulamaya yayar.

Mekanizma: Giriş başarılı olduğunda login(user, token) fonksiyonu çalışır; bu hem localStorage'ı günceller hem de username state'ini değiştirerek Navbar'ın anında güncellenmesini sağlar.

Güvenlik: API isteklerinde Token gönderimi services/api.ts içindeki Interceptor ile otomatikleştirilmiştir.

4. Geliştirme Kuralları (Clean Code & Solid)
Hardcoded Metin Yasak: Hiçbir .tsx dosyasına direkt "Giriş Yap" yazılmaz. Mutlaka i18n (t()) kullanılır.

İsimlendirme Uyumu: Backend'de metot ismi signup ise, Frontend servis katmanında da signup kullanılır. URL'ler (/register) kullanıcı dostu kalabilir.

Hydration Kontrolü: Tarayıcı eklentilerinin (ColorZilla vb.) HTML yapısını bozup hata verdirmemesi için layout.tsx içinde suppressHydrationWarning kullanılır.

Z-Index & Layout: Navbar gibi her zaman üstte durması gereken elemanlar için z-50 ve sticky top-0 standartları uygulanır.

5. Sorun Giderme (Troubleshooting)
Görsel Bozulmalar: Eğer CSS çalışmıyorsa layout.tsx dosyasında import './globals.css' satırının en üstte olduğunu kontrol et.

Login Oldum Ama İsim Gelmedi: AuthContext içindeki login fonksiyonunun tetiklendiğinden ve AuthProvider'ın layout.tsx'de her şeyi sarmaladığından emin ol.

6. İleri Seviye Mimari: Custom Hooks & Component Atomic Design Proje büyüdükçe page.tsx dosyalarının şişmesini önlemek için şu strateji benimsenmiştir:

Logic Isolation (Hooks): Veri çekme ve state yönetimi gibi mantıksal işlemler src/hooks/ altına taşınır (Örn: useMovieDetail). Sayfa sadece veriyi görselleştirir.

Atomic Components: Büyük UI blokları (MovieHero, MovieStats) kendi bağımsız dosyalarına bölünür. Bu, Single Responsibility prensibini sağlar.

Prop Injection: Bileşenler, veriyi doğrudan API'den çekmez; sayfadan (Parent) prop olarak alır. Bu, bileşenlerin test edilebilirliğini ve tekrar kullanılabilirliğini artırır.