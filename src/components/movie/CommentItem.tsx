// "use client";

// import { useState } from "react";
// import { CommentResponse } from "@/types";
// import { commentService } from "@/services/commentService";
// import { useTranslation } from "@/context/LanguageContext";
// import Link from "next/link";

// interface CommentItemProps {
//   comment: CommentResponse;
//   movieId: string;
//   isReply?: boolean;
//   onCommentUpdated: () => void;
// }

// export default function CommentItem({ comment, movieId, isReply = false, onCommentUpdated }: CommentItemProps) {
//   const { t } = useTranslation();
//   // Varsayılan olarak kapalı kalsın (Instagram stili)
//   const [showReplies, setShowReplies] = useState(false); 
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleReplySubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!replyText.trim()) return;
    
//     setIsSubmitting(true);
//     try {
//       const res = await commentService.addComment({
//         movieId,
//         content: replyText,
//         parentId: comment.id 
//       });

//       if (res.success) {
//         setReplyText("");
//         setIsReplying(false);
//         setShowReplies(true); // Yanıt gelince otomatik göster
//         onCommentUpdated(); 
//       }
//     } catch (err) {
//       console.error("Reply error:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={`mt-6 ${isReply ? "ml-8 md:ml-12 border-l border-gray-800 pl-4" : ""}`}>
//       <div className="flex gap-3">
//         <div className={`${isReply ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg"} rounded-full bg-gray-700 shrink-0 flex items-center justify-center border border-gray-600`}>
//           👤
//         </div>
//         <div className="flex-1">
//           <div className="flex items-center gap-2 mb-1">
//             <Link href={`/profile/${comment.username}`} className="font-bold text-xs text-yellow-500 hover:underline">
//               {comment.username}
//             </Link>
//             <span className="text-[10px] text-gray-500">
//               {new Date(comment.createdDate).toLocaleDateString()}
//             </span>
//           </div>
//           <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
          
//           <button 
//             onClick={() => setIsReplying(!isReplying)}
//             className="text-[10px] font-bold text-gray-500 mt-2 hover:text-white uppercase tracking-widest"
//           >
//             {isReplying ? t("comment.cancel") || "VAZGEÇ" : t("comment.reply") || "YANITLA"}
//           </button>

//           {/* Yanıt Kutusu */}
//           {isReplying && (
//             <form onSubmit={handleReplySubmit} className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
//               <textarea 
//                 autoFocus
//                 className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-yellow-500 outline-none"
//                 placeholder={`@${comment.username}...`}
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//               />
//               <div className="flex justify-end">
//                 <button 
//                   type="submit"
//                   disabled={isSubmitting || !replyText.trim()}
//                   className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black px-4 py-1.5 rounded-lg text-xs font-black transition-all"
//                 >
//                   {isSubmitting ? "..." : t("movie.sendComment") || "Gönder"}
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* ALT YANITLAR BUTONU VE LİSTESİ */}
//           {comment.replies && comment.replies.length > 0 && (
//             <div className="mt-3">
//               <button 
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="flex items-center gap-2 text-[10px] text-gray-500 font-bold hover:text-gray-300 transition-colors"
//               >
//                 <span className="w-6 h-px bg-gray-700"></span>
//                 {showReplies 
//                   ? t("comment.hideReplies") || "Yanıtları gizle" 
//                   : `${t("comment.viewReplies") || "Yanıtları gör"} (${comment.replies.length})`
//                 }
//               </button>

//               {showReplies && (
//                 <div className="mt-2 space-y-2 animate-in fade-in duration-300">
//                   {comment.replies.map(reply => (
//                     <CommentItem 
//                       key={reply.id} 
//                       comment={reply} 
//                       movieId={movieId} 
//                       isReply={true} 
//                       onCommentUpdated={onCommentUpdated} 
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // "use client";

// // import { useState } from "react";
// // import { CommentResponse } from "@/types";
// // import { commentService } from "@/services/commentService";
// // import { useTranslation } from "@/context/LanguageContext";
// // import Link from "next/link";

// // interface CommentItemProps {
// //   comment: CommentResponse;
// //   movieId: string;
// //   isReply?: boolean;
// //   onCommentUpdated: () => void;
// // }

