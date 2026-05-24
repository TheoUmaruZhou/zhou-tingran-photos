/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, Cpu, Compass, Settings, Calendar, Eye } from 'lucide-react';
import { Photograph } from '../types';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNext, onPrev]);

  const currentIndex = filteredList.findIndex((p) => p.id === photo.id);
  const totalCount = filteredList.length;

  return (
    <AnimatePresence>
      <div
        id="lightbox-viewport"
        className="fixed inset-0 z-50 overflow-y-auto bg-[#ebebeb]/98 flex flex-col justify-start"
      >
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-neutral-300 bg-[#ebebeb]/95 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4 font-mono text-xs text-neutral-600">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="tracking-widest uppercase">SPECIMEN PREVIEW</span>
            <span className="text-neutral-400">/</span>
            <span>
              INDEX [{currentIndex + 1} OF {totalCount}]
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-neutral-400 hidden md:inline">
              [← / → KEYBOARD KEYS ACTION]
            </span>
            <button
              id="lightbox-close-btn"
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-[#1a1a1a] hover:bg-neutral-200 transition-colors uppercase font-mono text-xs flex items-center gap-2 cursor-pointer border border-neutral-300"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-8xl mx-auto flex flex-col lg:flex-row items-stretch select-none">
          <div className="flex-1 relative bg-neutral-300 flex items-center justify-center p-4 md:p-8 min-h-[50vh] lg:min-h-0">
            <button
              onClick={onPrev}
              title="Prev [Left Arrow]"
              className="absolute left-4 p-4 text-neutral-500 hover:text-[#1a1a1a] bg-white/50 hover:bg-white/90 hover:scale-105 transition-all z-20 cursor-pointer border border-neutral-300 rounded-none duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

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

            <button
              onClick={onNext}
              title="Next [Right Arrow]"
              className="absolute right-4 p-4 text-neutral-500 hover:text-[#1a1a1a] bg-white/50 hover:bg-white/90 hover:scale-105 transition-all z-20 cursor-pointer border border-neutral-300 rounded-none duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full lg:w-[420px] bg-[#e0e0e0] lg:border-l border-neutral-300 p-8 flex flex-col justify-between overflow-y-auto shrink-0 border-t border-neutral-300 lg:border-t-0">
            <div>
              <div className="flex justify-between items-center mb-6 font-mono text-xs">
                <span className="text-red-600 tracking-wider font-semibold uppercase">
                  {photo.category.replace('-', ' ')}
                </span>
                <span className="text-neutral-400 bg-neutral-200 px-2 py-1">
                  ID: {photo.id.toUpperCase()}
                </span>
              </div>

              <h3 className="text-3xl font-display font-extrabold text-[#1a1a1a] tracking-tight leading-none uppercase">
                {photo.title}
              </h3>
              <p className="mt-4 text-neutral-600 text-sm font-sans leading-relaxed font-light">
                {photo.desc}
              </p>

              <div className="hr-minimal my-6" />

              <h4 className="font-mono text-xs text-neutral-500 uppercase tracking-widest mb-4">
                地理归档暨拍摄参数 / GEOGRAPHIC & EXIF METADATA
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Compass className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">LOCATION</p>
                    <p className="text-sm text-neutral-800 mt-0.5">{photo.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">TIMESTEP YEAR</p>
                    <p className="text-sm text-neutral-800 mt-0.5">{photo.year} A.D.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Camera className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">CAMERA BODY</p>
                    <p className="text-sm text-neutral-800 mt-0.5 font-mono">{photo.exif.camera}</p>
                    <span className="inline-block mt-1 font-mono text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 tracking-wider font-semibold uppercase">
                      {photo.exif.format}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Settings className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">OPTICAL GLASS</p>
                    <p className="text-sm text-neutral-800 mt-0.5 font-mono">{photo.exif.lens}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">EXPOSURE FORMULA</p>
                    <p className="text-sm text-green-600 mt-0.5 font-mono">{photo.exif.exposure}</p>
                    <p className="text-xs text-neutral-500 font-mono">Focal Length: {photo.exif.focalLength}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-neutral-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400">
                <Eye className="w-3 h-3 text-red-600" />
                <span>ALL RIGHTS RESERVED ZHOU©️</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-normal font-sans">
                除摄影作品集演示外，任何未经周亭燃本人书面授权的商业、非商业下载、改编、印刷及数字再分发均为非法。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
