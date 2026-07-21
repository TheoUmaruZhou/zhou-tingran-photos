/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, Cpu, Compass, Settings, Calendar, Eye, Play, Pause, Share2, Check, Heart, Download, Maximize2, Minimize2 } from 'lucide-react';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [transitionKey, setTransitionKey] = useState(0);

  // 全屏切换函数
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 触摸滑动处理
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextWithDirection();
    }
    if (isRightSwipe) {
      handlePrevWithDirection();
    }
  };

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
    const newCount = liked ? Math.max(0, likes - 1) : likes + 1;
    
    // 先尝试更新，如果没有记录则插入
    const { error: updateError } = await supabase
      .from('likes')
      .update({ count: newCount })
      .eq('photo_id', photo.id);

    if (updateError) {
      // 如果更新失败（可能是记录不存在），尝试插入
      if (updateError.code === 'PGRST116' || updateError.message?.includes('0 rows')) {
        await supabase
          .from('likes')
          .insert([{ photo_id: photo.id, count: newCount }]);
      } else {
        console.error('Like error:', updateError);
        return;
      }
    }

    // 更新本地状态
    setLikes(newCount);
    setLiked(!liked);
    localStorage.setItem(`liked_${photo.id}`, (!liked).toString());
  }, [liked, likes, photo.id]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}?photo=${photo.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [photo.id]);

  const generateWatermarkedImage = useCallback(async (): Promise<string | null> => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';

      const imageSrc = photo.originalJpgUrl || photo.imageUrl;

      const tryLoadImage = async (src: string): Promise<boolean> => {
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = src;
        });
      };

      let loaded = await tryLoadImage(imageSrc);
      if (!loaded && photo.originalJpgUrl) {
        loaded = await tryLoadImage(photo.imageUrl);
      }

      if (!loaded) {
        return null;
      }

      // 根据图片比例动态计算画布大小
      const aspectRatio = img.width / img.height;
      const padding = 800; // 边距和装饰空间

      let canvasW: number;
      let canvasH: number;

      if (aspectRatio <= 0.75) {
        // 竖向图片 - 需要更高的画布
        canvasW = img.width + padding;
        canvasH = img.height + padding + 250;
      } else {
        // 横向图片(3:2)和1:1比例 - 使用原来的正方形画布逻辑
        canvasW = Math.max(img.width, img.height) + padding;
        canvasH = canvasW;
      }

      const canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext('2d')!;

      // 背景渐变效果
      const gradient = ctx.createLinearGradient(0, 0, canvasW, canvasH);
      gradient.addColorStop(0, '#f8f7f4');
      gradient.addColorStop(1, '#ebe9e4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasW, canvasH);

      // 图片区域
      const margin = canvasW * 0.08;
      const maxImgW = canvasW - margin * 2;

      // 根据图片比例调整最大高度限制
      let maxImgH: number;
      if (aspectRatio <= 0.75) {
        // 竖向图片 - 预留底部信息空间
        maxImgH = canvasH - 250 - margin;
      } else if (aspectRatio >= 1.4) {
        // 横向图片 (3:2等) - 使用原来的逻辑
        maxImgH = canvasH * 1.4;
      } else {
        // 1:1比例或接近正方形
        maxImgH = canvasH * 1.2;
      }

      const scale = Math.min(maxImgW / img.width, maxImgH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const imgX = (canvasW - drawW) / 2;

      // 图片起始Y位置 - 根据比例调整
      let imgY: number;
      if (aspectRatio <= 0.75) {
        // 竖向图片 - 顶部开始
        imgY = canvasH * 0.08;
      } else if (aspectRatio >= 1.4) {
        // 横向图片 (3:2等) - 原来的位置
        imgY = canvasH * 0.12;
      } else {
        // 1:1比例 - 在画布中垂直居中
        imgY = (canvasH - drawH) / 2;
      }

      // 图片边框装饰
      ctx.strokeStyle = '#d4d0c8';
      ctx.lineWidth = 2;
      ctx.strokeRect(imgX - 15, imgY - 15, drawW + 30, drawH + 30);

      // 内边框
      ctx.strokeStyle = '#a09890';
      ctx.lineWidth = 1;
      ctx.strokeRect(imgX - 8, imgY - 8, drawW + 16, drawH + 16);

      // 绘制图片
      ctx.drawImage(img, imgX, imgY, drawW, drawH);

      // 底部信息区 - 仅横向图片(3:2)显示
      if (aspectRatio >= 1.4) {
        const bottomStart = imgY + drawH + 40;
        const bottomEnd = canvasH - canvasH * 0.05;
        const bottomSpace = bottomEnd - bottomStart;
        let curY = bottomStart + bottomSpace * 0.08;

        // 装饰线
        ctx.strokeStyle = '#c4b8a8';
        ctx.lineWidth = 1;
        const decorLineW = canvasW * 0.12;
        ctx.beginPath();
        ctx.moveTo(canvasW / 2 - decorLineW, curY);
        ctx.lineTo(canvasW / 2 + decorLineW, curY);
        ctx.stroke();

        // 装饰点
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.arc(canvasW / 2, curY, 4, 0, Math.PI * 2);
        ctx.fill();

        curY += canvasW * 0.05;

        // 作品标题 - 使用更艺术化的字体风格
        ctx.fillStyle = '#2c2416';
        ctx.font = `italic bold ${Math.round(canvasW * 0.028)}px "Georgia", "Times New Roman", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(photo.title.toUpperCase(), canvasW / 2, curY);
        curY += canvasW * 0.055;

        // 副标题
        ctx.fillStyle = '#6b5d4d';
        ctx.font = `${Math.round(canvasW * 0.016)}px "Georgia", "Times New Roman", serif`;
        ctx.fillText(`— ${photo.year} —`, canvasW / 2, curY);
        curY += canvasW * 0.06;

        // 设备信息
        ctx.fillStyle = '#888078';
        ctx.font = `300 ${Math.round(canvasW * 0.014)}px "Georgia", "Times New Roman", serif`;
        ctx.fillText(`${photo.exif.camera}  ·  ${photo.exif.lens}`, canvasW / 2, curY);
        curY += canvasW * 0.04;

        ctx.fillStyle = '#9a9288';
        ctx.font = `${Math.round(canvasW * 0.013)}px "Georgia", "Times New Roman", serif`;
        ctx.fillText(`${photo.exif.exposure}  ·  ${photo.exif.focalLength}`, canvasW / 2, curY);
      }

      return canvas.toDataURL('image/jpeg', 0.95);
    } catch {
      return null;
    }
  }, [photo]);

  const handleDownloadClick = useCallback(async () => {
    setDownloading(true);
    const url = await generateWatermarkedImage();
    if (url) {
      setPreviewUrl(url);
      setPreviewOpen(true);
    } else {
      window.open(photo.imageUrl, '_blank');
    }
    setDownloading(false);
  }, [generateWatermarkedImage, photo.imageUrl]);

  const handleConfirmDownload = useCallback(() => {
    if (previewUrl) {
      const link = document.createElement('a');
      link.download = `THEO_${photo.id.toUpperCase()}_WATERMARKED.jpg`;
      link.href = previewUrl;
      link.click();
    }
    setPreviewOpen(false);
    setPreviewUrl(null);
  }, [previewUrl, photo.id]);

  const handleCancelDownload = useCallback(() => {
    setPreviewOpen(false);
    setPreviewUrl(null);
  }, []);

  useEffect(() => {
    onNextRef.current = onNext;
  }, [onNext]);

  const stopAutoPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePrevWithDirection = useCallback(() => {
    setSlideDirection(-1);
    setTransitionKey((prev) => prev + 1);
    stopAutoPlay();
    onPrev();
  }, [onPrev, stopAutoPlay]);

  const handleNextWithDirection = useCallback(() => {
    setSlideDirection(1);
    setTransitionKey((prev) => prev + 1);
    stopAutoPlay();
    onNext();
  }, [onNext, stopAutoPlay]);

  const startAutoPlay = useCallback(() => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      onNextRef.current();
    }, 4500); // 4.5秒自动播放
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
        if (previewOpen) {
          handleCancelDownload();
        } else {
          setAutoPlay(false);
          stopAutoPlay();
          onClose();
        }
      }
      if (!previewOpen) {
        if (e.key === 'ArrowRight') {
          setAutoPlay(false);
          handleNextWithDirection();
        }
        if (e.key === 'ArrowLeft') {
          setAutoPlay(false);
          handlePrevWithDirection();
        }
        if (e.key === ' ') {
          e.preventDefault();
          toggleAutoPlay();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev, toggleAutoPlay, stopAutoPlay, previewOpen, handleCancelDownload]);

  const currentIndex = filteredList.findIndex((p) => p.id === photo.id);
  const totalCount = filteredList.length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`lightbox-${photo.id}`}
        id="lightbox-viewport"
        initial={{ opacity: 0, scale: 0.98, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.86, y: 30 }}
        transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-0 z-50 overflow-x-hidden overflow-y-auto ${isFullscreen ? 'bg-black' : 'bg-[#ebebeb]/98 dark:bg-[#1a1a1a]/98'} flex flex-col justify-start transition-colors duration-300`}
      >
        {/* 顶部栏 - 全屏时隐藏 */}
        {!isFullscreen && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex items-center justify-between px-4 md:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 sticky top-0 z-10 shrink-0"
            >
              <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 dark:text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-700"></span>
                <span className="text-[10px]">
                  {currentIndex + 1} / {totalCount}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={toggleFullscreen}
                  className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer rounded"
                  aria-label="全屏查看"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  id="lightbox-close-btn"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => { setAutoPlay(false); stopAutoPlay(); onClose(); }}
                  className="p-2 text-neutral-400 dark:text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer rounded"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* 进度条 */}
            <div className="w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-red-700"
              />
            </div>
          </>
        )}

        <motion.div
          key={`viewport-${photo.id}-${transitionKey}`}
          initial={isMobile ? { opacity: 0 } : { x: slideDirection * 140, opacity: 0, scale: 0.97 }}
          animate={isMobile ? { opacity: 1 } : { x: 0, opacity: 1, scale: 1 }}
          exit={isMobile ? { opacity: 0 } : { x: -slideDirection * 140, opacity: 0, scale: 0.98 }}
          transition={isMobile ? { duration: 0.16, ease: [0.16, 1, 0.3, 1] } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`flex-1 w-full ${isFullscreen ? '' : 'max-w-8xl'} mx-auto flex flex-col lg:flex-row items-stretch select-none`}
        >
          <div
            className={`flex-1 relative ${isFullscreen ? 'bg-black' : 'bg-neutral-300'} flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-4 md:p-8'} min-h-[50vh] lg:min-h-0`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >

            {/* 左侧切换按钮 - 仅电脑端显示，全屏时隐藏 */}
            {!isFullscreen && (
              <motion.button
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: -4, scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevWithDirection}
                className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-200 z-10 group"
                aria-label="上一张图片"
              >
                <ChevronLeft className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </motion.button>
            )}

            {/* 右侧切换按钮 - 仅电脑端显示，全屏时隐藏 */}
            {!isFullscreen && (
              <motion.button
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 4, scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextWithDirection}
                className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all duration-200 z-10 group"
                aria-label="下一张图片"
              >
                <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
              </motion.button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                layoutId={`photo-${photo.id}`}
                initial={isMobile ? { opacity: 0 } : { opacity: 0, x: slideDirection * 120, scale: 0.95, y: 22, filter: 'blur(14px)' }}
                animate={isMobile ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1, y: 0, filter: 'blur(0px)' }}
                exit={isMobile ? { opacity: 0 } : { opacity: 0, x: -slideDirection * 110, scale: 0.97, y: 12, filter: 'blur(9px)' }}
                transition={isMobile ? { duration: 0.16, ease: [0.16, 1, 0.3, 1] } : { duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                className={`${isFullscreen ? 'max-w-full max-h-full' : 'max-w-full max-h-[75vh] lg:max-h-[82vh]'} relative`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className={`${isFullscreen ? 'max-w-full max-h-[100vh]' : 'max-w-full max-h-[75vh] lg:max-h-[82vh]'} object-contain shadow-2xl mx-auto`}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* 全屏模式下的切换按钮 */}
            {isFullscreen && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); stopAutoPlay(); onPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 z-20 group"
                  aria-label="上一张图片"
                >
                  <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); stopAutoPlay(); onNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 z-20 group"
                  aria-label="下一张图片"
                >
                  <ChevronRight className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />
                </button>
                {/* 退出全屏按钮 */}
                <button
                  onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-200 z-20 group"
                  aria-label="退出全屏"
                >
                  <Minimize2 className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </button>
              </>
            )}
          </div>

          {/* 右侧信息栏 - 全屏时隐藏 */}
          {!isFullscreen && (
          <motion.aside
            key={`info-${photo.id}`}
            initial={{ opacity: 0, x: 34, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 24, filter: 'blur(4px)' }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="w-full lg:w-[380px] bg-[#f5f5f5] dark:bg-[#252525] lg:border-l border-neutral-200 dark:border-neutral-800 flex flex-col overflow-y-auto shrink-0 border-t border-neutral-200 dark:border-neutral-800 lg:border-t-0"
          >
            {/* 头部：标题区 */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-red-700 tracking-widest uppercase font-semibold">
                  {photo.project || photo.category || 'ARCHIVE'}
                </span>
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                  #{photo.id.toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-display font-bold text-[#1a1a1a] dark:text-[#ebebeb] tracking-tight leading-tight">
                {photo.title}
              </h3>
              {photo.desc && (
                <p className="mt-2 text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                  {photo.desc}
                </p>
              )}
            </div>

            {/* 拍摄参数 */}
            <div className="flex-1 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Location</p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium">{photo.location}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Year</p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium">{photo.year}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Camera</p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">{photo.exif.camera} <span className="text-red-700 text-[9px] ml-1">{photo.exif.format}</span></p>
                </div>
                <div className="col-span-2">
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Lens</p>
                  <p className="text-neutral-700 dark:text-neutral-300 font-mono text-xs">{photo.exif.lens}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-mono text-[9px] text-neutral-400 dark:text-neutral-500 uppercase mb-1">Exposure</p>
                  <p className="text-green-600 font-mono text-xs">{photo.exif.exposure} <span className="text-neutral-400 ml-2">{photo.exif.focalLength}</span></p>
                </div>
              </div>
            </div>

            {/* 操作栏：分享、点赞、下载 */}
            <div className="flex items-center justify-center gap-6 py-4 border-y border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#2a2a2a]">
              <button
                onClick={handleShare}
                className="flex flex-col items-center gap-1 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
                <span className="font-mono text-[9px] uppercase">{copied ? 'Copied' : 'Share'}</span>
              </button>
              <button
                onClick={handleLike}
                disabled={loadingLikes}
                className="flex flex-col items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                style={{ color: liked ? '#ef4444' : undefined }}
              >
                <Heart className={`w-5 h-5 transition-transform duration-200 ${liked ? 'scale-110' : ''}`} fill={liked ? '#ef4444' : 'none'} />
                <span className={`font-mono text-[9px] uppercase ${liked ? 'text-red-700' : 'text-neutral-500 dark:text-neutral-400'}`}>{likes > 0 ? likes : 'Like'}</span>
              </button>
              <button
                onClick={handleDownloadClick}
                disabled={downloading}
                className="flex flex-col items-center gap-1 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                <span className="font-mono text-[9px] uppercase">{downloading ? 'Wait' : 'Download'}</span>
              </button>
              <button
                onClick={toggleAutoPlay}
                className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${autoPlay ? 'text-red-700' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'}`}
              >
                {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span className="font-mono text-[9px] uppercase">{autoPlay ? 'Pause' : 'Auto'}</span>
              </button>
            </div>

            {/* 底部：版权 */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20">
              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                <Eye className="w-3 h-3 text-red-700" />
                <span>ALL RIGHTS RESERVED ZHOU©️</span>
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal font-sans mt-2">
                除摄影作品集演示外，任何未经周亭燃本人书面授权的商业、非商业下载、改编、印刷及数字再分发均为非法。
              </p>
            </div>
          </motion.aside>
          )}
        </motion.div>

        <AnimatePresence>
          {previewOpen && previewUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) handleCancelDownload();
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#f5f5f0] border border-neutral-300 max-w-4xl w-full"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300">
                  <div className="flex items-center gap-3">
                    <Download className="w-4 h-4 text-red-700" />
                    <span className="font-mono text-xs text-neutral-600 uppercase tracking-wider">Download Preview</span>
                  </div>
                  <button
                    onClick={handleCancelDownload}
                    className="p-2 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <img
                      src={previewUrl}
                      alt="Watermarked Preview"
                      className="max-w-full max-h-[60vh] object-contain shadow-xl"
                    />
                  </div>

                  <div className="text-center mb-4">
                    <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                      {photo.title.toUpperCase()} · THEO_{photo.id.toUpperCase()}_WATERMARKED.jpg
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleCancelDownload}
                      className="px-6 py-3 bg-neutral-200 text-neutral-700 font-mono text-xs uppercase tracking-wider hover:bg-neutral-300 hover:text-neutral-900 transition-colors cursor-pointer border border-neutral-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDownload}
                      className="px-6 py-3 bg-red-700 text-white font-mono text-xs uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}