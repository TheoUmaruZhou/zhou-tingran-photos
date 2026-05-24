/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import GalleryGrid from './components/GalleryGrid';
import Lightbox from './components/Lightbox';
import AboutContact from './components/AboutContact';
import { Category, Project, Photograph } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'works' | 'about'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [activePhoto, setActivePhoto] = useState<Photograph | null>(null);
  const [activePhotoList, setActivePhotoList] = useState<Photograph[]>([]);

  const handleSelectCategoryFromHome = (category: Category) => {
    setSelectedCategory(category);
    setSelectedProject(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectProjectFromHome = (project: Project) => {
    setSelectedProject(project);
    setSelectedCategory(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleExploreAllFromHome = () => {
    setSelectedCategory(null);
    setSelectedProject(null);
    setActiveTab('works');
    window.scrollTo({ top: 0, behavior: 'instant' });
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
    <div id="app-root-wrapper" className="min-h-screen bg-[#ebebeb] text-[#1a1a1a] font-sans flex flex-col justify-start">
      <Navbar
        activeTab={activeTab}
        selectedCategory={selectedCategory}
        selectedProject={selectedProject}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onSelectCategory={setSelectedCategory}
        onSelectProject={setSelectedProject}
      />

      <main id="app-main-content" className="flex-1 w-full flex flex-col items-center">
        {activeTab === 'home' && (
          <HomeHero
            onNavigateToCategory={handleSelectCategoryFromHome}
            onNavigateToProject={handleSelectProjectFromHome}
            onExploreAll={handleExploreAllFromHome}
          />
        )}

        {activeTab === 'works' && (
          <div className="w-full animate-fade-in pt-6">
            <GalleryGrid
              initialCategory={selectedCategory}
              initialProject={selectedProject}
              onPhotoClick={handleOpenLightbox}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div className="w-full animate-fade-in pt-6">
            <AboutContact />
          </div>
        )}
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

      <footer id="app-footer-minimal" className="w-full py-16 bg-[#ddd] border-t border-neutral-300 font-mono text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-display font-black text-[#1a1a1a] text-lg tracking-tighter uppercase">
              Theodore©️zhou
            </span>
            <p className="text-[10px] text-neutral-500 uppercase">
              MAPPING TIME, ENVIRONMENT & HUMAN BOUNDARIES SINCE 2023
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="hover:text-[#1a1a1a] transition-colors text-left"
            >
              [ HOME ]
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedProject(null);
                setActiveTab('works');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="hover:text-[#1a1a1a] transition-colors text-left"
            >
              [ WORKS ]
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="hover:text-[#1a1a1a] transition-colors text-left"
            >
              [ ABOUT ]
            </button>
          </div>

          <div className="text-left md:text-right font-mono text-[10px] text-neutral-500">
            <p>DESIGN INSPIRED BY SHANGHAIS BRUTALIST SPACE AGENCIES</p>
            <p className="mt-1">©️ 2026 THEO PHOTOGRAPHY ZHOU</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
