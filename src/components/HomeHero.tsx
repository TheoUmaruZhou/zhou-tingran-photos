/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Camera, ArrowRight, Eye } from 'lucide-react';
import { Category, Project } from '../types';

interface HomeHeroProps {
  onNavigateToCategory: (category: Category) => void;
  onNavigateToProject: (project: Project) => void;
  onExploreAll: () => void;
  startTyping?: boolean;
}

export default function HomeHero({
  onNavigateToCategory,
  onNavigateToProject,
  onExploreAll,
  startTyping = true,
}: HomeHeroProps) {
  const featuredRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: featuredRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  const fullText = 'LAND. LIFE. BORDER.';
  const [displayedText, setDisplayedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (!startTyping) return;
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTypingDone(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [startTyping]);

  const customRows = [
    {
      index: '01',
      title: 'LANDSCAPE IMAGES',
      subtitle: '风光摄影',
      desc: 'Mountains, seasonal layers, stillness.',
      category: Category.Landscape,
    },
    {
      index: '02',
      title: 'STREET & DOCUMENTARY',
      subtitle: '纪实摄影',
      desc: 'Vernacular records, daily encounters, raw life.',
      category: Category.Documentary,
    },
    {
      index: '03',
      title: 'THE NEW TOPOGRAPHIC',
      subtitle: '新地形摄影',
      desc: 'Man-made boundary, artificial structures on land.',
      category: Category.NewTopographics,
    },
    {
      index: '04',
      title: 'STILL LIFE',
      subtitle: '静物摄影',
      desc: 'Arranged objects, light and form.',
      category: Category.StillLife,
    },
    {
      index: '05',
      title: 'CREATIVE EXPERIMENTAL',
      subtitle: '创意重构',
      desc: 'Abstract shadows, inverted liquid horizons.',
      category: Category.Creative,
    },
  ];

  const ongoingProjects = [
    {
      id: Project.OldTowns,
      num: 'P.01',
      name: '老乡镇 / Old Towns',
      time: '2021 – 2024',
      image: '/images/专题-老乡镇/门.webp',
    },
    {
      id: Project.NewVillages,
      num: 'P.02',
      name: '新农村 / Modern Countryside',
      time: '2023 – 2026',
      image: '/images/专题-新农村/镜.webp',
    },
    {
      id: Project.UrbanBorders,
      num: 'P.03',
      name: '城市边缘发展 / Urban Edges',
      time: '2022 – 2026',
      image: '/images/专题-城市边缘发展/通道.webp',
    },
    {
      id: Project.TuGuan,
      num: 'P.04',
      name: '专题-途观 / Tu Guan',
      time: '2023 – 2026',
      image: '/images/专题-途观/下乡.webp',
    },
  ];

  return (
    <div id="home-hero-container" className="w-full transition-colors duration-300">
      <section className="relative px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-36 max-w-7xl mx-auto flex flex-col justify-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-6 font-mono text-xs tracking-widest text-[#888]">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
            ZHOU TING RAN PHOTOGRAPHY ARCHIVE
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-display font-extrabold tracking-tighter leading-none select-none text-[#1a1a1a] dark:text-[#ebebeb] transition-all uppercase duration-300">
            {displayedText.split('BORDER.')[0]}
            {displayedText.includes('BORDER') && (
              <span className="text-neutral-400 dark:text-neutral-500 hover:text-[#1a1a1a] dark:hover:text-[#ebebeb] transition-colors duration-500">
                BORDER{displayedText.includes('BORDER.') ? '.' : ''}
              </span>
            )}
            {!typingDone && <span className="animate-pulse">|</span>}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12 md:mt-16 items-start">
            <div className="md:col-span-7 lg:col-span-8">
              <p className="text-lg md:text-xl font-sans font-light text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                一位专注于风光、纪实与新地形的摄影创作者。三年时间，他逐渐形成了一种冷静而克制的视觉语言——不煽情，不张扬，只是诚实地记录人与土地共存的痕迹。
              </p>
              <p className="mt-4 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                "摄影就是生活。慢一点，别着急，体悟当下那些细小的美好——它们本就是平常生活的一部分。"
              </p>
            </div>
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
              <button
                id="btn-explore-all"
                onClick={onExploreAll}
                className="group w-full font-mono bg-[#1a1a1a] dark:bg-[#ebebeb] text-[#ebebeb] dark:text-[#1a1a1a] py-4 px-6 uppercase text-sm font-semibold tracking-wider flex items-center justify-between hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all duration-300 rounded-none cursor-pointer"
              >
                <span>Explore All Works / 浏览全部</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
              <div className="flex justify-between items-center text-xs font-mono text-neutral-500 dark:text-neutral-400 px-1">
                <span>ACTIVE PROJECT CODES</span>
                <span>UTC+8 MAINLAND CHN</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section ref={featuredRef} className="relative w-full max-w-[1400px] mx-auto px-4 md:px-12 mb-28">
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-neutral-300 dark:bg-neutral-700 group" data-cursor-enlarge>
          <motion.img
            src="/images/未标题-3.webp"
            alt="Chen Lu Featured"
            style={{ y: parallaxY }}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-all duration-1000 ease-out scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a1a1a]/90 dark:from-[#ebebeb]/90 via-[#1a1a1a]/40 dark:via-[#ebebeb]/40 to-transparent p-6 md:p-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <span className="font-mono text-xs text-red-500 tracking-wider">FEATURED RECENT / 近期精选</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-1 uppercase text-white">PICTORIAL PHOTOGRAPHY</h2>
              <p className="text-xs md:text-sm text-neutral-400 dark:text-neutral-500 mt-1">Chong Qing · Yuan Bo Yuan 32MP</p>
            </div>
            <div className="flex items-center gap-6 font-mono text-xs text-neutral-400 dark:text-neutral-500">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400">FOCAL LENGTH</p>
                <p>35mm (EF 24-70mm)</p>
              </div>
              <div className="hidden sm:block">
                <p className="text-neutral-500 dark:text-neutral-400">EXPOSURE</p>
                <p>1/125s at f/11</p>
              </div>
              <button
                onClick={onExploreAll}
                className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/25 py-2 px-4 transition-colors duration-300"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Specs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 mb-32">
        <div className="flex justify-between items-end mb-10 hr-minimal pb-4">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            01 /作品分类 - CATEGORY PATHWAYS
          </h3>
          <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 hidden sm:block">SELECT TO CHOOSE GENRE</span>
        </div>

        <div className="divide-y divide-neutral-300 dark:divide-neutral-700">
          {customRows.map((row) => (
            <div
              key={row.index}
              id={`cat-row-${row.category}`}
              onClick={() => onNavigateToCategory(row.category)}
              className="group py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:bg-[#e0e0e0] dark:hover:bg-[#2a2a2a] transition-all duration-300 px-2"
            >
              <div className="flex items-center gap-6 md:gap-12 mb-4 md:mb-0">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tracking-wider group-hover:text-red-600 transition-colors">
                  {row.index}
                </span>
                
                <div>
                  <h4 className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold group-hover:translate-x-2 transition-transform duration-500 uppercase tracking-tight text-neutral-700 dark:text-neutral-300 group-hover:text-[#1a1a1a] dark:group-hover:text-[#ebebeb]">
                    {row.title}
                  </h4>
                  <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400 mt-1 md:mt-2 group-hover:text-red-600 transition-colors">
                    {row.subtitle} — {row.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500 group-hover:text-[#1a1a1a] dark:group-hover:text-[#ebebeb] transition-colors">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  VIEW GALLERY
                </span>
                <div className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center group-hover:border-[#1a1a1a] dark:group-hover:border-[#ebebeb] transition-colors">
                  <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-[#e0e0e0] dark:bg-[#2a2a2a] py-24 border-t border-neutral-300 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="font-mono text-xs text-red-600 tracking-widest uppercase">
                02 /专题项目 - ACTIVE ON-GOING SECTIONS
              </span>
              <h3 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight mt-2 text-[#1a1a1a] dark:text-[#ebebeb] uppercase">
                Regional Projects
              </h3>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mt-4 md:mt-0 leading-relaxed font-sans font-light">
              探究城市迅速重组与古老文明风蚀的面性档案。每个项目皆伴有一手走访田野日志、EXIF标定及时间跨度自述。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ongoingProjects.map((proj) => (
              <div
                key={proj.id}
                id={`proj-card-${proj.id}`}
                onClick={() => onNavigateToProject(proj.id)}
                className="group relative bg-[#e8e8e8] dark:bg-[#222222] overflow-hidden cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-300 flex flex-col border border-neutral-300 dark:border-neutral-700 h-full"
                data-cursor-enlarge
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <img
                    src={proj.image}
                    alt={proj.name}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 font-mono text-[10px] bg-[#1a1a1a]/80 dark:bg-[#ebebeb]/80 backdrop-blur text-white px-2 py-1 tracking-widest">
                    {proj.num}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-display font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-[#1a1a1a] dark:group-hover:text-[#ebebeb] transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-2">
                      Duration: {proj.time}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-red-600 transition-colors mt-8 pt-4 border-t border-neutral-300 dark:border-neutral-700">
                    <span>Enter Field Research</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
