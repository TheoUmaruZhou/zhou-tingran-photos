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
import CustomCursor from './components/CustomCursor';
import MobileBottomNav from './components/MobileBottomNav';
import Guestbook from './components/Guestbook';
import SplashScreen from './components/SplashScreen';
import { Category, Project, Photograph } from './types';
import { ArrowUp } from 'lucide-react';
import { PHOTOGRAPHS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'works' | 'about'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [activePhoto, setActivePhoto] = useState<Photograph | null>(null);
  const [activePhotoList, setActivePhotoList] = useState<Photograph[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [guestbookOpen, setGuestbookOpen] = useState(false);
  const [splashDone, setSplashDone] = useState(() => sessionStorage.getItem('splash_shown') === 'true');

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
    sessionStorage.setItem('splash_shown', 'true');
  }, []);

  useEffect(() => {
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
  }, []);

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
      <CustomCursor />
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
        onOpenGuestbook={() => setGuestbookOpen(true)}
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
                onPhotoClick={handleOpenLightbox}
              />
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
        </AnimatePresence>
      </main>

      {activePhoto && (
        <Lightbox
          photo={activePhoto}
          filteredList={activePhotoList}
          onClose={handleCloseLightbox}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
        />
      )}

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

      <Guestbook isOpen={guestbookOpen} onClose={() => setGuestbookOpen(false)} />

      <MobileBottomNav
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGuestbook={() => setGuestbookOpen(true)}
      />

      <footer id="app-footer-minimal" className="w-full py-16 bg-[#ddd] dark:bg-[#111] border-t border-neutral-300 dark:border-neutral-700 font-mono text-xs text-neutral-600 dark:text-neutral-400 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-display font-black text-[#1a1a1a] dark:text-[#ebebeb] text-lg tracking-tighter uppercase">
              Theodore©️zhou
            </span>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-500 uppercase">
              MAPPING TIME, ENVIRONMENT & HUMAN BOUNDARIES SINCE 2023
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors text-left"
            >
              [ HOME ]
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedProject(null);
                setActiveTab('works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors text-left"
            >
              [ WORKS ]
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors text-left"
            >
              [ ABOUT ]
            </button>
          </div>

          <div className="text-left md:text-right font-mono text-[10px] text-neutral-500 dark:text-neutral-500">
            <p>DESIGN INSPIRED BY SHANGHAIS BRUTALIST SPACE AGENCIES</p>
            <p className="mt-1">©️ 2026 THEO PHOTOGRAPHY ZHOU</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
