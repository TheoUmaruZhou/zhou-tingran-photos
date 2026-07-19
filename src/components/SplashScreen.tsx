import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<'line-in' | 'text1' | 'text1-out' | 'text2' | 'text2-out' | 'done'>('line-in');

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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase === 'line-in' || phase === 'text1' ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-[1px] bg-red-600 origin-center mb-8"
          />

          <div className="h-16 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {(phase === 'text1' || phase === 'text1-out') && (
                <motion.h1
                  key="text1"
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{
                    opacity: phase === 'text1-out' ? 0 : 1,
                    y: phase === 'text1-out' ? -40 : 0,
                    filter: phase === 'text1-out' ? 'blur(10px)' : 'blur(0px)',
                  }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-mono text-sm md:text-base tracking-[0.4em] text-neutral-400 uppercase whitespace-nowrap"
                >
                  Photography Portfolio
                </motion.h1>
              )}

              {(phase === 'text2' || phase === 'text2-out') && (
                <motion.h1
                  key="text2"
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{
                    opacity: phase === 'text2-out' ? 0 : 1,
                    y: phase === 'text2-out' ? -40 : 0,
                    filter: phase === 'text2-out' ? 'blur(10px)' : 'blur(0px)',
                  }}
                  exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display font-extrabold text-2xl md:text-4xl tracking-tight text-white uppercase whitespace-nowrap"
                >
                  Theo Umaru Zhou
                </motion.h1>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{
              scaleX: phase === 'text2' || phase === 'text2-out' ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-[1px] bg-red-600 origin-center mt-8"
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.4, delay: 1 }}
            className="absolute bottom-12 font-mono text-[10px] tracking-[0.2em] text-neutral-500 uppercase"
          >
            点击屏幕跳过
          </motion.div>

          <div className="absolute bottom-6 font-mono text-[9px] tracking-[0.3em] text-neutral-600 uppercase">
            © 2026
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}