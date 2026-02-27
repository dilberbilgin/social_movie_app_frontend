🎬 Social Movie Club - Frontend Geliştirme Rehberi (V1.1)
Bu rehber, başlangıç kurulumundan itibaren Auth sistemi, çok dillilik (i18n), gelişmiş arama mekanizmaları ve film detay bileşenlerinin mimari kararlarını belgeler.

1. Başlangıç ve Mimari Yaklaşım
Proje, Next.js 14+ (App Router) mimarisi üzerine, backend ile tam senkronize ve SOLID prensiplerine sadık kalınarak inşa edilmiştir.

Teknoloji Yığını: React, Next.js, TypeScript, Tailwind CSS, Axios.

API İletişimi: services/api.ts içerisinde tanımlanan Axios interceptor yapısı ile tüm isteklere Authorization (Token) ve Accept-Language (Dil) header'ları otomatik eklenir.

Hydration Kontrolü: Tarayıcı uyumsuzluklarını önlemek için layout.tsx içerisinde suppressHydrationWarning kullanılmıştır.

2. Klasör Yapısı ve Sorumlulukların Dağılımı (SOLID)
Proje yapısı, her birimin tek bir sorumluluğu olması (Single Responsibility) üzerine kurulmuştur:

src/app/: Rotalar (Pages). Logic içermez, sadece bileşenleri birleştirir.

src/components/movie/: Atomik bileşenler (Hero, Stats, Description). Her biri sadece veriyi görselleştirir.

src/context/: Uygulamanın global durumu (Auth ve Language).

src/services/: Backend ile konuşan tek katman.

src/hooks/: Veri çekme ve filtreleme mantığının (Logic) sayfalardan ayrıştırıldığı yer (Örn: useMovies).

3. Gelişmiş Sistemler ve Algoritmalar
A. Çok Dillilik (i18n) & Dinamik Veri
Backend'den gelen dile duyarlı veriler (film açıklamaları vb.) ile arayüzdeki statik metinler LanguageContext üzerinden yönetilir.

Mantık: Kullanıcı dil değiştirdiğinde useEffect tetiklenir ve tüm API çağrıları yeni dil parametresiyle (Header üzerinden) tekrarlanır.

B. Arama Algoritması ve Debounce Mekanizması
Keşfet (/explore) sayfasında kullanıcı her harf yazdığında backend'e istek atılmasını engellemek için Debounce algoritması uygulanmıştır.

Matematiksel Mantık: Kullanıcı yazmayı bıraktıktan sonra bir setTimeout (500ms) başlatılır. Eğer kullanıcı süre dolmadan yeni bir tuşa basarsa mevcut zamanlayıcı clearTimeout ile silinir ve süreç baştan başlar.

Fayda: Sunucu yükünü %80'e kadar azaltır ve akıcı bir kullanıcı deneyimi sunar.

C. Dinamik Filtreleme (Specification Pattern)
Keşfet sayfasındaki Tür (Genre) ve Başlık filtreleri, Backend'deki Specification yapısı ile konuşur.

Backend İlişkisi: movieService.searchMovies metodu, URL query parametrelerini (?title=...&genreId=...) oluşturur ve backend bu parametreleri dinamik sorguya dönüştürür.

4. Bileşen Ekosistemi ve Kullanım Amaçları
Bileşen,Sayfa,Amacı
MovieHero,Detay (/movies/[id]),Filmin dev posterini ve ana başlığını görselleştirir.
MovieStats,Detay,IMDb ve Club puanlarını yan panelde özetler.
RatingAction,Detay,İnteraktif puanlama paneli (1-10 arası).
MovieRow,Ana Sayfa (/),Yatay kaydırılabilir (Horizontal Scroll) film şeritleri oluşturur.
CommentSection,Detay,Kullanıcı yorumlarının listelendiği ve yazıldığı alan.

5. Geliştirme Kuralları (Clean Code)
Hardcoded Yasak: Hiçbir metin doğrudan dosyaya yazılmaz, mutlaka locales/ üzerinden t() fonksiyonu ile çağrılır.

Prop Injection: Bileşenler veriyi kendi çekmez; veriyi üst sayfadan (Parent) prop olarak alır. Bu sayede aynı bileşen (örn: MovieCard) hem Keşfet'te hem de Profil'de kullanılabilir.

State Management: Login durumu AuthContext içindedir. Başarılı girişte hem localStorage güncellenir hem de Navbar anında reaksiyon verir.

6. Gelecek Planı (Next Steps)
Rota 1: Sosyal Profil: Kullanıcının geçmiş aktivitelerini (puanlar ve yorumlar) listeleyeceği alan.

Rota 2: İzleme Listesi (Watchlist): "Daha sonra izle" mantığının CRUD işlemlerinin entegrasyonu.