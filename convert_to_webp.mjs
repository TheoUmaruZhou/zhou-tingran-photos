import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = 'C:/Users/15327/Desktop/photos';
const outputDir = 'public/images';
const quality = 80;
const maxWidth = 1600;

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f =>
  /\.(jpg|jpeg|png|bmp|tiff|tif)$/i.test(f)
);

console.log(`找到 ${files.length} 张图片，开始转换...\n`);

let converted = 0;

for (const file of files) {
  const input = path.join(inputDir, file);
  const output = path.join(outputDir, file.replace(/\.\w+$/, '.webp'));

  try {
    const originalSize = fs.statSync(input).size / 1024;

    await sharp(input)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(output);

    const webpSize = fs.statSync(output).size / 1024;
    const saved = ((1 - webpSize / originalSize) * 100).toFixed(0);

    console.log(`  ${file} -> ${path.basename(output)}  (${originalSize.toFixed(0)}KB -> ${webpSize.toFixed(0)}KB, -${saved}%)`);
    converted++;
  } catch (e) {
    console.log(`  [错误] ${file}: ${e.message}`);
  }
}

console.log(`\n完成! 转换 ${converted} 张`);
console.log(`输出目录: ${path.resolve(outputDir)}`);
