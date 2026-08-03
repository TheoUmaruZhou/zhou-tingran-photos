import { Home, Grid3X3, User, Video, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'works' | 'videos' | 'about';
  onNavigateTab: (tab: 'home' | 'works' | 'videos' | 'about') => void;
}

export default function MobileBottomNav({ activeTab, onNavigateTab }: MobileBottomNavProps) {
  const { dark, toggle: toggleTheme } = useTheme();

  const items = [
    { tab: 'home' as const, label: 'HOME', icon: Home },
    { tab: 'works' as const, label: 'WORKS', icon: Grid3X3 },
    { tab: 'videos' as const, label: 'VIDEOS', icon: Video },
    { tab: 'about' as const, label: 'ABOUT', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#ebebeb]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-md border-t border-neutral-300 dark:border-neutral-700 transition-colors duration-300">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onNavigateTab(item.tab)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors cursor-pointer ${
                active
                  ? 'text-[#1a1a1a] dark:text-[#ebebeb]'
                  : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-mono text-[9px] tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
        <a
          href="https://m-studio-magazine.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full bg-gradient-to-r from-red-600 to-orange-500 text-white transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-mono text-[9px] tracking-wider uppercase font-bold">MAG</span>
        </a>
      </div>
    </nav>
  );
}