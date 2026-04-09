'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  BookmarkIcon, 
  ListBulletIcon, 
  QueueListIcon, 
  ShareIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';
import { useTranslation } from '@/context/LanguageContext';

interface MovieActionMenuProps {
  movieId: string;
  tmdbId: number;
  movieTitle: string;
  onOpenCollections?: () => void; 
}

export const MovieActionMenu = ({ movieId, tmdbId, movieTitle, onOpenCollections }: MovieActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/movies/${movieId}?tmdbId=${tmdbId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: movieTitle,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
     
      navigator.clipboard.writeText(shareUrl);
      alert(t('common.linkCopied') || 'Link copied to clipboard!');
    }
  };

  const menuItems = [
    { 
      label: 'Add to watchlist', 
      icon: BookmarkIcon, 
      onClick: () => console.log('Watchlist logic here') 
    },
    { 
      label: 'Add to lists...', 
      icon: QueueListIcon, 
      onClick: () => onOpenCollections?.() 
    },
    { 
      label: 'Show in lists', 
      icon: ListBulletIcon, 
      onClick: () => console.log('Navigate to public lists') 
    },
    { 
      label: 'Share', 
      icon: ShareIcon, 
      onClick: handleShare 
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 hover:bg-white/10 rounded-full transition-colors group backdrop-blur-sm bg-black/20 border border-white/5"
      >
        <EllipsisHorizontalIcon className="w-5 h-5 text-gray-300 group-hover:text-white" />
      </button>

      {isOpen && (
  <>
    {/* Menü Kutusu */}
    <div className="absolute left-[calc(100%+12px)] bottom-0 -mb-2 w-48 bg-[#14181c] border border-[#2c3440] rounded-lg shadow-2xl z-[100] overflow-visible animate-in fade-in slide-in-from-left-2">
      
      {/* Konuşma Balonu Oku (Sol tarafta) */}
      <div className="absolute -left-1.5 bottom-4 w-3 h-3 bg-[#14181c] border-l border-b border-[#2c3440] rotate-45" style={{ isolation: 'isolate' }} />
            
      <div className="py-1 relative z-10">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              item.onClick();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-[#9ab] hover:bg-[#445566] hover:text-white transition-colors border-b border-[#2c3440]/50 last:border-none"
          >
            <item.icon className="w-4 h-4 opacity-70" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  </>
)}
    </div>
  );
};