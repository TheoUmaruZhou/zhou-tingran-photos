import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');
const THUMBNAILS_DIR = path.join(PROJECT_ROOT, 'public', 'thumbnails');

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
];

async function generateThumbnail(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(400, 300, { fit: 'cover' })
      .webp({ quality: 50 })
      .toFile(outputPath);
    
    const newSize = fs.statSync(outputPath).size;
    console.log(`  ✓ ${path.basename(inputPath)} → ${Math.round(newSize / 1024)}KB`);
    return true;
  } catch (err) {
    console.error(`  ✗ 失败: ${path.basename(inputPath)} - ${err.message}`);
    return false;
  }
}

async function generateAllThumbnails() {
  console.log('\n开始生成缩略图...\n');
  
  if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
  }
  
  let total = 0;
  let success = 0;
  
  for (const folder of FOLDERS) {
    const folderPath = path.join(IMAGES_DIR, folder);
    if (!fs.existsSync(folderPath)) continue;
    
    const thumbFolder = path.join(THUMBNAILS_DIR, folder);
    if (!fs.existsSync(thumbFolder)) {
      fs.mkdirSync(thumbFolder, { recursive: true });
    }
    
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));
    console.log(`📁 ${folder} (${files.length} 张图片)`);
    
    for (const file of files) {
      total++;
      const inputPath = path.join(folderPath, file);
      const outputPath = path.join(thumbFolder, file);
      
      if (fs.existsSync(outputPath)) {
        console.log(`  - 已存在: ${file}`);
        success++;
      } else {
        const ok = await generateThumbnail(inputPath, outputPath);
        if (ok) success++;
      }
    }
    console.log('');
  }
  
  console.log(`\n✅ 完成！生成 ${success}/${total} 张缩略图`);
  console.log(`   缩略图目录: ${THUMBNAILS_DIR}`);
}

generateAllThumbnails();