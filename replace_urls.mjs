import fs from 'fs';
import path from 'path';

const dataPath = path.resolve('src/data.ts');
let content = fs.readFileSync(dataPath, 'utf-8');

const webpDir = path.resolve('public/images');
const webpFiles = fs.readdirSync(webpDir).filter(f => f.endsWith('.webp'));

const urlRegex = /imageUrl:\s*'([^']+)'/g;
const urls = [];
let match;
while ((match = urlRegex.exec(content)) !== null) {
  urls.push({ full: match[0], url: match[1], index: match.index });
}

console.log(`找到 ${urls.length} 个 imageUrl，${webpFiles.length} 个本地 .webp 文件\n`);

const shuffled = [...webpFiles].sort(() => Math.random() - 0.5);
const used = new Set();
let assigned = 0;

for (let i = 0; i < urls.length; i++) {
  const webpFile = shuffled[i % shuffled.length];
  const localPath = `/images/${webpFile}`;
  content = content.replace(urls[i].full, `imageUrl: '${localPath}'`);
  used.add(webpFile);
  assigned++;
  console.log(`  [${i + 1}/${urls.length}] ${urls[i].url.substring(0, 50)}... -> ${localPath}`);
}

fs.writeFileSync(dataPath, content, 'utf-8');

console.log(`\n完成! 已替换 ${assigned} 个 imageUrl`);
