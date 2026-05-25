import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { dark } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    const animate = () => {
      setPos((prev) => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.5,
        y: prev.y + (targetRef.current.y - prev.y) * 0.5,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.closest('img') ||
        target.closest('[data-cursor-enlarge]')
      ) {
        setIsHovering(true);
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement;
      if (
        target.tagName === 'IMG' ||
        target.closest('img') ||
        target.closest('[data-cursor-enlarge]')
      ) {
        if (
          !related ||
          (related.tagName !== 'IMG' &&
            !related.closest('img') &&
            !related.closest('[data-cursor-enlarge]'))
        ) {
          setIsHovering(false);
        }
      }
    };

    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    return () => {
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return (
      <style>{`* { cursor: auto !important; }`}</style>
    );
  }

  const getCursorColor = () => {
    if (dark) return '#ffffff';
    return isHovering ? '#ffffff' : '#1a1a1a';
  };

  return (
    <div
      className="pointer-events-none fixed z-[9999] rounded-full transition-[width,height,background-color] duration-300 ease-out flex items-center justify-center"
      style={{
        left: pos.x,
        top: pos.y,
        width: isHovering ? 56 : 12,
        height: isHovering ? 56 : 12,
        transform: 'translate(-50%, -50%)',
        opacity: isVisible ? 1 : 0,
        backgroundColor: getCursorColor(),
      }}
    >
      <span
        className="font-mono font-bold select-none transition-opacity duration-200"
        style={{
          fontSize: 7,
          letterSpacing: '0.05em',
          color: dark ? '#1a1a1a' : '#1a1a1a',
          opacity: isHovering ? 1 : 0,
        }}
      >
        THEO
      </span>
    </div>
  );
}
