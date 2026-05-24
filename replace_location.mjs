import fs from 'fs';

const dataPath = 'src/data.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

const locationRegex = /location: '[^']+',/g;
const matches = content.match(locationRegex);
content = content.replace(locationRegex, "location: '重庆, 渝北 (Chong Qing, Yu Bei)',");

fs.writeFileSync(dataPath, content, 'utf-8');
console.log(`地点: 替换 ${matches.length} 处 -> 重庆, 渝北 (Chong Qing, Yu Bei)`);
