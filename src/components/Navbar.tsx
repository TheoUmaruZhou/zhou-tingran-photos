/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, SlidersHorizontal, Map, Sun, Moon } from 'lucide-react';
import { Category, Project } from '../types';
import { CATEGORIES_INFO, PROJECTS_INFO } from '../data';
import { useTheme } from '../context/ThemeContext';

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
  const { dark, toggle: toggleTheme } = useTheme();
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
    <nav id="app-navbar-main" className="w-full bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-300 dark:border-neutral-700 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <div
          id="navbar-brand-logo"
          onClick={() => handleNormalTabClick('home')}
          className="cursor-pointer group flex items-baseline gap-2"
        >
          <span className="font-display font-black text-2xl tracking-tighter text-[#1a1a1a] dark:text-[#ebebeb] group-hover:text-red-600 transition-colors uppercase">
            Theodore©
          </span>
          <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 tracking-widest uppercase hidden md:inline">
            LAND & TOPOGRAPHY ARCHIVE
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider">
          <button
            onClick={() => handleNormalTabClick('home')}
            className={`cursor-pointer transition-colors hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] uppercase ${
              activeTab === 'home' ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400'
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
              className={`cursor-pointer transition-colors hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] uppercase flex items-center gap-1 py-4 ${
                activeTab === 'works' && !selectedProject ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Works / 作品分类
              <span className={`w-1.5 h-1.5 rounded-full bg-red-600 transition-opacity ${selectedCategory ? 'opacity-100' : 'opacity-0'}`}></span>
            </button>

            {showWorksDropdown && (
              <div className="absolute top-12 left-0 w-56 bg-[#e0e0e0] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 p-2 shadow-xl flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className="w-full text-left px-3 py-2 text-[10.5px] text-neutral-600 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all font-mono"
                >
                  ALL WORKS / 全部作品
                </button>
                {Object.values(Category).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-3 py-2 text-[10.5px] transition-all font-mono flex items-center justify-between ${
                      selectedCategory === cat ? 'text-[#1a1a1a] dark:text-[#ebebeb] bg-neutral-200 dark:bg-neutral-800 font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <span>{CATEGORIES_INFO[cat].nameZh}</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-[9px]">{CATEGORIES_INFO[cat].nameEn}</span>
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
              onClick={() => handleProjectClick(Project.OldTowns)}
              className={`cursor-pointer transition-colors hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] uppercase flex items-center gap-1 py-4 ${
                selectedProject ? 'text-red-600 font-bold' : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              Regional Projects / 区域专案
              <span className={`w-1.5 h-1.5 rounded-full bg-red-600 transition-opacity ${selectedProject ? 'opacity-100' : 'opacity-0'}`}></span>
            </button>

            {showProjectsDropdown && (
              <div className="absolute top-12 left-0 w-64 bg-[#e0e0e0] dark:bg-[#2a2a2a] border border-neutral-300 dark:border-neutral-700 p-2 shadow-xl flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
                {Object.values(Project).map((proj) => (
                  <button
                    key={proj}
                    onClick={() => handleProjectClick(proj)}
                    className={`w-full text-left px-3 py-2 text-[10.5px] transition-all font-mono flex items-center justify-between ${
                      selectedProject === proj ? 'text-red-600 bg-neutral-200 dark:bg-neutral-800 font-bold' : 'text-neutral-600 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] hover:bg-neutral-200 dark:hover:bg-neutral-700'
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
            className={`cursor-pointer transition-colors hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] uppercase ${
              activeTab === 'about' ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            About & Inquiries / 关于与联络
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 font-mono text-[9px] text-neutral-400 dark:text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
          <span>CALIBRATED / ZHOUTINGRAN_ONLINE</span>
          <span className="text-neutral-300 dark:text-neutral-600">|</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors cursor-pointer"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div id="mobile-menu-drawer" className="fixed left-0 top-0 bottom-0 z-50 w-1/2 bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md flex flex-col p-6 shadow-2xl animate-slide-in-left divide-y divide-neutral-300 dark:divide-neutral-700">
            <div className="h-12 pb-4">
              <span className="font-display font-black text-xl text-[#1a1a1a] dark:text-[#ebebeb] uppercase tracking-tighter">
                Void Menu
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-start py-4 gap-4 font-mono text-sm tracking-wider">
              <button
                onClick={() => handleNormalTabClick('home')}
                className={`text-left uppercase py-1.5 hover:text-red-600 ${
                  activeTab === 'home' ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                [00] Home / 首页导航
              </button>

              <div className="pt-1">
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                  <SlidersHorizontal className="w-3 h-3" />
                  Work Classifications / 作品列表
                </span>
                <div className="grid grid-cols-1 gap-1 pl-3 border-l border-neutral-300 dark:border-neutral-700">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className="text-left text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] text-xs py-1.5"
                  >
                    ALL CAPTURES (全部作品)
                  </button>
                  {Object.values(Category).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`text-left text-xs py-1.5 flex justify-between ${
                        selectedCategory === cat ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
                      }`}
                    >
                      <span>{CATEGORIES_INFO[cat].nameZh}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{CATEGORIES_INFO[cat].nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                  <Map className="w-3 h-3" />
                  On-Going Projects / 区域专案
                </span>
                <div className="grid grid-cols-1 gap-1 pl-3 border-l border-neutral-300 dark:border-neutral-700">
                  {Object.values(Project).map((proj) => (
                    <button
                      key={proj}
                      onClick={() => handleProjectClick(proj)}
                      className={`text-left text-xs py-1.5 flex justify-between ${
                        selectedProject === proj ? 'text-red-600 font-bold' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
                      }`}
                    >
                      <span>专题: {PROJECTS_INFO[proj].nameZh}</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{PROJECTS_INFO[proj].duration}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleNormalTabClick('about')}
                className={`text-left uppercase py-2 border-t border-neutral-300 dark:border-neutral-700 hover:text-red-600 mt-2 ${
                  activeTab === 'about' ? 'text-[#1a1a1a] dark:text-[#ebebeb] font-bold' : 'text-neutral-500 dark:text-neutral-400'
                }`}
              >
                About & Inquiries / 关于与联络
              </button>
            </div>

            <div className="py-6 font-mono text-[9px] text-neutral-500 dark:text-neutral-400">
              © CHEN LU PHOTOGRAPHY ARCHIVES. METADATA REVISION 2026.
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
