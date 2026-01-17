"use client";

import { useState } from "react";
import { CommentResponse } from "@/types";
import { useTranslation } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { commentService } from "@/services/commentService"; // Bunu birazdan oluşturacağız

interface CommentSectionProps {
  movieId: string;
  initialComments: CommentResponse[];
}

export default function CommentSection({ movieId, initialComments }: CommentSectionProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentResponse[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert(t('auth.loginRequired')); // Basit bir kontrol
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await commentService.addComment({
        movieId,
        content: newComment,
      });

      if (res.success) {
        setComments([res.data, ...comments]); // Yeni yorumu listenin başına ekle
        setNewComment("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-500">{t('movie.comments')}</h2>

      {/* Yorum Yazma Formu */}
      {user ? (
        <form onSubmit={handleCommentSubmit} className="space-y-4 bg-gray-800 p-4 rounded-xl border border-gray-700">
          <textarea
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-all"
            rows={3}
            placeholder={t('movie.addCommentPlaceholder')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {isSubmitting ? t('common.sending') : t('movie.sendComment')}
          </button>
        </form>
      ) : (
        <div className="bg-gray-800/50 p-4 rounded-xl border border-dashed border-gray-600 text-center text-gray-400">
          {t('movie.loginToComment')}
        </div>
      )}

      {/* Yorum Listesi */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-yellow-500">{comment.username}</span>
              <span className="text-xs text-gray-500">{new Date(comment.createdDate).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}