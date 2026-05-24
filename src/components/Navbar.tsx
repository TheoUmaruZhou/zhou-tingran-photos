/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, SlidersHorizontal, Map } from 'lucide-react';
import { Category, Project } from '../types';
import { CATEGORIES_INFO, PROJECTS_INFO } from '../data';

interface NavbarProps {
  activeTab: 'home' | 'works' | 'about';
  selectedCategory: Category | null;
  selectedProject: Project | null;
  onNavigateTab: (tab: 'home' | 'works' | 'about') => void;
  onSelectCategory: (category: Category | null) => void;
  onSelectProject: (project: Project | null) => void;
}

export default function Navbar({
  activeTab,
  selectedCategory,
  selectedProject,
  onNavigateTab,
  onSelectCategory,
  onSelectProject,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWorksDropdown, setShowWorksDropdown] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

  const handleCategoryClick = (cat: Category | null) => {
    onSelectCategory(cat);
    onSelectProject(null);
    onNavigateTab('works');
    setShowWorksDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleProjectClick = (proj: Project | null) => {
    onSelectProject(proj);
    onSelectCategory(null);
    onNavigateTab('works');
    setShowProjectsDropdown(false);
    setMobileMenuOpen(false);
  };

  const handleNormalTabClick = (tab: 'home' | 'about') => {
    onSelectCategory(null);
    onSelectProject(null);
    onNavigateTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav id="app-navbar-main" className="w-full bg-[#ebebeb]/95 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-300 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div
          id="navbar-brand-logo"
          onClick={() => handleNormalTabClick('home')}
          className="cursor-pointer group flex items-baseline gap-2"
        >
          <span className="font-display font-black text-2xl tracking-tighter text-[#1a1a1a] group-hover:text-red-600 transition-colors uppercase">
            Theodore©
          </span>
          <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase hidden md:inline">
            LAND & TOPOGRAPHY ARCHIVE
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider">
          <button
            onClick={() => handleNormalTabClick('home')}
            className={`cursor-pointer transition-colors hover:text-[#1a1a1a] uppercase ${
              activeTab === 'home' ? 'text-[#1a1a1a] font-bold' : 'text-neutral-500'
            }`}
          >
            Home / 首页
          </button>

          <div
            className="relative"
            onMouseEnter={() => setShowWorksDropdown(true)}
            onMouseLeave={() => setShowWorksDropdown(false)}
          >
            <button
              id="nav-works-dropdown-btn"
              onClick={() => handleCategoryClick(null)}
              className={`cursor-pointer transition-colors hover:text-[#1a1a1a] uppercase flex items-center gap-1 py-4 ${
                activeTab === 'works' && !selectedProject ? 'text-[#1a1a1a] font-bold' : 'text-neutral-500'
              }`}
            >
              Works / 作品分类
              <span className={`w-1.5 h-1.5 rounded-full bg-red-600 transition-opacity ${selectedCategory ? 'opacity-100' : 'opacity-0'}`}></span>
            </button>

            {showWorksDropdown && (
              <div className="absolute top-12 left-0 w-56 bg-[#e0e0e0] border border-neutral-300 p-2 shadow-xl flex flex-col divide-y divide-neutral-300">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="w-full text-left px-3 py-2 text-[10.5px] text-neutral-600 hover:text-[#1a1a1a] hover:bg-neutral-200 transition-all font-mono"
                >
                  ALL WORKS / 全部作品
                </button>
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-3 py-2 text-[10.5px] transition-all font-mono flex items-center justify-between ${
                      selectedCategory === cat ? 'text-[#1a1a1a] bg-neutral-200 font-bold' : 'text-neutral-600 hover:text-[#1a1a1a] hover:bg-neutral-200'
                    }`}
                  >
                    <span>{CATEGORIES_INFO[cat].nameZh}</span>
                    <span className="text-neutral-400 text-[9px]">{CATEGORIES_INFO[cat].nameEn}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setShowProjectsDropdown(true)}
            onMouseLeave={() => setShowProjectsDropdown(false)}
          >
            <button
              id="nav-projects-dropdown-btn"
              onClick={() => handleProjectClick(null)}
              className={`cursor-pointer transition-colors hover:text-[#1a1a1a] uppercase flex items-center gap-1 py-4 ${
                selectedProject ? 'text-red-600 font-bold' : 'text-neutral-500'
              }`}
            >
              Regional Projects / 区域专案
              <span className={`w-1.5 h-1.5 rounded-full bg-red-600 transition-opacity ${selectedProject ? 'opacity-100' : 'opacity-0'}`}></span>
            </button>

            {showProjectsDropdown && (
              <div className="absolute top-12 left-0 w-64 bg-[#e0e0e0] border border-neutral-300 p-2 shadow-xl flex flex-col divide-y divide-neutral-300">
                {Object.values(Project).map((proj) => (
                  <button
                    key={proj}
                    onClick={() => handleProjectClick(proj)}
                    className={`w-full text-left px-3 py-2 text-[10.5px] transition-all font-mono flex items-center justify-between ${
                      selectedProject === proj ? 'text-red-600 bg-neutral-200 font-bold' : 'text-neutral-600 hover:text-[#1a1a1a] hover:bg-neutral-200'
                    }`}
                  >
                    <span>专题: {PROJECTS_INFO[proj].nameZh}</span>
                    <span className="text-red-400 text-[9px] font-mono">{PROJECTS_INFO[proj].duration.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNormalTabClick('about')}
            className={`cursor-pointer transition-colors hover:text-[#1a1a1a] uppercase ${
              activeTab === 'about' ? 'text-[#1a1a1a] font-bold' : 'text-neutral-500'
            }`}
          >
            About & Inquiries / 关于与联络
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-mono text-[9px] text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
          <span>CALIBRATED / ZHOUTINGRAN_ONLINE</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-neutral-500 hover:text-[#1a1a1a] bg-neutral-200 border border-neutral-300"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="fixed inset-0 z-50 bg-[#ebebeb] flex flex-col p-6 animate-fade-in divide-y divide-neutral-300">
          <div className="flex items-center justify-between h-14 pb-4">
            <span className="font-display font-black text-xl text-[#1a1a1a] uppercase tracking-tighter">
              Void Menu
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-500 hover:text-[#1a1a1a] bg-neutral-200"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-start py-8 gap-6 font-mono text-sm tracking-widest overflow-y-auto">
            <button
              onClick={() => handleNormalTabClick('home')}
              className={`text-left uppercase py-2 hover:text-red-600 ${
                activeTab === 'home' ? 'text-[#1a1a1a] font-bold text-lg' : 'text-neutral-500'
              }`}
            >
              [00] Home / 首页导航
            </button>

            <div className="pt-2">
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                <SlidersHorizontal className="w-3 h-3" />
                Work Classifications / 作品列表
              </span>
              <div className="grid grid-cols-1 gap-1 pl-4 border-l border-neutral-300">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="text-left text-neutral-500 hover:text-[#1a1a1a] text-xs py-1.5"
                >
                  ALL CAPTURES (全部作品)
                </button>
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-left text-xs py-1.5 flex justify-between ${
                      selectedCategory === cat ? 'text-[#1a1a1a] font-bold' : 'text-neutral-500 hover:text-[#1a1a1a]'
                    }`}
                  >
                    <span>{CATEGORIES_INFO[cat].nameZh}</span>
                    <span className="text-[10px] text-neutral-400">{CATEGORIES_INFO[cat].nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Map className="w-3 h-3" />
                On-Going Projects / 区域专案
              </span>
              <div className="grid grid-cols-1 gap-1 pl-4 border-l border-neutral-300">
                {Object.values(Project).map((proj) => (
                  <button
                    key={proj}
                    onClick={() => handleProjectClick(proj)}
                    className={`text-left text-xs py-1.5 flex justify-between ${
                      selectedProject === proj ? 'text-red-600 font-bold' : 'text-neutral-500 hover:text-[#1a1a1a]'
                    }`}
                  >
                    <span>专题: {PROJECTS_INFO[proj].nameZh}</span>
                    <span className="text-[10px] text-neutral-400">{PROJECTS_INFO[proj].duration}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleNormalTabClick('about')}
              className={`text-left uppercase py-4 border-t border-neutral-300 hover:text-red-600 mt-auto ${
                activeTab === 'about' ? 'text-[#1a1a1a] font-bold text-lg' : 'text-neutral-500'
              }`}
            >
              About & Inquiries / 关于与联络
            </button>
          </div>

          <div className="py-6 font-mono text-[9px] text-neutral-500">
            © CHEN LU PHOTOGRAPHY ARCHIVES. METADATA REVISION 2026.
          </div>
        </div>
      )}
    </nav>
  );
}
