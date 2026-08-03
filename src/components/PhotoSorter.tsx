/**
 * 可视化图片排序管理工具（支持拖拽）
 *
 * 功能：
 * 1. 显示所有图片的缩略图网格
 * 2. 支持勾选要排序的图片
 * 3. 支持拖拽调整顺序
 * 4. 支持上移/下移按钮
 * 5. 保存排序配置到photoOrder.ts文件
 */

import { useState, useEffect } from 'react';
import { Photograph } from '../types';
import { PHOTOGRAPHS } from '../data';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortablePhoto extends Photograph {
  selected: boolean;
  order: number;
}

// 可排序的图片卡片组件
function SortablePhotoCard({ photo, index, onToggleSelect, onMoveUp, onMoveDown, isFirst, isLast }: {
  photo: SortablePhoto;
  index: number;
  onToggleSelect: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white dark:bg-[#2a2a2a] rounded-lg overflow-hidden shadow-md transition-all ${
        photo.selected ? 'ring-2 ring-red-600' : ''
      } ${isDragging ? 'shadow-2xl' : ''}`}
    >
      {/* 图片缩略图 */}
      <div className="aspect-square relative">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover"
        />

        {/* 拖拽手柄 */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 w-8 h-8 bg-black/70 text-white rounded flex items-center justify-center cursor-move hover:bg-black/90 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M7 12h10M10 18h4" />
          </svg>
        </div>

        {/* 勾选框 */}
        <button
          onClick={() => onToggleSelect(photo.id)}
          className={`absolute top-2 right-2 w-6 h-6 rounded border-2 transition-colors ${
            photo.selected
              ? 'bg-red-600 border-red-600'
              : 'bg-white/80 border-gray-300'
          }`}
        >
          {photo.selected && (
            <svg className="w-4 h-4 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* 序号 */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white rounded text-xs font-mono">
          #{index + 1}
        </div>
      </div>

      {/* 图片信息 */}
      <div className="p-3">
        <div className="text-sm font-medium truncate">{photo.title}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {photo.project}
        </div>

        {/* 操作按钮 */}
        {photo.selected && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onMoveUp(photo.id)}
              disabled={isFirst}
              className="flex-1 px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              ↑ 上移
            </button>
            <button
              onClick={() => onMoveDown(photo.id)}
              disabled={isLast}
              className="flex-1 px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
            >
              ↓ 下移
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PhotoSorter() {
  const [photos, setPhotos] = useState<SortablePhoto[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 初始化图片列表
  useEffect(() => {
    const initialPhotos: SortablePhoto[] = PHOTOGRAPHS.map((photo, index) => ({
      ...photo,
      selected: false,
      order: index
    }));
    setPhotos(initialPhotos);
  }, []);

  // 过滤图片
  const filteredPhotos = photos.filter(photo => {
    if (filter === 'all') return true;
    if (filter === 'selected') return photo.selected;
    return photo.project === filter;
  });

  // 勾选图片
  const toggleSelect = (photoId: string) => {
    setPhotos(photos.map(p =>
      p.id === photoId ? { ...p, selected: !p.selected } : p
    ));
  };

  // 全选/反选
  const selectAll = () => {
    const allSelected = filteredPhotos.every(p => p.selected);
    setPhotos(photos.map(p => {
      if (filter === 'all' || filter === 'selected') {
        return { ...p, selected: !allSelected };
      }
      return p.project === filter ? { ...p, selected: !allSelected } : p;
    }));
  };

  // 上移图片
  const moveUp = (photoId: string) => {
    const index = photos.findIndex(p => p.id === photoId);
    if (index > 0) {
      const newPhotos = [...photos];
      [newPhotos[index - 1], newPhotos[index]] = [newPhotos[index], newPhotos[index - 1]];
      setPhotos(newPhotos);
    }
  };

  // 下移图片
  const moveDown = (photoId: string) => {
    const index = photos.findIndex(p => p.id === photoId);
    if (index < photos.length - 1) {
      const newPhotos = [...photos];
      [newPhotos[index], newPhotos[index + 1]] = [newPhotos[index + 1], newPhotos[index]];
      setPhotos(newPhotos);
    }
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // 保存配置
  const saveConfig = async () => {
    setIsSaving(true);

    try {
      const selectedPhotos = photos.filter(p => p.selected);

      // 生成配置文件内容
      let configContent = `/**
 * 图片排序配置文件
 *
 * 使用说明：
 * 1. 下面的数组按照图片在网站上的显示顺序排列
 * 2. 你可以手动调整数组中图片ID的顺序
 * 3. 注释中包含了图片的标题和路径信息，方便识别
 *
 * 生成时间：${new Date().toLocaleString('zh-CN')}
 * 图片总数：${selectedPhotos.length}
 */

export const CUSTOM_PHOTO_ORDER: string[] = [
`;

      selectedPhotos.forEach(photo => {
        configContent += `  '${photo.id}',  // ${photo.title}\n`;
      });

      configContent += `];

/**
 * 排序函数
 * 根据配置文件中的顺序对图片进行排序
 */
export function sortPhotosByCustomOrder<T extends { id: string }>(photos: T[]): T[] {
  const orderMap = new Map<string, number>();

  // 为每个ID分配一个排序值
  CUSTOM_PHOTO_ORDER.forEach((id, index) => {
    orderMap.set(id, index);
  });

  // 排序：在配置中的图片按配置顺序，不在配置中的按原顺序排在后面
  return [...photos].sort((a, b) => {
    const aIndex = orderMap.has(a.id) ? orderMap.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.has(b.id) ? orderMap.get(b.id)! : Number.MAX_SAFE_INTEGER;

    // 如果都在配置中，按配置顺序
    if (aIndex !== Number.MAX_SAFE_INTEGER && bIndex !== Number.MAX_SAFE_INTEGER) {
      return aIndex - bIndex;
    }

    // 如果只有一个在配置中，配置中的排在前面
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // 如果都不在配置中，保持原顺序
    return 0;
  });
}
`;

      // 下载配置文件
      const blob = new Blob([configContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'photoOrder.ts';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('配置文件已下载！\n请将下载的 photoOrder.ts 文件复制到 src/config/ 目录下替换原文件。');

    } catch (error) {
      console.error('保存失败：', error);
      alert('保存失败，请查看控制台错误信息。');
    } finally {
      setIsSaving(false);
    }
  };

  // 获取所有专题项目
  const projects = Array.from(new Set(photos.map(p => p.project).filter(Boolean)));

  return (
    <div className="min-h-screen bg-[#ebebeb] dark:bg-[#1a1a1a] text-[#1a1a1a] dark:text-[#ebebeb] p-8">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black tracking-tight uppercase mb-2">
            图片排序管理工具
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm">
            拖拽图片调整顺序，或使用上移/下移按钮
          </p>
        </div>

        {/* 工具栏 */}
        <div className="bg-white dark:bg-[#2a2a2a] p-4 rounded-lg shadow-md mb-6 flex flex-wrap items-center gap-4">
          {/* 过滤器 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">过滤：</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded bg-white dark:bg-[#1a1a1a] text-sm"
            >
              <option value="all">全部图片 ({photos.length})</option>
              <option value="selected">已选择 ({photos.filter(p => p.selected).length})</option>
              {projects.map(project => (
                <option key={project} value={project}>
                  {project} ({photos.filter(p => p.project === project).length})
                </option>
              ))}
            </select>
          </div>

          {/* 全选按钮 */}
          <button
            onClick={selectAll}
            className="px-4 py-1 bg-neutral-200 dark:bg-neutral-700 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors text-sm"
          >
            {filteredPhotos.every(p => p.selected) ? '反选' : '全选'}
          </button>

          {/* 保存按钮 */}
          <button
            onClick={saveConfig}
            disabled={isSaving || photos.filter(p => p.selected).length === 0}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isSaving ? '保存中...' : `保存配置 (${photos.filter(p => p.selected).length}张)`}
          </button>

          {/* 统计信息 */}
          <div className="ml-auto text-sm text-neutral-600 dark:text-neutral-400">
            已选择 {photos.filter(p => p.selected).length} / {photos.length} 张图片
          </div>
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold mb-2 text-sm">📌 使用说明：</h3>
          <ol className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
            <li>1. 使用过滤器筛选想要排序的图片（如选择某个专题）</li>
            <li>2. 勾选想要排序的图片（可使用全选按钮）</li>
            <li>3. <strong className="text-red-600">拖拽左上角的排序图标</strong>调整图片顺序，或使用上移/下移按钮</li>
            <li>4. 点击"保存配置"下载配置文件</li>
            <li>5. 将下载的 photoOrder.ts 文件复制到 src/config/ 目录替换原文件</li>
            <li>6. 刷新浏览器查看效果</li>
          </ol>
        </div>

        {/* 图片网格 - 支持拖拽 */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map(p => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPhotos.map((photo, index) => (
                <SortablePhotoCard
                  key={photo.id}
                  photo={photo}
                  index={index}
                  onToggleSelect={toggleSelect}
                  onMoveUp={moveUp}
                  onMoveDown={moveDown}
                  isFirst={index === 0}
                  isLast={index === filteredPhotos.length - 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* 空状态 */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            没有找到符合条件的图片
          </div>
        )}
      </div>
    </div>
  );
}