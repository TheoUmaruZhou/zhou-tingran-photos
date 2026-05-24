import fs from 'fs';

const dataPath = 'src/data.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

const cameras = [
  "Fujifilm GFX 100S",
  "Leica M11-P",
  "Hasselblad X2D 100C",
  "Leica M6 Classic",
  "Leica Q3",
  "Sony A7R V",
  "Leica SL3",
  "Nikon Z8",
  "Canon EOS R5",
  "Hasselblad 907X 50C",
];

let count = 0;
for (const cam of cameras) {
  const regex = new RegExp(`camera: '${cam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g');
  const matches = content.match(regex);
  if (matches) {
    content = content.replace(regex, "camera: 'Sony A7M4'");
    count += matches.length;
    console.log(`  ${cam} -> Sony A7M4 (${matches.length}处)`);
  }
}

fs.writeFileSync(dataPath, content, 'utf-8');
console.log(`\n完成! 共替换 ${count} 处相机型号`);
