/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, Cpu, Compass, Settings, Calendar, Eye, Play, Pause, Share2, Check, Heart, Download } from 'lucide-react';
import { Photograph } from '../types';
import { supabase } from '../lib/supabase';

interface LightboxProps {
  photo: Photograph;
  filteredList: Photograph[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  photo,
  filteredList,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const [autoPlay, setAutoPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onNextRef = useRef(onNext);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(() => localStorage.getItem(`liked_${photo.id}`) === 'true');
  const [loadingLikes, setLoadingLikes] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchLikes = async (photoId: string) => {
    setLoadingLikes(true);
    const { data, error } = await supabase
      .from('likes')
      .select('count')
      .eq('photo_id', photoId)
      .single();
    
    if (!error && data) {
      setLikes(data.count);
    } else if (error?.code === 'PGRST116') {
      const { data: newData } = await supabase
        .from('likes')
        .insert([{ photo_id: photoId, count: 0 }])
        .select();
      if (newData) {
        setLikes(0);
      }
    }
    setLoadingLikes(false);
  };

  useEffect(() => {
    fetchLikes(photo.id);
    setLiked(localStorage.getItem(`liked_${photo.id}`) === 'true');
  }, [photo.id]);

  const handleLike = useCallback(async () => {
    if (liked) {
      const newCount = Math.max(0, likes - 1);
      setLikes(newCount);
      setLiked(false);
      localStorage.setItem(`liked_${photo.id}`, 'false');
      await supabase
        .from('likes')
        .update({ count: newCount })
        .eq('photo_id', photo.id);
    } else {
      const newCount = likes + 1;
      setLikes(newCount);
      setLiked(true);
      localStorage.setItem(`liked_${photo.id}`, 'true');
      await supabase
        .from('likes')
        .update({ count: newCount })
        .eq('photo_id', photo.id);
    }
  }, [liked, likes, photo.id]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}?photo=${photo.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [photo.id]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = photo.imageUrl;
      });

      const borderSize = 80;
      const canvas = document.createElement('canvas');
      canvas.width = img.width + borderSize * 2;
      canvas.height = img.height + borderSize * 2;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, borderSize, borderSize);

      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 1;
      ctx.strokeRect(borderSize - 1, borderSize - 1, img.width + 2, img.height + 2);

