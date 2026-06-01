import fs from 'fs';

const dataPath = 'src/data.ts';
let content = fs.readFileSync(dataPath, 'utf-8');

const classification = {
  '1000012272': 'A', '1000030530 (3)': 'C', '1000030664': 'C', '1000030665': 'C',
  '1000030995': 'A', '1738407238184 (1)': 'B', '1960512724': 'A', '2111_1': 'C',
  'DSC00278': 'A', 'DSC00330 (1)': 'A', 'DSC01257': 'A', 'DSC01864 (1)': 'A',
  'DSC01869 (3)': 'A', 'DSC01950 (1)': 'A', 'DSC02003': 'A', 'DSCF1114-01': 'A',
  'Image_1718808473663 (1)': 'A', 'IMG_20250203_205655': 'C', 'IMG_20250801_154257': 'A',
  'IMG_20250807_153458': 'B', 'IMG_3330 (1)': 'C', 'IMG_3478': 'C', 'IMG_3697 (2)': 'C',
  'IMG_4428': 'C', 'quality_restoration_20240602104349615_1': 'C',
  'retouch_2024060120044808 (1)': 'C', 'retouch_2024060918051690 (1)': 'C',
  'retouch_2024061014022519': 'A',
  'ZTR00304': 'B', 'ZTR00344-4': 'D', 'ZTR00350': 'D', 'ZTR00359': 'D',
  'ZTR00368-3': 'D', 'ZTR00377': 'A', 'ZTR00389-2': 'A', 'ZTR00400-2': 'D',
  'ZTR00406': 'D', 'ZTR00418': 'D', 'ZTR00421': 'D', 'ZTR00432': 'D',
  'ZTR00472': 'D', 'ZTR00473': 'D', 'ZTR00476': 'D', 'ZTR00491-3': 'D',
  'ZTR00514': 'D', 'ZTR00519-2': 'D', 'ZTR00560': 'D', 'ZTR00571': 'D',
  'ZTR00588': 'D', 'ZTR00591': 'D', 'ZTR00594-2': 'D', 'ZTR00603': 'D',
  'ZTR00609': 'D', 'ZTR04432': 'D', 'ZTR04616 (1)': 'A', 'ZTR06823-2': 'B',
  'ZTR06840': 'D', 'ZTR06865': 'D', 'ZTR07182': 'D', 'ZTR07683': 'B',
  'ZTR07739': 'A', 'ZTR07754': 'B', 'ZTR07757': 'B', 'ZTR08061': 'A',
  'ZTR08152': 'D', 'ZTR08157': 'B', 'ZTR08300': 'B', 'ZTR08301': 'D',
  'ZTR08307': 'B', 'ZTR08334': 'B', 'ZTR08389': 'B', 'ZTR08404': 'A',
  'ZTR08432': 'D', 'ZTR08518': 'B', 'ZTR08854': 'A', 'ZTR08856': 'D',
  'ZTR08860': 'D', 'ZTR08957': 'A', 'ZTR09004': 'A',
  '设计工程学院2025级风景园林五班周亭燃1': 'A',
  '设计工程学院2025级风景园林五班周亭燃2': 'A',
  '设计工程学院2025级风景园林五班周亭燃3': 'A',
  '未标题-3': 'C', '未标题-5-3': 'C', '未标题-7-3': 'C',
};

const categoryMap = {
  'A': 'Category.Landscape',
  'B': 'Category.Documentary',
  'C': 'Category.Creative',
  'D': 'Category.NewTopographics',
};

const urlRegex = /imageUrl:\s*'\/images\/([^']+)\.webp'/g;
let match;
let updated = 0;
let notFound = 0;

const replacements = [];
while ((match = urlRegex.exec(content)) !== null) {
  const filename = match[1];
  const cat = classification[filename];
  if (cat) {
    replacements.push({
      start: match.index,
      end: match.index + match[0].length,
      full: match[0],
      filename,
      newCategory: categoryMap[cat],
    });
  } else {
    notFound++;
    console.log(`  [未分类] ${filename}`);
  }
}

for (let i = replacements.length - 1; i >= 0; i--) {
  const r = replacements[i];
  const before = content.substring(0, r.start);
  const after = content.substring(r.end);

  const categoryRegex = /category:\s*Category\.\w+/;
  const nearbyChunk = before.substring(Math.max(0, before.length - 300)) + after.substring(0, 300);
  const currentCat = nearbyChunk.match(/category:\s*(Category\.\w+)/);

  if (currentCat && currentCat[1] !== r.newCategory) {
    const oldCat = currentCat[1];
    const lastIdx = before.lastIndexOf(currentCat[0]);
    content = before.substring(0, lastIdx) + `category: ${r.newCategory}` + before.substring(lastIdx + currentCat[0].length) + after;
    console.log(`  ${r.filename}: ${oldCat} -> ${r.newCategory}`);
    updated++;
  } else {
    console.log(`  ${r.filename}: 已是 ${r.newCategory}，无需更改`);
  }
}

fs.writeFileSync(dataPath, content, 'utf-8');
console.log(`\n完成! 更新 ${updated} 个分类, ${notFound} 个未找到映射`);
