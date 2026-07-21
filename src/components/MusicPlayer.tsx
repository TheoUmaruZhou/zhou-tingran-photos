/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// 音乐列表 - 将音乐文件放在 public/music/ 文件夹中
const MUSIC_LIST = [
  {
    title: '背景音乐',
    artist: '未知艺术家',
    src: '/music/M800002ZszsR2l6LLg.mp3',
  },
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isPlayBallPaused, setIsPlayBallPaused] = useState(false);
  const [isVolumeBallPaused, setIsVolumeBallPaused] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartPosition = useRef({ x: 0, y: 0 });

  // 用于手动控制动画角度
  const playBallAngleRef = useRef(0);
  const volumeBallAngleRef = useRef(180); // 音量球初始从180度开始
  const playBallPausedRef = useRef(false);
  const volumeBallPausedRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playBallRef = useRef<HTMLButtonElement>(null);
  const volumeBallContainerRef = useRef<HTMLDivElement>(null); // 音量球容器（包含按钮和滑块）

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 自动播放 - 进入网站后尝试自动播放
  useEffect(() => {
    const tryAutoPlay = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          // 浏览器阻止自动播放，需要用户手动点击
        }
      }
    };

    // 延迟一点尝试自动播放，确保音频已加载
    const timer = setTimeout(tryAutoPlay, 500);
    return () => clearTimeout(timer);
  }, []);

  // 手动控制动画 - 使用requestAnimationFrame
  useEffect(() => {
    if (!isExpanded) return;

    const animate = () => {
      // 更新播放球角度
      if (!playBallPausedRef.current) {
        playBallAngleRef.current = (playBallAngleRef.current + 0.9) % 360;
        if (playBallRef.current) {
          const angle = playBallAngleRef.current;
          playBallRef.current.style.transform = `rotate(${angle}deg) translateX(55px) rotate(${-angle}deg)`;
        }
      }

      // 更新音量球容器角度（包含按钮和滑块）- 整体旋转
      if (!volumeBallPausedRef.current) {
        volumeBallAngleRef.current = (volumeBallAngleRef.current + 0.9) % 360;
        if (volumeBallContainerRef.current) {
          const angle = volumeBallAngleRef.current;
          // 容器直接旋转，内部元素通过 CSS 定位在圆周上
          volumeBallContainerRef.current.style.transform = `rotate(${angle}deg)`;
        }
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isExpanded]);

  // 点击外部区域关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isExpanded) return;
      if (!containerRef.current) return;
      
      if (!containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 拖拽处理 - 支持鼠标和触摸
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // 检查是否真正拖动了（移动超过5px才算拖动）
      const dx = e.clientX - dragStartPosition.current.x;
      const dy = e.clientY - dragStartPosition.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        setHasDragged(true);
      }

      const newX = window.innerWidth - e.clientX - dragOffset.x;
      const newY = window.innerHeight - e.clientY - dragOffset.y;

      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // 防止页面滚动

      const touch = e.touches[0];

      // 检查是否真正拖动了
      const dx = touch.clientX - dragStartPosition.current.x;
      const dy = touch.clientY - dragStartPosition.current.y;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        setHasDragged(true);
      }

      const newX = window.innerWidth - touch.clientX - dragOffset.x;
      const newY = window.innerHeight - touch.clientY - dragOffset.y;

      const maxX = window.innerWidth - 100;
      const maxY = window.innerHeight - 100;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    // 记录起始位置，用于判断是否真正拖动
    dragStartPosition.current = { x: e.clientX, y: e.clientY };
    setHasDragged(false);

    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = rect.right - e.clientX;
    const offsetY = rect.bottom - e.clientY;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  // 触摸开始处理
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!buttonRef.current) return;

    const touch = e.touches[0];

    // 记录起始位置
    dragStartPosition.current = { x: touch.clientX, y: touch.clientY };
    setHasDragged(false);

    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = rect.right - touch.clientX;
    const offsetY = rect.bottom - touch.clientY;

    setDragOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // 自动播放被阻止，需要用户交互
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 如果是拖动操作，不触发点击展开
    if (hasDragged) return;
    setIsExpanded(!isExpanded);
    setShowVolumeSlider(false);
  };

  // 播放球悬停处理 - 独立控制
  const handlePlayBallMouseEnter = () => {
    playBallPausedRef.current = true;
    setIsPlayBallPaused(true);
  };

  const handlePlayBallMouseLeave = () => {
    playBallPausedRef.current = false;
    setIsPlayBallPaused(false);
  };

  // 音量球悬停处理 - 独立控制
  const handleVolumeBallMouseEnter = () => {
    volumeBallPausedRef.current = true;
    setIsVolumeBallPaused(true);
    setShowVolumeSlider(true);
  };

  const handleVolumeBallMouseLeave = () => {
    volumeBallPausedRef.current = false;
    setIsVolumeBallPaused(false);
    setShowVolumeSlider(false);
  };

  return (
    <div
      ref={containerRef}
      className="fixed z-50"
      style={{
        right: `${position.x}px`,
        bottom: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* 隐藏的音频元素 */}
      <audio
        ref={audioRef}
        src={MUSIC_LIST[0].src}
        loop
        preload="metadata"
      />

      {/* 动态圆球容器 */}
      {isExpanded && (
        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-10 h-10 pointer-events-none">
          {/* 播放圆球 - 围绕主按钮旋转 */}
          <div className="absolute inset-0">
            <button
              ref={playBallRef}
              onClick={togglePlay}
              onMouseEnter={handlePlayBallMouseEnter}
              onMouseLeave={handlePlayBallMouseLeave}
              onTouchStart={() => {
                playBallPausedRef.current = true;
                setIsPlayBallPaused(true);
              }}
              onTouchEnd={() => {
                playBallPausedRef.current = false;
                setIsPlayBallPaused(false);
              }}
              className={`absolute w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors pointer-events-auto ${
                isPlaying
                  ? 'bg-red-700 text-white'
                  : 'bg-neutral-600 text-white hover:bg-neutral-500'
              }`}
              style={{ transform: 'rotate(0deg) translateX(55px) rotate(0deg)' }}
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>

          {/* 音量圆球 + 滑块容器 - 围绕主按钮旋转 */}
          <div
            ref={volumeBallContainerRef}
            className="absolute inset-0 pointer-events-auto"
            onMouseEnter={handleVolumeBallMouseEnter}
            onMouseLeave={handleVolumeBallMouseLeave}
            onTouchStart={() => {
              volumeBallPausedRef.current = true;
              setIsVolumeBallPaused(true);
              setShowVolumeSlider(true);
            }}
            onTouchEnd={() => {
              volumeBallPausedRef.current = false;
              setIsVolumeBallPaused(false);
              setShowVolumeSlider(false);
            }}
          >
            {/* 音量球按钮 - 在圆周上（半径55px） */}
            <button
              onClick={toggleMute}
              className={`absolute w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isMuted
                  ? 'bg-neutral-700 text-neutral-400'
                  : 'bg-neutral-600 text-white hover:bg-neutral-500'
              }`}
              style={{ left: 'calc(50% + 55px - 18px)', top: 'calc(50% - 18px)' }}
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* 音量滑块 - 紧挨着音量球 */}
            {showVolumeSlider && (
              <div
                className="absolute bg-neutral-800/95 backdrop-blur-sm px-2 py-1.5 rounded-lg shadow-lg border border-neutral-700"
                style={{ left: 'calc(50% + 55px - 75px)', top: 'calc(50% - 10px)', touchAction: 'none' }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="w-14 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-red-700"
                  style={{ writingMode: 'horizontal-tb', touchAction: 'none' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 主悬浮按钮 */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleButtonClick}
        className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
          isExpanded
            ? 'bg-red-700 text-white'
            : 'bg-neutral-500/80 text-white hover:bg-neutral-400/80'
        }`}
        style={{ boxShadow: isPlaying ? '0 0 12px rgba(185, 28, 28, 0.4)' : '0 2px 8px rgba(0,0,0,0.2)' }}
        title="音乐播放器（可拖拽）"
      >
        <span className="font-display font-bold text-sm">T</span>
      </button>

      {/* 播放状态指示 */}
      {isPlaying && !isExpanded && (
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-700 rounded-full animate-pulse" />
      )}
    </div>
  );
}