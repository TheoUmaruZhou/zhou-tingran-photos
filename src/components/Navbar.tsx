/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Category, Project } from '../types';
import { CATEGORIES_INFO, PROJECTS_INFO } from '../data';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'home' | 'works' | 'videos' | 'about';
  selectedCategory: Category | null;
  selectedProject: Project | null;
  onNavigateTab: (tab: 'home' | 'works' | 'videos' | 'about') => void;
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
  const [showWorksDropdown, setShowWorksDropdown] = useState(false);
  const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

  const handleCategoryClick = (cat: Category | null) => {
    onSelectCategory(cat);
    onSelectProject(null);
    onNavigateTab('works');
    setShowWorksDropdown(false);
  };

  const handleProjectClick = (proj: Project | null) => {
    onSelectProject(proj);
    onSelectCategory(null);
    onNavigateTab('works');
    setShowProjectsDropdown(false);
  };

  const handleNormalTabClick = (tab: 'home' | 'about') => {
    onSelectCategory(null);
    onSelectProject(null);
    onNavigateTab(tab);
  };

  return (
    <nav id="app-navbar-main" className="w-full bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-300 dark:border-neutral-700 select-none transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          id="navbar-brand-logo"
          onClick={() => handleNormalTabClick('home')}
          className="cursor-pointer group flex items-baseline gap-2 relative"
        >
          <span className="font-display font-black text-2xl tracking-tighter text-[#1a1a1a] dark:text-[#ebebeb] group-hover:text-red-700 transition-colors uppercase">
            Theodore©
          </span>
          <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 tracking-widest uppercase hidden md:inline group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
            LAND & TOPOGRAPHY ARCHIVE
          </span>
          {/* 底部悬停线 */}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-700 group-hover:w-full transition-all duration-300" />
        </div>

        {/* 导航链接 */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-mono tracking-wider">
          {/* 首页 */}
          <button
            onClick={() => handleNormalTabClick('home')}
            className={`cursor-pointer transition-all duration-200 uppercase relative group ${
              activeTab === 'home' ? 'text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
            }`}
          >
            <span>Home / 首页</span>
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-300 ${activeTab === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          {/* 作品下拉 */}
          <div
            className="relative"
            onMouseEnter={() => setShowWorksDropdown(true)}
            onMouseLeave={() => setShowWorksDropdown(false)}
          >
            <button
              id="nav-works-dropdown-btn"
              onClick={() => handleCategoryClick(null)}
              className={`cursor-pointer transition-all duration-200 uppercase flex items-center gap-1.5 py-4 group ${
                activeTab === 'works' && !selectedProject ? 'text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
              }`}
            >
              <span>Works / 作品</span>
              {selectedCategory && <span className="w-1.5 h-1.5 rounded-full bg-red-700" />}
              <svg className={`w-3 h-3 transition-transform duration-200 ${showWorksDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-300 ${(activeTab === 'works' && !selectedProject) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>

            {showWorksDropdown && (
              <div className="absolute top-full left-0 pt-2">
                <div className="w-56 bg-white dark:bg-[#2a2a2a] rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden">
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-4 py-3 text-xs transition-colors font-mono border-b border-neutral-100 dark:border-neutral-800 ${
                      selectedCategory === null ? 'text-red-700 bg-red-50 dark:bg-red-900/20' : 'text-neutral-600 dark:text-neutral-400 hover:text-red-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    全部作品
                  </button>
                  {Object.values(Category).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full text-left px-4 py-3 text-xs transition-colors font-mono flex items-center justify-between ${
                        selectedCategory === cat ? 'text-red-700 bg-red-50 dark:bg-red-900/20' : 'text-neutral-500 dark:text-neutral-400 hover:text-red-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                      }`}
                    >
                      <span>{CATEGORIES_INFO[cat].nameZh}</span>
                      <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">{CATEGORIES_INFO[cat].nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 专题下拉 */}
          <div
            className="relative"
            onMouseEnter={() => setShowProjectsDropdown(true)}
            onMouseLeave={() => setShowProjectsDropdown(false)}
          >
            <button
              id="nav-projects-dropdown-btn"
              onClick={() => handleProjectClick(Project.OldTowns)}
              className={`cursor-pointer transition-all duration-200 uppercase flex items-center gap-1.5 py-4 group ${
                selectedProject ? 'text-red-700' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
              }`}
            >
              <span>Projects / 专题</span>
              {selectedProject && <span className="w-1.5 h-1.5 rounded-full bg-red-700" />}
              <svg className={`w-3 h-3 transition-transform duration-200 ${showProjectsDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-300 ${selectedProject ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>

            {showProjectsDropdown && (
              <div className="absolute top-full left-0 pt-2">
                <div className="w-60 bg-white dark:bg-[#2a2a2a] rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-xl overflow-hidden">
                  {Object.values(Project).map((proj, index) => (
                    <button
                      key={proj}
                      onClick={() => handleProjectClick(proj)}
                      className={`w-full text-left px-4 py-3 text-xs transition-colors font-mono flex items-center justify-between ${
                        selectedProject === proj ? 'text-red-700 bg-red-50 dark:bg-red-900/20' : 'text-neutral-500 dark:text-neutral-400 hover:text-red-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/30'
                      } ${index > 0 ? 'border-t border-neutral-100 dark:border-neutral-800' : ''}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-[9px] text-neutral-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {PROJECTS_INFO[proj].nameZh}
                      </span>
                      <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">{PROJECTS_INFO[proj].duration.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 视频 */}
          <button
            onClick={() => handleNormalTabClick('videos' as any)}
            className={`cursor-pointer transition-all duration-200 uppercase relative group flex items-center gap-1.5 ${
              activeTab === 'videos' ? 'text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
            }`}
          >
            <span>Videos / 视频</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-700 animate-pulse" />
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-300 ${activeTab === 'videos' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          {/* 关于 */}
          <button
            onClick={() => handleNormalTabClick('about')}
            className={`cursor-pointer transition-all duration-200 uppercase relative group ${
              activeTab === 'about' ? 'text-[#1a1a1a] dark:text-[#ebebeb]' : 'text-neutral-500 dark:text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb]'
            }`}
          >
            <span>About / 关于</span>
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-red-700 transition-all duration-300 ${activeTab === 'about' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </button>

          {/* 排序工具 - 仅在开发环境可用 */}
          {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
            <button
              onClick={() => onNavigateTab('sorter' as any)}
              className={`cursor-pointer transition-all duration-200 uppercase relative group flex items-center gap-1.5 px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full font-bold ${
                activeTab === 'sorter' ? 'bg-red-600 text-white' : ''
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M7 12h10M10 18h4" />
              </svg>
              <span>排序</span>
            </button>
          )}

          {/* Magazine - 特殊视觉按钮 */}
          <a
            href="https://m-studio-magazine.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer transition-all duration-300 relative group flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold uppercase rounded-full hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              <path d="M8 7h6"/>
              <path d="M8 11h8"/>
            </svg>
            <span>Magazine</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
          </a>
        </div>

        {/* 右侧状态 */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[9px] text-neutral-400 dark:text-neutral-500">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ONLINE</span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-red-700 dark:hover:text-red-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-all duration-200 cursor-pointer"
            title={dark ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </nav>
  );
}