      ctx.fillStyle = '#1a1a1a';
      ctx.font = `bold ${Math.max(14, Math.floor(borderSize * 0.22))}px monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('THEO UMARU ZHOU', borderSize, canvas.height - borderSize / 2);

      ctx.font = `${Math.max(10, Math.floor(borderSize * 0.16))}px monospace`;
      ctx.fillStyle = '#999999';
      ctx.fillText(`© ${photo.year} ALL RIGHTS RESERVED`, borderSize, canvas.height - borderSize / 2 + Math.max(16, borderSize * 0.28));

      ctx.textAlign = 'right';
      ctx.fillStyle = '#cc0000';
      ctx.font = `bold ${Math.max(12, Math.floor(borderSize * 0.18))}px monospace`;
      ctx.fillText(photo.id.toUpperCase(), canvas.width - borderSize, canvas.height - borderSize / 2);

      ctx.fillStyle = '#999999';
      ctx.font = `${Math.max(10, Math.floor(borderSize * 0.15))}px monospace`;
      ctx.fillText(`${photo.location}`, canvas.width - borderSize, canvas.height - borderSize / 2 + Math.max(16, borderSize * 0.28));

      const link = document.createElement('a');
      link.download = `THEO_${photo.id.toUpperCase()}_WATERMARKED.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch {
      window.open(photo.imageUrl, '_blank');
    }
    setDownloading(false);
  }, [photo]);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      onNextRef.current();
    }, 3000);
  }, [stopAutoPlay]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => {
      if (prev) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
      return !prev;
    });
  }, [startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAutoPlay(false);
        stopAutoPlay();
        onClose();
      }
      if (e.key === 'ArrowRight') {
        setAutoPlay(false);
        stopAutoPlay();
        onNext();
      }
      if (e.key === 'ArrowLeft') {
        setAutoPlay(false);
        stopAutoPlay();
        onPrev();
      }
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, toggleAutoPlay, stopAutoPlay]);

  const currentIndex = filteredList.findIndex((p) => p.id === photo.id);
  const totalCount = filteredList.length;

  return (
    <AnimatePresence>
      <div
        id="lightbox-viewport"
        className="fixed inset-0 z-50 overflow-y-auto bg-[#ebebeb]/98 dark:bg-[#1a1a1a]/98 flex flex-col justify-start transition-colors duration-300"
      >
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-neutral-300 dark:border-neutral-700 bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="tracking-widest uppercase">SPECIMEN PREVIEW</span>
            <span className="text-neutral-400 dark:text-neutral-500">/</span>
            <span>
              INDEX [{currentIndex + 1} OF {totalCount}]
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 hidden md:inline">
              [← / → / SPACE KEYBOARD KEYS ACTION]
            </span>
            <button
              id="lightbox-autoplay-btn"
              onClick={toggleAutoPlay}
              className={`p-2 transition-colors uppercase font-mono text-xs flex items-center gap-2 cursor-pointer border ${
                autoPlay
                  ? 'text-red-600 border-red-600 bg-red-50 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : 'text-neutral-500 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{autoPlay ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              id="lightbox-close-btn"
              onClick={() => { setAutoPlay(false); stopAutoPlay(); onClose(); }}
              className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors uppercase font-mono text-xs flex items-center gap-2 cursor-pointer border border-neutral-300 dark:border-neutral-700"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="w-full h-[2px] bg-neutral-300">
          <div
            className="h-full bg-red-600 transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
          />
        </div>

        <div className="flex-1 w-full max-w-8xl mx-auto flex flex-col lg:flex-row items-stretch select-none">
          <div className="flex-1 relative bg-neutral-300 flex items-center justify-center p-4 md:p-8 min-h-[50vh] lg:min-h-0">
            {isMobile ? (
              <>
                <div
                  onClick={onPrev}
                  className="absolute left-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
                />
                <div
                  onClick={onNext}
                  className="absolute right-0 top-0 bottom-0 w-1/3 z-20 cursor-pointer"
                />
              </>
            ) : (
              <>
                <button
                  onClick={onPrev}
                  title="Prev [Left Arrow]"
                  className="absolute left-4 p-4 text-white/70 hover:text-white hover:scale-110 transition-all z-20 cursor-pointer rounded-none duration-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={onNext}
                  title="Next [Right Arrow]"
                  className="absolute right-4 p-4 text-white/70 hover:text-white hover:scale-110 transition-all z-20 cursor-pointer rounded-none duration-300"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="max-w-full max-h-[75vh] lg:max-h-[82vh] relative"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="max-w-full max-h-[75vh] lg:max-h-[82vh] object-contain shadow-2xl pointer-events-none mx-auto"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

          <div className="w-full lg:w-[420px] bg-[#e0e0e0] dark:bg-[#2a2a2a] lg:border-l border-neutral-300 dark:border-neutral-700 p-8 flex flex-col justify-between overflow-y-auto shrink-0 border-t border-neutral-300 dark:border-neutral-700 lg:border-t-0">
            <div>
              <div className="flex justify-between items-center mb-6 font-mono text-xs">
                <span className="text-red-600 tracking-wider font-semibold uppercase">
                  {photo.category.replace('-', ' ')}
                </span>
                <span className="text-neutral-400 dark:text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-1">
                  ID: {photo.id.toUpperCase()}
                </span>
              </div>

              <h3 className="text-3xl font-display font-extrabold text-[#1a1a1a] dark:text-[#ebebeb] tracking-tight leading-none uppercase">
                {photo.title}
              </h3>
              <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm font-sans leading-relaxed font-light">
                {photo.desc}
              </p>

              <div className="hr-minimal my-6" />

              <h4 className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-4">
                地理归档暨拍摄参数 / GEOGRAPHIC & EXIF METADATA
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">LOCATION</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-0.5">{photo.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">TIMESTEP YEAR</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-0.5">{photo.year} A.D.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Camera className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">CAMERA BODY</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-0.5 font-mono">{photo.exif.camera}</p>
                    <span className="inline-block mt-1 font-mono text-[9px] bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 tracking-wider font-semibold uppercase">
                      {photo.exif.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Settings className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">OPTICAL GLASS</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-0.5 font-mono">{photo.exif.lens}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase">EXPOSURE FORMULA</p>
                    <p className="text-sm text-green-600 mt-0.5 font-mono">{photo.exif.exposure}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">Focal Length: {photo.exif.focalLength}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-neutral-300 dark:border-neutral-700 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                  <span>{copied ? 'LINK COPIED' : 'SHARE'}</span>
                </button>
                <button
                  onClick={handleLike}
                  disabled={loadingLikes}
                  className="flex items-center gap-2 font-mono text-[10px] transition-colors cursor-pointer disabled:opacity-50"
                  style={{ color: liked ? '#ef4444' : undefined }}
                >
                  <Heart className={`w-5 h-5 transition-transform duration-200 ${liked ? 'scale-110' : ''}`} fill={liked ? '#ef4444' : 'none'} />
                  <span className={liked ? 'text-red-600' : 'text-neutral-500 dark:text-neutral-400'}>{likes > 0 ? likes : 'LIKE'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>{downloading ? 'PROCESSING...' : 'DOWNLOAD'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                <Eye className="w-3 h-3 text-red-600" />
                <span>ALL RIGHTS RESERVED ZHOU©️</span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal font-sans">
                除摄影作品集演示外，任何未经周亭燃本人书面授权的商业、非商业下载、改编、印刷及数字再分发均为非法。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}