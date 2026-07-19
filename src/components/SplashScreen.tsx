import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PHOTOGRAPHS } from '../data';

interface SplashScreenProps {
  onComplete: () => void;
}

function shufflePhotos<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'line-in' | 'text1' | 'text1-out' | 'text2' | 'text2-out' | 'done'>('line-in');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const previewPhotos = useMemo(() => shufflePhotos(PHOTOGRAPHS).slice(0, isMobile ? 6 : 16), [isMobile]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase('text1'), 600));
    timers.push(setTimeout(() => setPhase('text1-out'), 2400));
    timers.push(setTimeout(() => setPhase('text2'), 3200));
    timers.push(setTimeout(() => setPhase('text2-out'), 5200));
    timers.push(setTimeout(() => setPhase('done'), 5800));
    timers.push(setTimeout(() => onComplete(), 6400));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const handleClick = () => {
    setPhase('done');
    setTimeout(() => onComplete(), 100);
  };

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] bg-[#050505] overflow-hidden cursor-pointer"
          onClick={handleClick}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-5 md:grid-cols-4 md:gap-5 md:p-6 lg:grid-cols-4 lg:gap-6 lg:p-8">
              {previewPhotos.map((photo, index) => (
                <motion.div
                  key={`${photo.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={isMobile ? {
                    opacity: phase === 'text1-out' || phase === 'text2' || phase === 'text2-out' ? 0 : 0.9,
                    scale: 1,
                  } : {
                    opacity: phase === 'text1-out' || phase === 'text2' || phase === 'text2-out' ? 0 : 0.9,
                    scale: [1, 1.03, 1],
                    x: index % 2 === 0 ? [0, 4, 0] : [0, -4, 0],
                    y: index % 3 === 0 ? [0, -10, 0] : [0, 10, 0],
                  }}
                  transition={isMobile ? {
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  } : {
                    duration: 6 + (index % 4) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.05,
                  }}
                  className="relative overflow-hidden rounded-sm border border-white/10 bg-black/20"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="h-full min-h-[150px] w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_48%),linear-gradient(to_bottom,_rgba(255,255,255,0.03),_transparent_60%)]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.18, scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.06)_40%,transparent_100%)] blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-6 md:inset-10 border border-white/10"
          />

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-10 -translate-x-1/2 h-px w-24 bg-red-500/80"
          />

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 bottom-10 -translate-x-1/2 h-px w-24 bg-red-500/80"
          />

          <div className="relative z-10 flex h-full flex-col items-center justify-center">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'line-in' || phase === 'text1' ? 1 : 0,
                opacity: phase === 'line-in' || phase === 'text1' ? 1 : 0,
              }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="w-28 h-[1px] bg-red-600 origin-center mb-8"
            />

            <div className="h-24 flex items-center justify-center overflow-hidden px-6">
              <AnimatePresence mode="wait">
                {(phase === 'text1' || phase === 'text1-out') && (
                  <motion.h1
                    key="text1"
                    initial={{ opacity: 0, y: 46, filter: 'blur(12px)' }}
                    animate={{
                      opacity: phase === 'text1-out' ? 0 : 1,
                      y: phase === 'text1-out' ? -46 : 0,
                      filter: phase === 'text1-out' ? 'blur(12px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -46, filter: 'blur(12px)' }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="font-mono text-[11px] md:text-sm tracking-[0.5em] text-neutral-300 uppercase whitespace-nowrap"
                  >
                    Photography Portfolio
                  </motion.h1>
                )}

                {(phase === 'text2' || phase === 'text2-out') && (
                  <motion.h1
                    key="text2"
                    initial={{ opacity: 0, y: 56, filter: 'blur(14px)' }}
                    animate={{
                      opacity: phase === 'text2-out' ? 0 : 1,
                      y: phase === 'text2-out' ? -56 : 0,
                      filter: phase === 'text2-out' ? 'blur(14px)' : 'blur(0px)',
                    }}
                    exit={{ opacity: 0, y: -56, filter: 'blur(14px)' }}
                    transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display font-extrabold text-3xl md:text-5xl tracking-[0.16em] text-white uppercase whitespace-nowrap drop-shadow-[0_0_18px_rgba(255,255,255,0.14)]"
                  >
                    Theo Umaru Zhou
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: phase === 'text2' || phase === 'text2-out' ? 1 : 0,
                opacity: phase === 'text2' || phase === 'text2-out' ? 1 : 0,
              }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-28 h-[1px] bg-red-600 origin-center mt-8"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.25em] text-neutral-500 uppercase"
          >
            点击屏幕跳过
          </motion.div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            © 2026
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}