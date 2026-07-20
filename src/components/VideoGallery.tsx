/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Eye, Calendar, Clock, Tag } from 'lucide-react';
import { Video, VideoCategory, VideoCategoryDetails } from '../types';
import { VIDEOS, VIDEO_CATEGORIES_INFO } from '../data';

interface VideoGalleryProps {
  initialCategory?: VideoCategory | null;
}

export default function VideoGallery({ initialCategory = null }: VideoGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | null>(initialCategory);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = selectedCategory
    ? VIDEOS.filter((v) => v.category === selectedCategory)
    : VIDEOS;

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const formatViews = (views?: number) => {
    if (!views) return '';
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}万`;
    }
    return views.toString();
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-8">
      {/* 标题 */}
      <div className="mb-12">
        <span className="font-mono text-xs text-red-600 tracking-widest uppercase">
          03 / 视频专栏 - VIDEO GALLERY
        </span>
        <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight mt-2 text-[#1a1a1a] dark:text-[#ebebeb] uppercase">
          Videos
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl mt-4 leading-relaxed font-sans font-light">
          探索摄影创作的幕后故事、创作过程记录与实地考察纪录片。每一段影像都承载着对光影与空间的思考。
        </p>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a]'
              : 'bg-[#e0e0e0] dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          全部 / All
        </button>
        {Object.values(VideoCategory).map((cat) => {
          const info = VIDEO_CATEGORIES_INFO[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a]'
                  : 'bg-[#e0e0e0] dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {info.nameZh}
            </button>
          );
        })}
      </div>

      {/* 视频网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
            onClick={() => handleVideoClick(video)}
            className="group relative bg-[#e8e8e8] dark:bg-[#222222] overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300 border border-neutral-300 dark:border-neutral-700 hover:border-red-600/50 dark:hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-600/10 hover:-translate-y-1"
          >
            {/* 视频封面 */}
            <div className="aspect-video w-full overflow-hidden relative">
              <img
                src={video.coverUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* 播放按钮 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-125 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-red-500/50">
                  <Play className="w-8 h-8 text-[#1a1a1a] ml-1 group-hover:text-white transition-colors" />
                </div>
              </div>
              {/* 时长标签 */}
              <div className="absolute bottom-3 right-3 font-mono text-xs bg-black/70 group-hover:bg-red-600 text-white px-2 py-1 tracking-wider transition-colors duration-300">
                {video.duration}
              </div>
            </div>

            {/* 视频信息 */}
            <div className="p-5 relative">
              {/* 顶部红线 */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <h3 className="text-lg font-display font-bold text-[#1a1a1a] dark:text-[#ebebeb] mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2 font-sans font-light">
                {video.description}
              </p>
              <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 group-hover:text-red-600 transition-colors">
                    <Calendar className="w-3 h-3" />
                    {video.uploadDate}
                  </span>
                  {video.views && (
                    <span className="flex items-center gap-1 group-hover:text-red-600 transition-colors">
                      <Eye className="w-3 h-3" />
                      {formatViews(video.views)}
                    </span>
                  )}
                </div>
                <span className="font-mono uppercase tracking-wider text-red-600 group-hover:translate-x-1 transition-transform">
                  播放 →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 视频播放器弹窗 */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={handleCloseVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={handleCloseVideo}
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>

              {/* 视频标题 */}
              <div className="mb-4">
                <h3 className="text-xl font-display font-bold text-white">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.titleEn && (
                  <p className="text-sm text-white/60 mt-1">{selectedVideo.titleEn}</p>
                )}
              </div>

              {/* B站视频播放器 */}
              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`//player.bilibili.com/player.html?bvid=${selectedVideo.bvid}&autoplay=1&high_quality=1`}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>

              {/* 视频信息 */}
              <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedVideo.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedVideo.uploadDate}
                  </span>
                  {selectedVideo.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(selectedVideo.views)} 播放
                    </span>
                  )}
                </div>
                {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {selectedVideo.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}