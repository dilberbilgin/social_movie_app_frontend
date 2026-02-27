// "use client";

// import { useState } from "react";
// import { CommentResponse } from "@/types";
// import { useTranslation } from "@/context/LanguageContext";
// import { useAuth } from "@/context/AuthContext";
// import { commentService } from "@/services/commentService"; // Bunu birazdan oluşturacağız
// import Link from "next/link";

// interface CommentSectionProps {
//   movieId: string;
//   initialComments: CommentResponse[];
// }

// export default function CommentSection({
//   movieId,
//   initialComments,
// }: CommentSectionProps) {
//   const { t } = useTranslation();
//   const { user } = useAuth();
//   const [comments, setComments] = useState<CommentResponse[]>(initialComments);
//   const [newComment, setNewComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleCommentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) return alert(t("auth.loginRequired")); // Basit bir kontrol
//     if (!newComment.trim()) return;

//     setIsSubmitting(true);
//     try {
//       const res = await commentService.addComment({
//         movieId,
//         content: newComment,
//       });

//       if (res.success) {
//         setComments([res.data, ...comments]); // Yeni yorumu listenin başına ekle
//         setNewComment("");
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="space-y-6">
//       <h2 className="text-2xl font-bold text-yellow-500">
//         {t("movie.comments")}
//       </h2>

//       {/* Yorum Yazma Formu */}
//       {user ? (
//         <form
//           onSubmit={handleCommentSubmit}
//           className="space-y-4 bg-gray-800 p-4 rounded-xl border border-gray-700"
//         >
//           <textarea
//             className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-all"
//             rows={3}
//             placeholder={t("movie.addCommentPlaceholder")}
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             disabled={isSubmitting}
//           />
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
//           >
//             {isSubmitting ? t("common.sending") : t("movie.sendComment")}
//           </button>
//         </form>
//       ) : (
//         <div className="bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-600 text-center text-gray-400">
//           {t("movie.loginToComment")}
//         </div>
//       )}

//       {/* Yorum Listesi */}
//       <div className="space-y-4">
//         {comments.map((comment) => (
//           <div
//             key={comment.id}
//             className="bg-gray-800 p-4 rounded-xl border border-gray-700"
//           >
//             <div className="flex justify-between items-center mb-2">
//               {/* <span className="font-bold text-yellow-500">{comment.username}</span> */}
//               <Link
//                 href={`/profile/${comment.username}`}
//                 className="text-yellow-500 hover:underline"
//               >
//                 {comment.username}
//               </Link>
//               <span className="text-xs text-gray-500">
//                 {new Date(comment.createdDate).toLocaleDateString()}
//               </span>
//             </div>
//             <p className="text-gray-300">{comment.content}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }



// ------------------------------------------------------------



// "use client";

// import { useState } from "react";
// import { CommentResponse, PageResponse } from "@/types";
// import { useTranslation } from "@/context/LanguageContext";
// import { useAuth } from "@/context/AuthContext";
// import { commentService } from "@/services/commentService";
// import Link from "next/link";
// import CommentItem from "./CommentItem";

// interface CommentSectionProps {
//   movieId: string;
//   // Başlangıçta gelen veriyi PageResponse tipinde alıyoruz
//   initialData: PageResponse<CommentResponse>;
// }

// export default function CommentSection({ movieId, initialData }: CommentSectionProps) {
//   const { t } = useTranslation();
//   const { user } = useAuth();

//   // State yönetimi
//   const [commentPage, setCommentPage] = useState<PageResponse<CommentResponse>>(initialData);
//   const [newComment, setNewComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);

//   // Yorum Gönderme
//   // const handleCommentSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (!user || !newComment.trim()) return;

//   //   setIsSubmitting(true);
//   //   try {
//   //     const res = await commentService.addComment({ movieId, content: newComment });
//   //     if (res.success) {
//   //       // Yeni yorumu listenin en başına ekliyoruz
//   //       setCommentPage(prev => ({
//   //         ...prev,
//   //         content: [res.data, ...prev.content],
//   //         totalElements: prev.totalElements + 1
//   //       }));
//   //       setNewComment("");
//   //     }
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };
//   const handleCommentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !newComment.trim()) return;

//     setIsSubmitting(true);
//     try {
//       const res = await commentService.addComment({ movieId, content: newComment });
//       if (res.success) {
//         setCommentPage(prev => {
//           // Eğer eklemek istediğimiz ID kazara zaten listede varsa ekleme yapma
//           const isAlreadyInList = prev.content.some(c => c.id === res.data.id);
//           if (isAlreadyInList) return prev;

//           return {
//             ...prev,
//             content: [res.data, ...prev.content],
//             totalElements: prev.totalElements + 1
//           };
//         });
//         setNewComment("");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Daha Fazla Yükle (Instagram Stili)
//   const handleLoadMore = async () => {
//     if (commentPage.last || isLoadingMore) return;

//     setIsLoadingMore(true);
//     try {
//       // Bir sonraki sayfayı çağır (current number + 1)
//       const nextPage = commentPage.number + 1;
//       const res = await commentService.getMovieComments(movieId, nextPage);
      
