import { Home, Grid3X3, User, PenLine } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'works' | 'about';
  onNavigateTab: (tab: 'home' | 'works' | 'about') => void;
  onOpenGuestbook: () => void;
}

export default function MobileBottomNav({ activeTab, onNavigateTab, onOpenGuestbook }: MobileBottomNavProps) {
  const { dark, toggle: toggleTheme } = useTheme();

  const items = [
    { tab: 'home' as const, label: 'HOME', icon: Home },
    { tab: 'works' as const, label: 'WORKS', icon: Grid3X3 },
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
        <button
          onClick={onOpenGuestbook}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-neutral-400 dark:text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
        >
          <PenLine className="w-5 h-5" />
          <span className="font-mono text-[9px] tracking-wider uppercase">GUEST</span>
        </button>
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-neutral-400 dark:text-neutral-500 transition-colors cursor-pointer"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-mono text-[9px] tracking-wider uppercase">{dark ? 'LIGHT' : 'DARK'}</span>
        </button>
      </div>
    </nav>
  );
}