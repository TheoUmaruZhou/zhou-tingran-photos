import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);
const filePath = path.join(PROJECT_ROOT, 'src', 'data.ts');

const JPG_FOLDER = '/images/摄影图片总集/';

let content = fs.readFileSync(filePath, 'utf8');

const jpgFiles = fs.readdirSync(path.join(PROJECT_ROOT, 'public', 'images', '摄影图片总集'));

const normalizeName = (name) => {
  return name
    .replace(/\s+/g, ' ')
    .replace(/\.\s+/g, '.')
    .replace(/\s+\./g, '.')
    .trim();
};

const titleToJpgMap = {};
for (const jpgFile of jpgFiles) {
  const baseName = path.parse(jpgFile).name;
  const normalizedName = normalizeName(baseName);
  titleToJpgMap[normalizedName] = jpgFile;
}

const lines = content.split('\n');
const newLines = [];
let currentTitle = null;
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('title:')) {
    const match = line.match(/title: '([^']+)'/);
    if (match) {
      currentTitle = match[1];
    }
  }
  
  if (line.includes('id:')) {
    const match = line.match(/id: '([^']+)'/);
    if (match) {
      currentId = match[1];
    }
  }
  
  if (line.includes('imageUrl:') && !line.includes('originalJpgUrl')) {
    const match = line.match(/imageUrl: '([^']+)'/);
    if (match && currentTitle) {
      const webpPath = match[1];
      const webpFileName = path.parse(webpPath).name;
      
      let jpgFileName = null;
      
      const titleParts = currentTitle.split(' / ');
      const chineseTitle = titleParts.length > 1 ? titleParts[1] : currentTitle;
      
      for (const [normalizedJpg, originalJpg] of Object.entries(titleToJpgMap)) {
        if (normalizedJpg === chineseTitle || 
            normalizedJpg === chineseTitle.replace(/\s+/g, '') ||
            webpFileName.includes(normalizedJpg.replace(/\s+/g, ''))) {
          jpgFileName = originalJpg;
          break;
        }
      }
      
      if (!jpgFileName) {
        for (const [normalizedJpg, originalJpg] of Object.entries(titleToJpgMap)) {
          if (normalizedJpg.toLowerCase().includes(chineseTitle.toLowerCase().substring(0, 3)) ||
              chineseTitle.toLowerCase().includes(normalizedJpg.toLowerCase().substring(0, 3))) {
            jpgFileName = originalJpg;
            break;
          }
        }
      }
      
      if (jpgFileName) {
        const jpgPath = `${JPG_FOLDER}${jpgFileName}`;
        newLines.push(line);
        newLines.push(`      originalJpgUrl: '${jpgPath}',`);
      } else {
        newLines.push(line);
      }
      
      currentTitle = null;
      currentId = null;
    } else {
      newLines.push(line);
    }
  } else {
    newLines.push(line);
  }
}

fs.writeFileSync(filePath, newLines.join('\n'));
console.log('Done! Added originalJpgUrl to matching images.');