//       // if (res.success) {
//       //   setCommentPage(prev => ({
//       //     ...res.data,
//       //     // Önceki yorumlarla yeni gelenleri birleştir
//       //     content: [...prev.content, ...res.data.content]
//       //   }));
//       // }
//       if (res.success) {
//         setCommentPage(prev => {
//           // Mevcut ID'leri bir Set içine alıyoruz (hızlı arama için)
//           const existingIds = new Set(prev.content.map(c => c.id));
          
//           // Yeni gelenlerden sadece bizde OLMAYANLARI filtreliyoruz
//           const newUniqueComments = res.data.content.filter(c => !existingIds.has(c.id));

//           return {
//             ...res.data, // Yeni sayfa bilgilerini al (page number, last vs.)
//             content: [...prev.content, ...newUniqueComments] // Eskiler + Sadece yeni benzersizler
//           };
//         });
//       }
//     } finally {
//       setIsLoadingMore(false);
//     }
//   };

//   return (
//     <section className="space-y-8 mt-12 border-t border-gray-800 pt-10">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-white flex items-center gap-2">
//           <span className="text-yellow-500">💬</span> {t("movie.comments")} 
//           <span className="text-sm font-normal text-gray-500">({commentPage.totalElements})</span>
//         </h2>
//       </div>

//       {/* Yorum Yazma Formu */}
//       {user ? (
//         <form onSubmit={handleCommentSubmit} className="group relative">
//           <textarea
//             className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl p-4 text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all resize-none"
//             rows={3}
//             placeholder={t("movie.addCommentPlaceholder")}
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             disabled={isSubmitting}
//           />
//           <div className="flex justify-end mt-2">
//             <button
//               type="submit"
//               disabled={isSubmitting || !newComment.trim()}
//               className={`bg-yellow-500 text-black px-6 py-2 rounded-xl font-bold transition-all active:scale-95 
//     ${isSubmitting || !newComment.trim() 
//       ? "opacity-50 cursor-not-allowed" 
//       : "hover:bg-yellow-400 cursor-pointer"}`}>
//               {isSubmitting ? "..." : t("movie.sendComment")}
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="bg-gray-800/30 p-6 rounded-2xl border border-dashed border-gray-700 text-center">
//            <p className="text-gray-400 mb-2">{t("movie.loginToComment")}</p>
//            <Link href="/login" className="text-yellow-500 font-bold hover:underline">Login</Link>
//         </div>
//       )}

//       {/* Yorum Listesi */}
//       <div className="space-y-6">
//         {commentPage.content.map((comment) => (
//           <div key={comment.id} className="flex gap-4 group animate-in fade-in duration-500">
//             <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-lg border border-gray-600">
//               👤
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-1">
//                 <Link href={`/profile/${comment.username}`} className="font-bold text-sm text-yellow-500 hover:text-yellow-400 transition-colors">
//                   {comment.username}
//                 </Link>
//                 <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
//                   {new Date(comment.createdDate).toLocaleDateString()}
//                 </span>
//               </div>
//               <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
              
//               {/* Yanıt Butonu (Şimdilik görsel) */}
//               <button className="text-[10px] font-bold text-gray-500 mt-2 hover:text-white transition-colors">
//                 REPLY
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Daha Fazla Yükle Butonu */}
//       {!commentPage.last && (
//         <div className="flex justify-center pt-4">
//           <button
//             onClick={handleLoadMore}
//             disabled={isLoadingMore}
//             className="text-sm font-bold text-gray-400 hover:text-yellow-500 transition-colors py-2 px-8 rounded-full border border-gray-800 hover:border-yellow-500/50"
//           >
//             {isLoadingMore ? "..." : "Load More Comments"}
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }


"use client";

import { useState } from "react";
import { CommentResponse, PageResponse } from "@/types";
import { commentService } from "@/services/commentService";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import CommentItem from "./CommentItem";

export default function CommentSection({ movieId, initialData }: { movieId: string, initialData: PageResponse<CommentResponse> }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [commentPage, setCommentPage] = useState(initialData);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sayfa yenilemeden verileri tazeleyen fonksiyon
  const refreshComments = async () => {
    const res = await commentService.getMovieComments(movieId, 0); // İlk sayfayı çek
    if (res.success) {
      setCommentPage(res.data);
    }
  };

  const handleMainCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    
    try {
      // Ana yorumda parentId GÖNDERMİYORUZ (400 hatası almamak için)
      const res = await commentService.addComment({ movieId, content: newComment });
      if (res.success) {
        setNewComment("");
        refreshComments(); // Sayfayı yenilemeden listeyi tazele
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t border-gray-800 pt-10 pb-20">
      <h2 className="text-2xl font-bold text-white mb-8">
        💬 {t("movie.comments")} ({commentPage.totalElements})
      </h2>

      {/* Ana Yorum Formu (Sadece en üstte) */}
      {user && (
        <form onSubmit={handleMainCommentSubmit} className="mb-10 space-y-3">
          <textarea
            className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl p-4 text-white focus:border-yellow-500 outline-none"
            placeholder={t("movie.addCommentPlaceholder")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-8 py-2 rounded-xl font-bold">
              {isSubmitting ? "..." : t("movie.sendComment")}
            </button>
          </div>
        </form>
      )}

      {/* Yorum Listesi */}
      <div className="space-y-2">
        {commentPage.content.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            movieId={movieId} 
            onCommentUpdated={refreshComments} 
          />
        ))}
      </div>
    </section>
  );
}
