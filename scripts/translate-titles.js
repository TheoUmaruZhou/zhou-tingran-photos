import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);
const filePath = path.join(PROJECT_ROOT, 'src', 'data.ts');

const translations = {
  '中线': 'CENTER LINE',
  '建': 'CONSTRUCT',
  '建 No.3': 'CONSTRUCT NO.3',
  '建 No.4': 'CONSTRUCT NO.4',
  '破墙而出': 'BREAKING THROUGH',
  '绿皮草': 'GREEN MOSS',
  '通道 No.2': 'PASSAGE NO.2',
  '通道 No.3': 'PASSAGE NO.3',
  '通道 No.4': 'PASSAGE NO.4',
  '通道 No.5': 'PASSAGE NO.5',
  '通道 No.6': 'PASSAGE NO.6',
  '通道': 'PASSAGE',
  '镜': 'MIRROR',
  '三角 No.2': 'TRIANGLE NO.2',
  '三角 No.3': 'TRIANGLE NO.3',
  '三角 No.4': 'TRIANGLE NO.4',
  '三角': 'TRIANGLE',
  '农具 No.2': 'FARM TOOLS NO.2',
  '农具': 'FARM TOOLS',
  '劳作': 'LABOR',
  '年后': 'AFTER THE YEAR',
  '延伸': 'EXTENSION',
  '戏水': 'PLAYING WATER',
  '望向': 'GAZING',
  '破镜': 'BROKEN MIRROR',
  '稳定': 'STABILITY',
  '光音': 'LIGHT AND SOUND',
  '吉他特写': 'GUITAR CLOSE-UP',
  '向光跑': 'RUNNING TOWARDS LIGHT',
  '幻影': 'PHANTOM',
  '树型': 'TREE FORM',
  '樱花重组': 'CHERRY BLOSSOM RESTRUCTURE',
  '油花': 'OIL FLOWER',
  '生机': 'VITALITY',
  '胭脂红 No.2': 'ROUGE NO.2',
  '胭脂红': 'ROUGE',
  '舞，跑': 'DANCE, RUN',
  '辉光': 'GLOW',
  '重构': 'RECONSTRUCT',
  '飞溅': 'SPLASH',
  '中线 No.2': 'CENTER LINE NO.2',
  '人，中心': 'MAN, CENTER',
  '假山': 'ROCKERY',
  '对数 No.2': 'LOGARITHM NO.2',
  '对数': 'LOGARITHM',
  '扩张': 'EXPANSION',
  '搁浅': 'STRANDED',
  '曲线': 'CURVE',
  '枯': 'WITHERED',
  '江，桥，棚': 'RIVER, BRIDGE, SHED',
  '浅滩': 'SHALLOWS',
  '田': 'FIELD',
  '童年 No.2': 'CHILDHOOD NO.2',
  '童年': 'CHILDHOOD',
  '绿色围布': 'GREEN DRAPE',
  '虚构': 'FICTION',
  '裂痕': 'CRACK',
  '谁高？': 'WHO IS TALLER?',
  '门': 'DOOR',
  '影': 'SHADOW',
  '灰烬': 'ASHES',
  '焦点': 'FOCUS',
  '狗脚印': 'DOG PAWPRINT',
  '破裂': 'FRACTURE',
  '等待': 'WAITING',
  '踏': 'TREAD',
  '车墙': 'CAR WALL',
  '连接 No.2': 'CONNECTION NO.2',
  '连接 No.3': 'CONNECTION NO.3',
  '连接': 'CONNECTION',
  '遇见': 'ENCOUNTER',
  '阳光骑者': 'SUNSHINE RIDER',
  'temp temp 万家灯火': 'TEMP LIGHTS OF HOMES',
  'temp 万家灯火': 'TEMP LIGHTS OF HOMES',
  '万家灯火': 'LIGHTS OF HOMES',
  '交织 No.2': 'INTERWEAVE NO.2',
  '交织': 'INTERWEAVE',
  '千厮门': 'QIANSIMEN',
  '单枝': 'SINGLE BRANCH',
  '向上': 'UPWARD',
  '大礼堂': 'GRAND AUDITORIUM',
  '奔腾': 'GALLOPING',
  '山间': 'AMONG MOUNTAINS',
  '干': 'DRY',
  '日照': 'SUNLIGHT',
  '春 No.2': 'SPRING NO.2',
  '春': 'SPRING',
  '江夜': 'RIVER NIGHT',
  '空枝 No.2': 'EMPTY BRANCH NO.2',
  '空枝': 'EMPTY BRANCH',
  '绿草 No.2': 'GREEN GRASS NO.2',
  '绿草': 'GREEN GRASS',
  '群山之中': 'AMIDST MOUNTAINS',
  '花与蜜蜂': 'FLOWER AND BEE',
  '菜园坝与夜': 'CAIYUANBA AND NIGHT',
  '蔡家大桥 No.2': 'CAIJIA BRIDGE NO.2',
  '蔡家大桥 No.3': 'CAIJIA BRIDGE NO.3',
  '蔡家大桥': 'CAIJIA BRIDGE',
  '行者': 'WALKER',
  '近草远桥': 'NEAR GRASS FAR BRIDGE',
  '霓虹': 'NEON',
};

let content = fs.readFileSync(filePath, 'utf8');

for (const [zh, en] of Object.entries(translations)) {
  const newTitle = `${en} / ${zh}`;
  const escapedZh = zh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  content = content.replace(
    new RegExp(`title: '${escapedZh}'`, 'g'),
    `title: '${newTitle}'`
  );
}

fs.writeFileSync(filePath, content);

const titleCount = (content.match(/title: '/g) || []).length;
const slashCount = (content.match(/ \/ /g) || []).length;
console.log(`Done! Total titles: ${titleCount}, Titles with /: ${slashCount}`);
