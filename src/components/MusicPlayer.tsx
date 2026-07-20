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
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // 拖拽处理
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = window.innerWidth - e.clientX - dragOffset.x;
      const newY = window.innerHeight - e.clientY - dragOffset.y;
      
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const offsetX = rect.right - e.clientX;
    const offsetY = rect.bottom - e.clientY;
    
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

  const handleButtonClick = () => {
    if (isDragging) return;
    setIsExpanded(!isExpanded);
    setShowVolumeSlider(false);
  };

  return (
    <div 
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
        <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 w-10 h-10">
          {/* 播放圆球 - 围绕主按钮旋转 */}
          <div
            className={`absolute inset-0 ${isPaused ? '' : 'animate-orbit-play'}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button
              onClick={togglePlay}
              className={`absolute w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isPlaying 
                  ? 'bg-red-700 text-white' 
                  : 'bg-neutral-600 text-white hover:bg-neutral-500'
              }`}
              style={{ transform: 'translate(40px, -10px)' }}
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </div>

          {/* 音量圆球 - 围绕主按钮旋转 */}
          <div
            className={`absolute inset-0 ${isPaused ? '' : 'animate-orbit-volume'}`}
            onMouseEnter={() => {
              setIsPaused(true);
              setShowVolumeSlider(true);
            }}
            onMouseLeave={() => {
              setIsPaused(false);
              setShowVolumeSlider(false);
            }}
          >
            <button
              onClick={toggleMute}
              className={`absolute w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                isMuted
                  ? 'bg-neutral-700 text-neutral-400'
                  : 'bg-neutral-600 text-white hover:bg-neutral-500'
              }`}
              style={{ transform: 'translate(-40px, -10px)' }}
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* 音量滑块 */}
            {showVolumeSlider && (
              <div className="absolute left-[-100px] top-[-5px] bg-neutral-800/95 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-neutral-700">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-red-700"
                  style={{ writingMode: 'horizontal-tb' }}
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

      {/* CSS动画 */}
      <style>{`
        @keyframes orbit-play {
          0% {
            transform: rotate(0deg) translateX(55px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(55px) rotate(-360deg);
          }
        }
        @keyframes orbit-volume {
          0% {
            transform: rotate(180deg) translateX(55px) rotate(-180deg);
          }
          100% {
            transform: rotate(540deg) translateX(55px) rotate(-540deg);
          }
        }
        .animate-orbit-play {
          animation: orbit-play 4s linear infinite;
        }
        .animate-orbit-volume {
          animation: orbit-volume 4s linear infinite;
        }
      `}</style>
    </div>
  );
}