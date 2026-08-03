/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import GalleryGrid from './components/GalleryGrid';
import Lightbox from './components/Lightbox';
import AboutContact from './components/AboutContact';
import MobileBottomNav from './components/MobileBottomNav';
import SplashScreen from './components/SplashScreen';
import VideoGallery from './components/VideoGallery';
import PhotoSorter from './components/PhotoSorter';
import { Category, Project, Photograph } from './types';
import { ArrowUp } from 'lucide-react';
import { PHOTOGRAPHS } from './data';
import { trackPageView } from './utils/analytics';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'works' | 'videos' | 'about' | 'sorter'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [activePhoto, setActivePhoto] = useState<Photograph | null>(null);
  const [activePhotoList, setActivePhotoList] = useState<Photograph[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [splashDone, setSplashDone] = useState(() => {
    // 如果是通过分享链接访问，跳过开屏动画
    const params = new URLSearchParams(window.location.search);
    const hasPhotoParam = params.get('photo') !== null;
    return hasPhotoParam || sessionStorage.getItem('splash_shown') === 'true';
  });

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
    sessionStorage.setItem('splash_shown', 'true');
  }, []);

  // 处理浏览器返回操作（包括边缘滑动）
  useEffect(() => {
    const handlePopState = () => {
      // 如果当前在 Lightbox 中，关闭 Lightbox
      if (activePhoto) {
        setActivePhoto(null);
        setActivePhotoList([]);
        // 重新添加历史记录，防止退出网站
        window.history.pushState({ from: 'lightbox' }, '', window.location.pathname);
      } 
      // 如果当前在作品列表中，返回主页
      else if (activeTab === 'works') {
        setActiveTab('home');
        setSelectedCategory(null);
        setSelectedProject(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // 重新添加历史记录
        window.history.pushState({ from: 'works' }, '', window.location.pathname);
      }
      // 如果当前在视频页面，返回主页
      else if (activeTab === 'videos') {
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState({ from: 'videos' }, '', window.location.pathname);
      }
      // 如果当前在关于页面，返回主页
      else if (activeTab === 'about') {
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState({ from: 'about' }, '', window.location.pathname);
      }
      // 如果在主页，不做任何操作（允许退出网站）
    };

    window.addEventListener('popstate', handlePopState);
    
    // 初始化历史记录
    window.history.replaceState({ from: 'home' }, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activePhoto, activeTab]);

  // 当打开 Lightbox 时，添加历史记录
  useEffect(() => {
    if (activePhoto) {
      window.history.pushState({ from: 'lightbox' }, '', window.location.pathname);
    }
  }, [activePhoto]);

  // 当切换到作品列表时，添加历史记录
  useEffect(() => {
    if (activeTab === 'works' && !activePhoto) {
      window.history.pushState({ from: 'works' }, '', window.location.pathname);
    }
  }, [activeTab, activePhoto]);

  // 当切换到视频页面时，添加历史记录
  useEffect(() => {
    if (activeTab === 'videos') {
      window.history.pushState({ from: 'videos' }, '', window.location.pathname);
    }
  }, [activeTab]);

  // 当切换到关于页面时，添加历史记录
  useEffect(() => {
    if (activeTab === 'about') {
      window.history.pushState({ from: 'about' }, '', window.location.pathname);
    }
  }, [activeTab]);

  // 处理分享链接 - 在开屏动画完成后执行
  useEffect(() => {
    if (!splashDone) return;

    const params = new URLSearchParams(window.location.search);
    const photoId = params.get('photo');
    if (photoId) {
      const photo = PHOTOGRAPHS.find((p) => p.id === photoId);
      if (photo) {
        setActiveTab('works');
        setActivePhoto(photo);
        setActivePhotoList(PHOTOGRAPHS);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [splashDone]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  // 跟踪页面浏览
  useEffect(() => {
    const pathMap: Record<string, string> = {
      'home': '/',
      'works': '/works',
      'videos': '/videos',
      'about': '/about',
    };
    trackPageView(pathMap[activeTab] || '/');
  }, [activeTab]);

  const handleSelectCategoryFromHome = (category: Category) => {
    setSelectedCategory(category);
    setSelectedProject(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProjectFromHome = (project: Project) => {
    setSelectedProject(project);
    setSelectedCategory(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAllFromHome = () => {
    setSelectedCategory(null);
    setSelectedProject(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLightbox = (photo: Photograph, list: Photograph[]) => {
    setActivePhoto(photo);
    setActivePhotoList(list);
  };

  const handleCloseLightbox = () => {
    setActivePhoto(null);
    setActivePhotoList([]);
  };

  const handleNextPhoto = () => {
    if (!activePhoto || activePhotoList.length <= 1) return;
    const currentIndex = activePhotoList.findIndex((p) => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % activePhotoList.length;
    setActivePhoto(activePhotoList[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto || activePhotoList.length <= 1) return;
    const currentIndex = activePhotoList.findIndex((p) => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + activePhotoList.length) % activePhotoList.length;
    setActivePhoto(activePhotoList[prevIndex]);
  };

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-[#ebebeb] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#ebebeb] font-sans flex flex-col justify-start transition-colors duration-300">
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <Navbar
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        selectedProject={selectedProject}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={setSelectedCategory}
        onSelectProject={setSelectedProject}
      />

      <main id="app-main-content" className="flex-1 w-full flex flex-col items-center pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <HomeHero
                onNavigateToCategory={handleSelectCategoryFromHome}
                onNavigateToProject={handleSelectProjectFromHome}
                onExploreAll={handleExploreAllFromHome}
                startTyping={splashDone}
              />
            </motion.div>
          )}

          {activeTab === 'works' && (
            <motion.div
              key="works"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-6"
            >
              <GalleryGrid
                initialCategory={selectedCategory}
                initialProject={selectedProject}
                activePhotoId={activePhoto?.id ?? null}
                onPhotoClick={handleOpenLightbox}
              />
            </motion.div>
          )}

          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-6"
            >
              <VideoGallery />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full pt-6"
            >
              <AboutContact />
            </motion.div>
          )}

          {/* 图片排序管理工具 - 仅在开发环境可用 */}
          {activeTab === 'sorter' && window.location.hostname === 'localhost' && (
            <motion.div
              key="sorter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <PhotoSorter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence mode="wait">
        {activePhoto && (
          <Lightbox
            photo={activePhoto}
            filteredList={activePhotoList}
            onClose={handleCloseLightbox}
            onNext={handleNextPhoto}
            onPrev={handlePrevPhoto}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-8 lg:bottom-8 z-40 w-12 h-12 bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] flex items-center justify-center hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors shadow-lg cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <MobileBottomNav
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <footer id="app-footer-minimal" className="w-full py-16 bg-[#ddd] dark:bg-[#111] border-t border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300 relative overflow-hidden">
        {/* 背景装饰线 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-30" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2 group">
            <span className="font-display font-black text-[#1a1a1a] dark:text-[#ebebeb] text-lg tracking-tighter uppercase group-hover:text-red-700 transition-colors duration-300">
              Theodore©️zhou
            </span>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 uppercase relative">
              MAPPING TIME, ENVIRONMENT & HUMAN BOUNDARIES SINCE 2023
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-500" />
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-red-700 transition-colors text-left relative group"
            >
              <span>[ HOME ]</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedProject(null);
                setActiveTab('works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-red-700 transition-colors text-left relative group"
            >
              <span>[ WORKS ]</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => {
                setActiveTab('videos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-red-700 transition-colors text-left relative group"
            >
              <span>[ VIDEOS ]</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-red-700 transition-colors text-left relative group"
            >
              <span>[ ABOUT ]</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300" />
            </button>
          </div>

          <div className="text-left md:text-right font-mono text-[10px] text-neutral-500 dark:text-neutral-500">
            <p className="hover:text-red-700 transition-colors duration-300">DESIGN INSPIRED BY SHANGHAIS BRUTALIST SPACE AGENCIES</p>
            <p className="mt-1">©️ 2026 THEO PHOTOGRAPHY ZHOU</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
