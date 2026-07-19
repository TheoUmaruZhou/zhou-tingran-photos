/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, useInView } from 'motion/react';
import { LayoutGrid, Grid3X3, StretchHorizontal, SlidersHorizontal, MapPin, Calendar, Info, ChevronDown } from 'lucide-react';
import { Category, Project, Photograph } from '../types';
import { CATEGORIES_INFO, PROJECTS_INFO, PHOTOGRAPHS } from '../data';
import AnimatedCounter from './AnimatedCounter';

interface GalleryGridProps {
  initialCategory?: Category | null;
  initialProject?: Project | null;
  activePhotoId?: string | null;
  onPhotoClick: (photo: Photograph, filteredList: Photograph[]) => void;
}

function ScrollRevealItem({ index, children }: { index: number; children: ReactNode; key?: string | number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.95 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.02, 0.4),
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function GalleryGrid({
  initialCategory = null,
  initialProject = null,
  activePhotoId = null,
  onPhotoClick,
}: GalleryGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedProject, setSelectedProject] = useState<Project | null>(initialProject);

  const [colsMode, setColsMode] = useState<1 | 2 | 3>(3);

  const [showTechnicalStats, setShowTechnicalStats] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 30;

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  }, []);

  useMemo(() => {
    if (initialCategory !== null || initialProject !== null) {
      setSelectedCategory(initialCategory);
      setSelectedProject(initialProject);
    }
  }, [initialCategory, initialProject]);

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedProject(null);
    setPage(1);
  };

  const filteredPhotographs = useMemo(() => {
    return PHOTOGRAPHS.filter((p) => {
      if (selectedProject) {
        return p.project === selectedProject;
      }
      if (selectedCategory) {
        return p.category === selectedCategory;
      }
      return true; // 全部作品：显示所有照片
    });
  }, [selectedCategory, selectedProject]);

  const visiblePhotographs = useMemo(() => {
    return filteredPhotographs.slice(0, page * itemsPerPage);
  }, [filteredPhotographs, page]);

  useEffect(() => {
    if (!activePhotoId) return;

    const activeIndex = filteredPhotographs.findIndex((photo) => photo.id === activePhotoId);
    if (activeIndex === -1) return;

    const targetPage = Math.ceil((activeIndex + 1) / itemsPerPage);
    if (targetPage > page) {
      setPage(targetPage);
      return;
    }

    const targetCard = document.querySelector(`[data-photo-id="${activePhotoId}"]`) as HTMLElement | null;
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activePhotoId, filteredPhotographs, page]);

  const hasMore = filteredPhotographs.length > page * itemsPerPage;

  const headerDetails = useMemo(() => {
    if (selectedProject) {
      const info = PROJECTS_INFO[selectedProject];
      return {
        title: info.nameZh,
        subtitle: info.nameEn,
        intro: info.intro,
        extra: info.background,
        meta: `记录年份：2025 - 2026 · 拍摄区域：重庆`,
      };
    }
    if (selectedCategory) {
      const info = CATEGORIES_INFO[selectedCategory];
      return {
        title: info.nameZh,
        subtitle: info.nameEn,
        intro: info.desc,
        extra: '',
        meta: '作品档案 / WORKS GENRE CLASSIFICATION',
      };
    }
    return {
      title: '全部摄影作品',
      subtitle: 'Complete Photographic Archives',
      intro: '基于索尼全画幅及佳能半画幅数码相机，采集城市风光、人文纪实、创意画意摄影以及新地形摄影的多维切面。',
      extra: '',
      meta: `共计 ${PHOTOGRAPHS.length} 幅被存贮底片`,
    };
  }, [selectedCategory, selectedProject]);

  return (
    <div id="gallery-grid-root" className="w-full max-w-7xl mx-auto px-6 md:px-12 pb-32 transition-colors duration-300">
      <div className="pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <span className="font-mono text-xs text-red-600 tracking-widest block uppercase mb-3">
              {!selectedCategory && !selectedProject
                ? <>共计 <AnimatedCounter target={PHOTOGRAPHS.length} /> 幅被存贮底片</>
                : headerDetails.meta}
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-[#1a1a1a] dark:text-[#ebebeb] uppercase">
              {headerDetails.title}
              <span className="font-mono text-xl text-neutral-500 dark:text-neutral-400 font-light block mt-2 uppercase">
                {headerDetails.subtitle}
              </span>
            </h2>
            <p className="mt-6 text-neutral-600 dark:text-neutral-400 text-lg md:text-xl font-sans font-light leading-relaxed max-w-3xl">
              {headerDetails.intro}
            </p>

            {headerDetails.extra && (
              <div className="mt-6 bg-[#e0e0e0] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 p-6 max-w-3xl rounded-none">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-neutral-500 dark:text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                      《此地：记忆》创作背景  /  CREATION BACKGROUND
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans font-light">
                      {headerDetails.extra}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 lg:text-right flex flex-col gap-4 justify-end lg:h-full lg:pt-8">
            <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase">
              CHAMBER STATUS: CALIBRATED <br />
              ARCHIVE CODES: {filteredPhotographs.length} CAPTURES FOUND<br />
              {hasMore && <span className="text-red-600">LOADING: {visiblePhotographs.length} / {filteredPhotographs.length}</span>}
            </div>
            {selectedCategory || selectedProject ? (
              <button
                id="reset-filter-btn"
                onClick={handleResetFilters}
                className="font-mono text-xs uppercase px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:border-[#1a1a1a] dark:hover:border-[#ebebeb] transition-all self-start lg:self-end cursor-pointer"
              >
                Clear Filters / 恢复全部
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="hr-minimal mb-8" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div id="filter-controls-group" className="flex flex-wrap gap-2 items-center">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            FILTER:
          </span>

          {Object.values(Category).map((cat) => {
            const label = CATEGORIES_INFO[cat];
            const active = selectedCategory === cat && !selectedProject;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedProject(null);
                  setPage(1);
                }}
                className={`font-mono text-xs px-3 py-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] font-semibold'
                    : 'bg-[#e0e0e0] dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
                }`}
              >
                {label.nameZh}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-2 hidden md:block" />

          {Object.values(Project).map((proj) => {
            const label = PROJECTS_INFO[proj];
            const active = selectedProject === proj;
            return (
              <button
                key={proj}
                onClick={() => {
                  setSelectedProject(proj);
                  setSelectedCategory(null);
                  setPage(1);
                }}
                className={`font-mono text-xs px-3 py-1.5 transition-all cursor-pointer ${
                  active
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-[#e0e0e0] dark:bg-[#2a2a2a] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600 hover:text-red-600'
                }`}
              >
                专题：{label.nameZh}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-6 self-end md:self-auto shrink-0">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300">
            <input
              type="checkbox"
              checked={showTechnicalStats}
              onChange={(e) => setShowTechnicalStats(e.target.checked)}
              className="accent-[#1a1a1a] dark:accent-[#ebebeb] cursor-pointer bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700"
            />
            <span>Show EXIF Details</span>
          </label>

          <div className="flex items-center bg-[#e0e0e0] dark:bg-[#2a2a2a] p-1 border border-neutral-300 dark:border-neutral-700 gap-1">
            <button
              onClick={() => setColsMode(3)}
              title="Dense Grid View"
              className={`p-1.5 cursor-pointer ${
                colsMode === 3 ? 'bg-neutral-300 dark:bg-neutral-700 text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColsMode(2)}
              title="Balanced Editorial View"
              className={`p-1.5 cursor-pointer ${
                colsMode === 2 ? 'bg-neutral-300 dark:bg-neutral-700 text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setColsMode(1)}
              title="Cinematic Strip View"
              className={`p-1.5 cursor-pointer ${
                colsMode === 1 ? 'bg-neutral-300 dark:bg-neutral-700 text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <StretchHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredPhotographs.length === 0 ? (
        <div className="w-full text-center py-24 bg-[#e0e0e0] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700">
          <p className="font-mono text-neutral-500 dark:text-neutral-400 text-sm">NO SPECIMENS RECORDED IN THIS INDEX ROUTE.</p>
          <button
            onClick={handleResetFilters}
            className="mt-4 font-mono text-xs px-4 py-2 bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-300"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div
            id="photography-images-grid"
            className={`grid gap-x-6 gap-y-12 transition-all duration-300 ${
              colsMode === 3
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : colsMode === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
          >
            {visiblePhotographs.map((photo, index) => (
              <ScrollRevealItem key={photo.id} index={index}>
                <motion.div
                  onClick={() => onPhotoClick(photo, filteredPhotographs)}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group cursor-pointer flex flex-col justify-start relative select-none"
                  data-photo-id={photo.id}
                  data-cursor-enlarge
                >
                  <div className="relative w-full overflow-hidden bg-neutral-300 dark:bg-neutral-700 aspect-[4/3] md:aspect-auto rounded-[2px] border border-transparent transition-colors duration-300 group-hover:border-neutral-400/70 dark:group-hover:border-neutral-600">
                    {!loadedImages.has(photo.id) && (
                      <div
                        className="absolute inset-0 skeleton-shimmer"
                        style={{
                          aspectRatio: colsMode === 1 ? '16/9' : photo.aspectRatio === '1:1' ? '1/1' : photo.aspectRatio === '3:4' ? '3/4' : '4/3',
                        }}
                      />
                    )}
                    <motion.div
                      layoutId={`photo-${photo.id}`}
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full h-full object-cover ${loadedImages.has(photo.id) ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        aspectRatio: colsMode === 1 ? '16/9' : photo.aspectRatio === '1:1' ? '1/1' : photo.aspectRatio === '3:4' ? '3/4' : '4/3',
                      }}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        loading="lazy"
                        onLoad={() => handleImageLoad(photo.id)}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a] dark:from-[#ebebeb] via-[#1a1a1a]/30 dark:via-[#ebebeb]/30 to-transparent p-5 opacity-0 flex flex-col justify-end min-h-[50%]"
                    >
                      <span className="font-mono text-[10px] text-red-500 tracking-wider">
                        {photo.exif.format}
                      </span>
                      <h4 className="text-lg font-display font-black text-white uppercase mt-0.5 tracking-tight">
                        {photo.title}
                      </h4>
                      <p className="text-xs text-neutral-300 font-sans mt-1 line-clamp-1">
                        {photo.desc}
                      </p>

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-600 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                          {photo.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-500 dark:text-neutral-400" />
                          {photo.year}
                        </span>
                      </div>
                    </motion.div>

                    <div className="absolute top-3 right-3 font-mono text-[9px] bg-[#1a1a1a]/75 dark:bg-[#ebebeb]/75 backdrop-blur px-2 py-1 text-neutral-400 dark:text-neutral-500 opacity-60 group-hover:opacity-100 transition-opacity">
                      {photo.exif.camera.split(' ')[0]} • {photo.exif.focalLength}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col justify-start px-1">
                    <div className="flex justify-between items-baseline">
                      <h5 className="font-display font-extrabold text-neutral-700 dark:text-neutral-300 group-hover:text-[#1a1a1a] dark:group-hover:text-[#ebebeb] transition-colors duration-300 uppercase tracking-tight text-sm">
                        {photo.title}
                      </h5>
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
                        [{photo.year}]
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                      <span className="text-neutral-400 dark:text-neutral-500">Location:</span>
                      <span className="truncate">{photo.location}</span>
                    </div>

                    {showTechnicalStats && (
                      <div className="mt-3 bg-[#e0e0e0] dark:bg-[#2a2a2a] p-3 text-[10px] font-mono border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span className="text-neutral-400 dark:text-neutral-500">BODY:</span>
                          <span>{photo.exif.camera}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400 dark:text-neutral-500">GLASS:</span>
                          <span>{photo.exif.lens}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400 dark:text-neutral-500">SPECS:</span>
                          <span>{photo.exif.exposure}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </ScrollRevealItem>
            ))}
          </div>

          {hasMore && (
            <div className="w-full flex justify-center mt-12">
              <button
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-2 font-mono text-xs px-6 py-3 bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors cursor-pointer"
              >
                <span>加载更多 / LOAD MORE</span>
                <ChevronDown className="w-4 h-4" />
                <span className="text-neutral-400">({filteredPhotographs.length - visiblePhotographs.length} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}