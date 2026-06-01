import fs from 'fs';

const dataPath = 'src/data.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

const lensRegex = /lens: '[^']+',/g;
const lensMatches = content.match(lensRegex);
content = content.replace(lensRegex, "lens: 'FE 24-70mm f/2.8 GM II',");

const exposureRegex = /exposure: '[^']+',/g;
const exposureMatches = content.match(exposureRegex);
content = content.replace(exposureRegex, "exposure: '1/125s at f/8, ISO 200',");

const yearRegex = /year: \d{4},/g;
const yearMatches = content.match(yearRegex);
content = content.replace(yearRegex, 'year: 2025,');

fs.writeFileSync(dataPath, content, 'utf-8');
console.log(`镜头: 替换 ${lensMatches.length} 处 -> FE 24-70mm f/2.8 GM II`);
console.log(`曝光: 替换 ${exposureMatches.length} 处 -> 1/125s at f/8, ISO 200`);
console.log(`年份: 替换 ${yearMatches.length} 处 -> 2025`);
