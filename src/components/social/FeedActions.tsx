import { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { movieService } from "@/services/movieService"; // Paylaştığın servisi kullanıyoruz
import { useRouter } from "next/navigation";

interface Props {
  activityId: string;
  targetId: string; // Film ID'si buraya gelmeli
  initialLikeCount: number;
  initialCommentCount: number;
  initialUserReaction: boolean | null;
}

export const FeedActions = ({
  targetId,
  initialLikeCount,
  initialCommentCount,
  initialUserReaction,
}: Props) => {
  const router = useRouter();
  const [liked, setLiked] = useState(!!initialUserReaction);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const goToDetails = () => {
    router.push(`/movies/${targetId}?focus=comments`); // Focus parametresi ile detayda yorumlara kaydırabilirsin
  };

  useEffect(() => {
    setLiked(!!initialUserReaction);
    setLikeCount(initialLikeCount);
  }, [initialUserReaction, initialLikeCount]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Optimistic Update
    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!prevLiked);
    setLikeCount((prev) => (!prevLiked ? prev + 1 : prev - 1));

    try {
      // Senin movieService içindeki toggleLike metodun
      await movieService.toggleLike(targetId);
    } catch (error) {
      // Hata olursa geri al
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-gray-800/50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-8 text-gray-400">
          {" "}
          {/* Araları açıldı */}
          <button
            onClick={handleLike}
            className="hover:scale-110 transition-transform"
          >
            {liked ? (
              <AiFillHeart className="w-7 h-7 text-red-500" /> /* Beğenilmişse Kırmızı */
            ) : (
              <AiOutlineHeart className="w-7 h-7 hover:text-red-400" />
            )}
          </button>
          <button
            onClick={goToDetails}
            className="hover:scale-110 transition-transform hover:text-blue-400"
          >
            <FaRegComment className="w-6 h-6" />
          </button>
          <button className="hover:scale-110 transition-transform">
            <FaRetweet className="w-6 h-6" />
          </button>
        </div>

        <button className="text-gray-400 hover:text-yellow-500 transition-colors">
          <FiSend className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white" />
        </button>
      </div>

      <div className="flex flex-col text-sm font-semibold text-gray-200">
        <span>{likeCount.toLocaleString()} beğenme</span>
        {/* Yorum yazısı artık tıklanabilir ve gerçek sayıyı gösteriyor */}
        {initialCommentCount > 0 ? (
    <button 
      onClick={goToDetails}
      className="text-gray-500 font-normal text-left mt-1 hover:underline"
    >
      {initialCommentCount === 1 
        ? "1 yorumu gör" 
        : `${initialCommentCount} yorumun tümünü gör`}
    </button>
  ) : (
    <button 
      onClick={goToDetails}
      className="text-gray-400 font-normal text-left mt-1 text-xs hover:text-gray-300"
    >
      İlk yorumu sen yap...
    </button>
        )}
      </div>
    </div>
  );
};
