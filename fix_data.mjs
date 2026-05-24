import fs from 'fs';

const dataPath = 'src/data.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

const webpDir = 'public/images';
const webpFiles = fs.readdirSync(webpDir).filter(f => f.endsWith('.webp'));

const existingUrls = new Set();
const urlRegex = /imageUrl:\s*'\/images\/([^']+)'/g;
let m;
while ((m = urlRegex.exec(content)) !== null) {
  existingUrls.add(m[1]);
}

const available = webpFiles.filter(f => !existingUrls.has(f.replace('.webp', '')));

let idx = 0;
const lines = content.split('\n');
let fixed = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === ',') {
    const prevLine = lines[i - 1] || '';
    if (prevLine.includes('category:') || prevLine.includes('year:')) {
      if (idx < available.length) {
        const filename = available[idx];
        lines[i] = `    imageUrl: '/images/${filename}',`;
        idx++;
        fixed++;
      }
    }
  }
}

content = lines.join('\n');
fs.writeFileSync(dataPath, content, 'utf-8');

console.log(`修复 ${fixed} 个缺失的 imageUrl`);
console.log(`使用了 ${idx} 个可用图片`);
