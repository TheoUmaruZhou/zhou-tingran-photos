import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');

const FOLDERS = [
  '风光摄影',
  '纪实摄影',
  '创意摄影',
  '新地形摄影',
  '静物摄影',
  '专题-老乡镇',
  '专题-新农村',
  '专题-城市边缘发展',
  '专题-途观',
  '专题-碎隅光景',
  '专题-生灵日记',
  '专题-煤都',
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryWriteFile(filePath, buffer, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const tempPath = filePath + '.tmp.' + Date.now();
      fs.writeFileSync(tempPath, buffer);
      await sleep(100);
      
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        if (e.code !== 'ENOENT') throw e;
      }
      
      await sleep(100);
      fs.renameSync(tempPath, filePath);
      return true;
    } catch (err) {
      if (err.code === 'EBUSY' || err.code === 'EPERM' || err.message.includes('UNKNOWN')) {
        console.log(`    ⏳ 文件被锁定，等待重试 (${attempt}/${maxRetries})...`);
        await sleep(2000 * attempt);
      } else {
        throw err;
      }
    }
  }
  return false;
}

async function optimizeImage(inputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    let width = metadata.width;
    let quality = 60;
    
    if (width > 1600) {
      width = 1600;
      quality = 55;
    }
    
    if (width > 1200) {
      quality = 50;
    }
    
    const buffer = await sharp(inputPath)
      .resize(width)
      .webp({ quality, effort: 6 })
      .toBuffer();
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = buffer.length;
    const saved = Math.round((1 - newSize / originalSize) * 100);
    
    const success = await tryWriteFile(inputPath, buffer);
    
    if (success) {
      console.log(`  ✓ ${path.basename(inputPath)}: ${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB (节省 ${saved}%)`);
      return { originalSize, newSize };
    } else {
      console.log(`  ✗ 跳过（文件被锁定）: ${path.basename(inputPath)}`);
      return null;
    }
  } catch (err) {
    console.error(`  ✗ 失败: ${path.basename(inputPath)} - ${err.message}`);
    return null;
  }
}

async function optimizeAllImages() {
  console.log('\n开始激进优化图片...\n');
  console.log('参数: 宽度≤1600px, 质量50-60%');
  console.log('特性: 自动重试锁定文件，使用临时文件写入\n');
  
  let totalOriginal = 0;
  let totalNew = 0;
  let processedCount = 0;
  let skippedCount = 0;
  let lockedCount = 0;
  
  for (const folder of FOLDERS) {
    const folderPath = path.join(IMAGES_DIR, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp') && !f.startsWith('temp_') && !f.includes('.tmp.'));
    console.log(`📁 ${folder} (${files.length} 张图片)`);
    
    for (const file of files) {
      const inputPath = path.join(folderPath, file);
      const originalSize = fs.statSync(inputPath).size;
      
      if (originalSize > 500 * 1024) {
        const result = await optimizeImage(inputPath);
        if (result) {
          totalOriginal += result.originalSize;
          totalNew += result.newSize;
          processedCount++;
        } else {
          lockedCount++;
        }
        await sleep(300);
      } else {
        console.log(`  - 跳过: ${file} (${Math.round(originalSize / 1024)}KB < 500KB)`);
        skippedCount++;
      }
    }
    console.log('');
  }
  
  console.log(`\n✅ 优化完成！`);
  console.log(`   已优化: ${processedCount} 张`);
  console.log(`   已跳过（小于500KB）: ${skippedCount} 张`);
  console.log(`   被锁定无法处理: ${lockedCount} 张`);
  if (totalOriginal > 0) {
    console.log(`   原始总大小: ${Math.round(totalOriginal / 1024 / 1024)}MB`);
    console.log(`   优化后总大小: ${Math.round(totalNew / 1024 / 1024)}MB`);
    console.log(`   节省空间: ${Math.round((1 - totalNew / totalOriginal) * 100)}%`);
  }
  
  if (lockedCount > 0) {
    console.log(`\n⚠️  有 ${lockedCount} 张图片被锁定无法处理。`);
    console.log(`   请关闭所有图片查看器和文件夹窗口后重新运行：npm run optimize`);
  }
}

optimizeAllImages();