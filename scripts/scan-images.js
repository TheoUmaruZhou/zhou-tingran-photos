import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);

const IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');

const CATEGORY_MAP = {
  '风光摄影': 'landscape',
  '纪实摄影': 'documentary',
  '创意摄影': 'creative',
  '新地形摄影': 'new-topographics',
};

const PROJECT_MAP = {
  '专题-老乡镇': 'old-towns',
  '专题-新农村': 'new-villages',
  '专题-城市边缘发展': 'urban-borders',
};

const DEFAULT_EXIF = {
  camera: 'Leica M6',
  lens: 'Summilux 35mm f/1.4',
  exposure: 'f/8 · 1/250s · ISO 400',
  focalLength: '35mm',
  format: '35mm Film',
};

async function convertToWebp(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    let width = metadata.width;
    let quality = 70;
    
    if (width > 2000) {
      width = 2000;
      quality = 65;
    }
    
    await sharp(inputPath)
      .resize(width)
      .webp({ quality })
      .toFile(outputPath);
    
    const newSize = (await sharp(outputPath).metadata()).size;
    console.log(`  ✓ 转换: ${path.basename(inputPath)} → ${path.basename(outputPath)} (${Math.round(newSize / 1024)}KB)`);
    return true;
  } catch (err) {
    console.error(`  ✗ 转换失败: ${path.basename(inputPath)} - ${err.message}`);
    return false;
  }
}

async function scanImages() {
  const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'backup')
    .map(d => d.name);

  const images = [];
  let idCounter = 1;

  console.log('\n开始扫描并转换图片...\n');

  for (const folder of folders) {
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = fs.readdirSync(folderPath);
    
    const jpgFiles = files.filter(f => 
      f.toLowerCase().endsWith('.jpg') || 
      f.toLowerCase().endsWith('.jpeg') ||
      f.toLowerCase().endsWith('.png')
    );
    
    const webpFiles = files.filter(f => f.endsWith('.webp'));

    console.log(`📁 ${folder} (${jpgFiles.length} JPG + ${webpFiles.length} WebP)`);
    
    for (const jpgFile of jpgFiles) {
      const jpgPath = path.join(folderPath, jpgFile);
      const webpFileName = path.parse(jpgFile).name + '.webp';
      const webpPath = path.join(folderPath, webpFileName);
      
      if (!fs.existsSync(webpPath)) {
        const success = await convertToWebp(jpgPath, webpPath);
        if (success) {
          fs.unlinkSync(jpgPath);
          console.log(`  ✓ 删除原文件: ${jpgFile}`);
        }
      } else {
        console.log(`  - 已存在: ${webpFileName}`);
        if (fs.existsSync(jpgPath)) {
          fs.unlinkSync(jpgPath);
          console.log(`  ✓ 删除原文件: ${jpgFile}`);
        }
      }
    }

    const allWebpFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.webp'));
    
    for (const file of allWebpFiles) {
      const fileName = path.parse(file).name;
      const category = CATEGORY_MAP[folder] || null;
      const project = PROJECT_MAP[folder] || null;

      const id = fileName.match(/ZTR\d+|DSC\d+|IMG\d+/)?.[0] || `img${idCounter++}`;

      images.push({
        id: id.toLowerCase(),
        title: fileName.replace(/[-_]/g, ' ').replace(/ZTR\d+|DSC\d+|IMG\d+/gi, '').trim() || `Photo ${idCounter}`,
        desc: '',
        imageUrl: `/images/${folder}/${file}`,
        category: category,
        project: project,
        location: '重庆',
        year: 2024,
        aspectRatio: '3:2',
        exif: DEFAULT_EXIF,
      });
    }
  }

  return images;
}

function generateDataTs(images) {
  const content = `import { Photograph } from './types';

export const PHOTOGRAPHS: Photograph[] = [
${images.map(img => `  {
    id: '${img.id}',
    title: '${img.title}',
    desc: '${img.desc}',
    imageUrl: '${img.imageUrl}',
    category: ${img.category ? `'${img.category}'` : 'null'},
    ${img.project ? `project: '${img.project}',` : ''}
    location: '${img.location}',
    year: ${img.year},
    aspectRatio: '${img.aspectRatio}',
    exif: {
      camera: '${img.exif.camera}',
      lens: '${img.exif.lens}',
      exposure: '${img.exif.exposure}',
      focalLength: '${img.exif.focalLength}',
      format: '${img.exif.format}',
    },
  },`).join('\n')}
];
`;

  return content;
}

async function main() {
  const images = await scanImages();
  console.log(`\n✅ 共处理 ${images.length} 张图片`);

  const outputPath = path.join(PROJECT_ROOT, 'src', 'data.ts');
  fs.writeFileSync(outputPath, generateDataTs(images), 'utf-8');
  console.log(`\n📝 已生成: ${outputPath}`);
  console.log('\n💡 请手动补充每张图片的 title、desc、location、year、exif 等信息');
}

main();