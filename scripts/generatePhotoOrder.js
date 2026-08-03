/**
 * 自动生成图片排序配置文件脚本（智能版）
 * 
 * 运行方式：node scripts/generatePhotoOrder.js
 * 
 * 功能：
 * 1. 读取 src/data.ts 文件，提取所有图片ID和标题
 * 2. 扫描 public/images 目录下的所有图片
 * 3. 匹配图片文件和data.ts中的图片ID
 * 4. 按文件名数字前缀排序
 * 5. 生成 src/config/photoOrder.ts 配置文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const IMAGES_DIR = path.join(__dirname, '../public/images');
const DATA_FILE = path.join(__dirname, '../src/data.ts');
const OUTPUT_FILE = path.join(__dirname, '../src/config/photoOrder.ts');

// 图片扩展名
const IMAGE_EXTENSIONS = ['.webp', '.jpg', '.jpeg', '.png'];

/**
 * 提取文件名中的数字前缀用于排序
 */
function extractNumberPrefix(filename) {
  const match = filename.match(/^(\d+)-/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 999999;
}

/**
 * 从data.ts中提取图片信息
 */
function extractPhotosFromData() {
  const dataContent = fs.readFileSync(DATA_FILE, 'utf-8');
  
  // 提取RAW_PHOTOGRAPHS数组内容
  const photosMatch = dataContent.match(/const RAW_PHOTOGRAPHS[\s\S]*?\];/);
  if (!photosMatch) {
    console.error('❌ 无法找到RAW_PHOTOGRAPHS数组');
    return [];
  }
  
  const photosArray = photosMatch[0];
  
  // 提取每个图片对象
  const photos = [];
  const photoRegex = /{\s*id:\s*'([^']+)',[\s\S]*?title:\s*'([^']+)',[\s\S]*?imageUrl:\s*'([^']+)'/g;
  
  let match;
  while ((match = photoRegex.exec(photosArray)) !== null) {
    photos.push({
      id: match[1],
      title: match[2],
      imageUrl: match[3]
    });
  }
  
  return photos;
}

/**
 * 扫描图片目录
 */
function scanImages() {
  const imageMap = new Map();
  
  // 读取所有文件夹
  const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
  
  console.log('📁 找到文件夹：', folders.length, '个');
  
  // 遍历每个文件夹
  folders.forEach(folder => {
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = fs.readdirSync(folderPath);
    
    // 过滤图片文件
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return IMAGE_EXTENSIONS.includes(ext);
    });
    
    console.log(`📷 ${folder}: ${imageFiles.length} 张图片`);
    
    // 添加到映射
    imageFiles.forEach(file => {
      const relativePath = `/images/${folder}/${file}`;
      imageMap.set(relativePath, {
        folder,
        filename: file,
        numberPrefix: extractNumberPrefix(file)
      });
    });
  });
  
  return imageMap;
}

/**
 * 匹配图片数据和文件
 */
function matchPhotosWithData(photos, imageMap) {
  const matchedPhotos = [];
  
  photos.forEach(photo => {
    const imageData = imageMap.get(photo.imageUrl);
    if (imageData) {
      matchedPhotos.push({
        ...photo,
        ...imageData,
        matched: true
      });
    } else {
      matchedPhotos.push({
        ...photo,
        folder: '未知',
        filename: '未找到',
        numberPrefix: 999999,
        matched: false
      });
    }
  });
  
  return matchedPhotos;
}

/**
 * 生成配置文件内容
 */
function generateConfigFile(photos) {
  // 按文件夹分组
  const groupedByFolder = {};
  photos.forEach(photo => {
    if (!groupedByFolder[photo.folder]) {
      groupedByFolder[photo.folder] = [];
    }
    groupedByFolder[photo.folder].push(photo);
  });
  
  // 按数字前缀排序每个文件夹内的图片
  Object.keys(groupedByFolder).forEach(folder => {
    groupedByFolder[folder].sort((a, b) => {
      return a.numberPrefix - b.numberPrefix;
    });
  });
  
  let content = `/**
 * 图片排序配置文件
 * 
 * 使用说明：
 * 1. 下面的数组按照图片在网站上的显示顺序排列
 * 2. 你可以手动调整数组中图片ID的顺序
 * 3. 注释中包含了图片的标题和路径信息，方便识别
 * 
 * 如何使用：
 * - 取消注释想要排序的图片ID（去掉前面的 //）
 * - 调整数组中的顺序即可改变图片显示顺序
 * - 未在配置中的图片会按照默认顺序排在后面
 * 
 * 生成时间：${new Date().toLocaleString('zh-CN')}
 * 图片总数：${photos.length}
 */

export const CUSTOM_PHOTO_ORDER: string[] = [
`;

  // 生成每个文件夹的配置
  Object.keys(groupedByFolder).sort().forEach(folder => {
    content += `  // ========== ${folder} (${groupedByFolder[folder].length}张) ==========\n`;
    
    groupedByFolder[folder].forEach(photo => {
      if (photo.matched) {
        const numberStr = photo.numberPrefix < 999999 ? `${photo.numberPrefix}-` : '';
        content += `  // '${photo.id}',  // ${numberStr}${photo.title}\n`;
      } else {
        content += `  // '${photo.id}',  // ⚠️ ${photo.title} (文件未找到)\n`;
      }
    });
    
    content += `\n`;
  });
  
  content += `];

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
  
  return content;
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始生成图片排序配置...\n');
  
  // 1. 从data.ts提取图片信息
  console.log('📖 读取data.ts文件...');
  const photos = extractPhotosFromData();
  console.log(`✅ 找到 ${photos.length} 张图片数据\n`);
  
  // 2. 扫描图片文件
  console.log('🔍 扫描图片目录...');
  const imageMap = scanImages();
  console.log(`✅ 找到 ${imageMap.size} 个图片文件\n`);
  
  // 3. 匹配数据和文件
  console.log('🔗 匹配图片数据和文件...');
  const matchedPhotos = matchPhotosWithData(photos, imageMap);
  
  const matched = matchedPhotos.filter(p => p.matched).length;
  const unmatched = matchedPhotos.filter(p => !p.matched).length;
  
  console.log(`✅ 成功匹配 ${matched} 张图片`);
  if (unmatched > 0) {
    console.log(`⚠️  有 ${unmatched} 张图片未找到文件`);
  }
  
  // 4. 生成配置文件
  console.log('\n📝 生成配置文件...');
  const configContent = generateConfigFile(matchedPhotos);
  fs.writeFileSync(OUTPUT_FILE, configContent, 'utf-8');
  
  console.log(`\n🎉 配置文件已生成：${OUTPUT_FILE}`);
  console.log('\n💡 使用说明：');
  console.log('1. 打开 src/config/photoOrder.ts 文件');
  console.log('2. 找到你想要排序的图片ID，去掉前面的 // 注释');
  console.log('3. 调整顺序即可改变图片在网站上的显示顺序');
  console.log('4. 保存后刷新浏览器即可看到效果');
  console.log('\n📊 提示：');
  console.log('- 已按照文件名中的数字前缀（01-、02-等）自动排序');
  console.log('- 每个专题的图片都独立分组显示');
  console.log('- 你可以跨专题调整图片顺序');
}

// 运行脚本
main();