// // export default function CommentItem({ comment, movieId, isReply = false, onCommentUpdated }: CommentItemProps) {
// //   const { t } = useTranslation();
// //   const [showReplies, setShowReplies] = useState(false); 
// //   const [isReplying, setIsReplying] = useState(false);
// //   const [replyText, setReplyText] = useState("");
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   // --- LIKE / DISLIKE İŞLEMİ ---
// //   const handleReaction = async (isLike: boolean) => {
// //     try {
// //       if (isLike) {
// //         await commentService.toggleLike(comment.id);
// //       } else {
// //         await commentService.toggleDislike(comment.id);
// //       }
// //       // İşlem başarılıysa parent component'teki listeyi yenile
// //       onCommentUpdated(); 
// //     } catch (err) {
// //       console.error("Reaction error:", err);
// //     }
// //   };

// //   const handleReplySubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!replyText.trim()) return;
    
// //     setIsSubmitting(true);
// //     try {
// //       const res = await commentService.addComment({
// //         movieId,
// //         content: replyText,
// //         parentId: comment.id 
// //       });

// //       if (res.success) {
// //         setReplyText("");
// //         setIsReplying(false);
// //         setShowReplies(true);
// //         onCommentUpdated(); 
// //       }
// //     } catch (err) {
// //       console.error("Reply error:", err);
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <div className={`mt-6 ${isReply ? "ml-8 md:ml-12 border-l border-gray-800 pl-4" : ""}`}>
// //       <div className="flex gap-3">
// //         <div className={`${isReply ? "w-8 h-8 text-sm" : "w-10 h-10 text-lg"} rounded-full bg-gray-700 shrink-0 flex items-center justify-center border border-gray-600`}>
// //           👤
// //         </div>
// //         <div className="flex-1">
// //           <div className="flex items-center gap-2 mb-1">
// //             <Link href={`/profile/${comment.username}`} className="font-bold text-xs text-yellow-500 hover:underline">
// //               {comment.username}
// //             </Link>
// //             <span className="text-[10px] text-gray-500">
// //               {new Date(comment.createdDate).toLocaleDateString()}
// //             </span>
// //           </div>
          
// //           {/* Yorum İçeriği */}
// //           <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
          
// //           {/* --- YENİ EKLENEN LIKE / DISLIKE / REPLY SATIRI --- */}
// //           <div className="flex items-center gap-4 mt-2">
// //             <button 
// //               onClick={() => handleReaction(true)}
// //               className={`flex items-center gap-1 text-[10px] font-bold transition-all active:scale-125 ${comment.userReaction === true ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
// //             >
// //               {comment.userReaction === true ? '❤️' : '🤍'} {comment.likeCount || 0}
// //             </button>
            
// //             <button 
// //               onClick={() => handleReaction(false)}
// //               className={`flex items-center gap-1 text-[10px] font-bold transition-all active:scale-125 ${comment.userReaction === false ? 'text-blue-500' : 'text-gray-500 hover:text-white'}`}
// //             >
// //               {comment.userReaction === false ? '👎' : '💀'} {comment.dislikeCount || 0}
// //             </button>

// //             <button 
// //               onClick={() => setIsReplying(!isReplying)}
// //               className={`text-[10px] font-bold mt-0.5 transition-colors uppercase tracking-widest ${isReplying ? "text-yellow-500" : "text-gray-500 hover:text-white"}`}
// //             >
// //               {isReplying ? t("comment.cancel") || "VAZGEÇ" : t("comment.reply") || "YANITLA"}
// //             </button>
// //           </div>

// //           {/* Yanıt Kutusu Formu (Aynı kalıyor) */}
// //           {isReplying && (
// //             <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
// //               <textarea 
// //                 autoFocus
// //                 className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white focus:border-yellow-500 outline-none"
// //                 placeholder={`@${comment.username}...`}
// //                 value={replyText}
// //                 onChange={(e) => setReplyText(e.target.value)}
// //               />
// //               <div className="flex justify-end">
// //                 <button 
// //                   type="submit"
// //                   disabled={isSubmitting || !replyText.trim()}
// //                   className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black px-4 py-1.5 rounded-lg text-xs font-black transition-all"
// //                 >
// //                   {isSubmitting ? "..." : t("movie.sendComment") || "Gönder"}
// //                 </button>
// //               </div>
// //             </form>
// //           )}

