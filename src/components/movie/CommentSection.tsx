

"use client";

import { useState } from "react";
import { CommentResponse, PageResponse } from "@/types";
import { commentService } from "@/services/commentService";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import CommentItem from "./CommentItem";

export default function CommentSection({ movieId, initialData, totalCount }: { movieId: string, initialData: PageResponse<CommentResponse>, totalCount: number }) {
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
        {/* 💬 {t("movie.comments")} ({commentPage.totalElements}) */}
        💬 {t("movie.comments")} ({totalCount})
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