// //           {/* Alt Yanıtlar Listesi (Aynı kalıyor) */}
// //           {comment.replies && comment.replies.length > 0 && (
// //             <div className="mt-3">
// //               <button 
// //                 onClick={() => setShowReplies(!showReplies)}
// //                 className="flex items-center gap-2 text-[10px] text-gray-500 font-bold hover:text-gray-300 transition-colors"
// //               >
// //                 <span className="w-6 h-px bg-gray-700"></span>
// //                 {showReplies 
// //                   ? t("comment.hideReplies") || "Yanıtları gizle" 
// //                   : `${t("comment.viewReplies") || "Yanıtları gör"} (${comment.replies.length})`
// //                 }
// //               </button>

// //               {showReplies && (
// //                 <div className="mt-2 space-y-2">
// //                   {comment.replies.map(reply => (
// //                     <CommentItem 
// //                       key={reply.id} 
// //                       comment={reply} 
// //                       movieId={movieId} 
// //                       isReply={true} 
// //                       onCommentUpdated={onCommentUpdated} 
// //                     />
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


"use client";

import { useState } from "react";
import { CommentResponse } from "@/types";
import { commentService } from "@/services/commentService";
import { useTranslation } from "@/context/LanguageContext";
import Link from "next/link";

interface CommentItemProps {
  comment: CommentResponse;
  movieId: string;
  isReply?: boolean;
  onCommentUpdated: () => void;
}

export default function CommentItem({ comment, movieId, isReply = false, onCommentUpdated }: CommentItemProps) {
  const { t } = useTranslation();
  const [showReplies, setShowReplies] = useState(false); 
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- LIKE / DISLIKE İŞLEMİ ---
  const handleReaction = async (isLike: boolean) => {
    try {
      if (isLike) {
        await commentService.toggleLike(comment.id);
      } else {
        await commentService.toggleDislike(comment.id);
      }
      onCommentUpdated(); // Listeyi yenile
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await commentService.addComment({ movieId, content: replyText, parentId: comment.id });
      if (res.success) {
        setReplyText("");
        setIsReplying(false);
        setShowReplies(true);
        onCommentUpdated(); 
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`mt-4 ${isReply ? "ml-8 md:ml-12 border-l-2 border-gray-800 pl-4" : ""}`}>
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-800 shrink-0 flex items-center justify-center border border-gray-700 text-sm">
          👤
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/profile/${comment.username}`} className="font-bold text-xs text-yellow-500 hover:underline">
              {comment.username}
            </Link>
            <span className="text-[10px] text-gray-500">{new Date(comment.createdDate).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4 mt-2">
            {/* Like Butonu */}
            <button 
              onClick={() => handleReaction(true)}
              className={`flex items-center gap-1 text-[11px] font-bold transition-all active:scale-125 ${comment.userReaction === true ? 'text-red-500' : 'text-gray-500 hover:text-white'}`}
            >
              {comment.userReaction === true ? '❤️' : '🤍'} {comment.likeCount || 0}
            </button>
            
            {/* Dislike Butonu */}
            <button 
              onClick={() => handleReaction(false)}
              className={`flex items-center gap-1 text-[11px] font-bold transition-all active:scale-125 ${comment.userReaction === false ? 'text-blue-500' : 'text-gray-500 hover:text-white'}`}
            >
              {comment.userReaction === false ? '👎' : '💀'} {comment.dislikeCount || 0}
            </button>

            <button 
              onClick={() => setIsReplying(!isReplying)}
              className="text-[10px] font-bold text-gray-500 hover:text-white uppercase"
            >
              {isReplying ? t("comment.cancel") : t("comment.reply")}
            </button>
          </div>

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3">
              <textarea 
                autoFocus
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                placeholder={`@${comment.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black px-4 py-1 rounded-lg text-xs font-bold">
                  {isSubmitting ? "..." : t("movie.sendComment")}
                </button>
              </div>
            </form>
          )}

          {/* Yanıtlar */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <button onClick={() => setShowReplies(!showReplies)} className="text-[10px] text-gray-500 font-bold hover:text-gray-300">
                {showReplies ? `▲ ${t("comment.hideReplies")}` : `▼ ${t("comment.viewReplies")} (${comment.replies.length})`}
              </button>
              {showReplies && (
                <div className="space-y-1">
                  {comment.replies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} movieId={movieId} isReply={true} onCommentUpdated={onCommentUpdated} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}