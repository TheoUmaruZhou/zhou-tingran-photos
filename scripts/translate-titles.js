import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.dirname(__dirname);
const filePath = path.join(PROJECT_ROOT, 'src', 'data.ts');

const TITLE_TRANSLATIONS = {
  '中线': 'Center Line',
  '建': 'Construction',
  '建 No.2': 'Construction No.2',
  '建 No.3': 'Construction No.3',
  '建 No.4': 'Construction No.4',
  '破墙而出': 'Breaking Through the Wall',
  '绿皮草': 'Green Grass',
  '通道': 'Passage',
  '通道 No.2': 'Passage No.2',
  '通道 No.3': 'Passage No.3',
  '通道 No.4': 'Passage No.4',
  '通道 No.5': 'Passage No.5',
  '通道 No.6': 'Passage No.6',
  '镜': 'Mirror',
  '三角': 'Triangle',
  '三角 No.2': 'Triangle No.2',
  '三角 No.3': 'Triangle No.3',
  '三角 No.4': 'Triangle No.4',
  '农具': 'Farm Tools',
  '农具 No.2': 'Farm Tools No.2',
  '年后': 'After New Year',
  '延伸': 'Extension',
  '戏水': 'Playing with Water',
  '望向': 'Looking Towards',
  '破镜': 'Broken Mirror',
  '稳定': 'Stability',
  '门': 'Door',
  '光音': 'Light and Sound',
  '吉他特写': 'Guitar Close-up',
  '向光跑': 'Running Towards Light',
  '幻影': 'Phantom',
  '树型': 'Tree Form',
  '樱花重组': 'Cherry Blossom Reconstruction',
  '油花': 'Oil Flower',
  '生机': 'Vitality',
  '胭脂红': 'Rouge Red',
  '胭脂红 No.2': 'Rouge Red No.2',
  '舞，跑': 'Dance, Run',
  '辉光': 'Glow',
  '重构': 'Reconstruction',
  '飞溅': 'Splash',
  '中线 No.2': 'Center Line No.2',
  '人，中心': 'Human, Center',
  '假山': 'Rockery',
  '对数': 'Logarithm',
  '对数 No.2': 'Logarithm No.2',
  '扩张': 'Expansion',
  '搁浅': 'Stranded',
  '曲线': 'Curve',
  '枯': 'Withered',
  '江，桥，棚': 'River, Bridge, Shed',
  '浅滩': 'Shallow Beach',
  '田': 'Field',
  '童年': 'Childhood',
  '童年 No.2': 'Childhood No.2',
  '绿色围布': 'Green Curtain',
  '虚构': 'Fiction',
  '裂痕': 'Crack',
  '谁高？': 'Who is Higher?',
  '劳作': 'Labor',
  '四宫格': 'Four Grid',
  '堆': 'Pile',
  '影': 'Shadow',
  '影 No.2': 'Shadow No.2',
  '灰烬': 'Ashes',
  '焦点': 'Focus',
  '狗脚印': 'Dog Footprints',
  '破裂': 'Rupture',
  '等待': 'Waiting',
  '踏': 'Step',
  '车墙': 'Car Wall',
  '连接': 'Connection',
  '连接 No.2': 'Connection No.2',
  '连接 No.3': 'Connection No.3',
  '遇见': 'Encounter',
  '阳光骑者': 'Sunlight Rider',
  '万家灯火': 'Lights of Ten Thousand Homes',
  '交织': 'Interweave',
  '交织 No.2': 'Interweave No.2',
  '交织 No.3': 'Interweave No.3',
  '交织 No.4': 'Interweave No.4',
  '交织 No.5': 'Interweave No.5',
  '交织 No.6': 'Interweave No.6',
  '交织 No.7': 'Interweave No.7',
  '交织 No.8': 'Interweave No.8',
  '交织 No.9': 'Interweave No.9',
  '交织 No.10': 'Interweave No.10',
  '交织 No.11': 'Interweave No.11',
  '交织 No.12': 'Interweave No.12',
  '交织 No.13': 'Interweave No.13',
  '交织 No.14': 'Interweave No.14',
  '交织 No.15': 'Interweave No.15',
  '交织 No.16': 'Interweave No.16',
  '交织 No.17': 'Interweave No.17',
  '交织 No.18': 'Interweave No.18',
  '交织 No.19': 'Interweave No.19',
  '交织 No.20': 'Interweave No.20',
  '交织 No.21': 'Interweave No.21',
  '交织 No.22': 'Interweave No.22',
  '交织 No.23': 'Interweave No.23',
  '交织 No.24': 'Interweave No.24',
  '交织 No.25': 'Interweave No.25',
  '交织 No.26': 'Interweave No.26',
  '交织 No.27': 'Interweave No.27',
  '交织 No.28': 'Interweave No.28',
  '交织 No.29': 'Interweave No.29',
  '交织 No.30': 'Interweave No.30',
  '交织 No.31': 'Interweave No.31',
  '交织 No.32': 'Interweave No.32',
  '交织 No.33': 'Interweave No.33',
  '交织 No.34': 'Interweave No.34',
  '交织 No.35': 'Interweave No.35',
  '交织 No.36': 'Interweave No.36',
  '交织 No.37': 'Interweave No.37',
  '交织 No.38': 'Interweave No.38',
  '交织 No.39': 'Interweave No.39',
  '交织 No.40': 'Interweave No.40',
  '交织 No.41': 'Interweave No.41',
  '交织 No.42': 'Interweave No.42',
  '交织 No.43': 'Interweave No.43',
  '交织 No.44': 'Interweave No.44',
  '交织 No.45': 'Interweave No.45',
  '交织 No.46': 'Interweave No.46',
  '交织 No.47': 'Interweave No.47',
  '交织 No.48': 'Interweave No.48',
  '交织 No.49': 'Interweave No.49',
  '交织 No.50': 'Interweave No.50',
  '交织 No.51': 'Interweave No.51',
  '交织 No.52': 'Interweave No.52',
  '交织 No.53': 'Interweave No.53',
  '交织 No.54': 'Interweave No.54',
  '交织 No.55': 'Interweave No.55',
  '交织 No.56': 'Interweave No.56',
  '交织 No.57': 'Interweave No.57',
  '交织 No.58': 'Interweave No.58',
  '交织 No.59': 'Interweave No.59',
  '交织 No.60': 'Interweave No.60',
  '交织 No.61': 'Interweave No.61',
  '交织 No.62': 'Interweave No.62',
  '交织 No.63': 'Interweave No.63',
  '交织 No.64': 'Interweave No.64',
  '交织 No.65': 'Interweave No.65',
  '交织 No.66': 'Interweave No.66',
  '交织 No.67': 'Interweave No.67',
  '交织 No.68': 'Interweave No.68',
  '交织 No.69': 'Interweave No.69',
  '交织 No.70': 'Interweave No.70',
  '交织 No.71': 'Interweave No.71',
  '交织 No.72': 'Interweave No.72',
  '交织 No.73': 'Interweave No.73',
  '交织 No.74': 'Interweave No.74',
  '交织 No.75': 'Interweave No.75',
  '交织 No.76': 'Interweave No.76',
  '交织 No.77': 'Interweave No.77',
  '交织 No.78': 'Interweave No.78',
  '交织 No.79': 'Interweave No.79',
  '交织 No.80': 'Interweave No.80',
  '交织 No.81': 'Interweave No.81',
  '交织 No.82': 'Interweave No.82',
  '交织 No.83': 'Interweave No.83',
  '交织 No.84': 'Interweave No.84',
  '交织 No.85': 'Interweave No.85',
  '交织 No.86': 'Interweave No.86',
  '交织 No.87': 'Interweave No.87',
  '交织 No.88': 'Interweave No.88',
  '交织 No.89': 'Interweave No.89',
  '交织 No.90': 'Interweave No.90',
  '交织 No.91': 'Interweave No.91',
  '交织 No.92': 'Interweave No.92',
  '交织 No.93': 'Interweave No.93',
  '交织 No.94': 'Interweave No.94',
  '交织 No.95': 'Interweave No.95',
  '交织 No.96': 'Interweave No.96',
  '交织 No.97': 'Interweave No.97',
  '交织 No.98': 'Interweave No.98',
  '交织 No.99': 'Interweave No.99',
  '交织 No.100': 'Interweave No.100',
};

let content = fs.readFileSync(filePath, 'utf8');

for (const [chinese, english] of Object.entries(TITLE_TRANSLATIONS)) {
  const regex = new RegExp(`title: '${chinese.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')}'`, 'g');
  content = content.replace(regex, `title: '${english} / ${chinese}'`);
}

content = content.replace(/camera: 'Leica M6'/g, "camera: 'SONY ILCE-7M4'");
content = content.replace(/lens: 'Summilux 35mm f\/1.4'/g, "lens: 'FE 24-70mm F2.8 GM II'");

const additions = `
import { Category, Project } from './types';

export type CategoryInfo = {
  nameZh: string;
  nameEn: string;
  desc: string;
};

export type ProjectInfo = {
  nameZh: string;
  nameEn: string;
  intro: string;
  background: string;
  duration: string;
};

export const CATEGORIES_INFO: Record<Category, CategoryInfo> = {
  landscape: {
    nameZh: '风光摄影',
    nameEn: 'Landscape Photography',
    desc: '山川河流、日出日落、自然之美',
  },
  documentary: {
    nameZh: '纪实摄影',
    nameEn: 'Documentary Photography',
    desc: '街头巷尾、人文故事、生活瞬间',
  },
  creative: {
    nameZh: '创意摄影',
    nameEn: 'Creative Photography',
    desc: '光影实验、艺术表达、视觉探索',
  },
  'new-topographics': {
    nameZh: '新地形摄影',
    nameEn: 'New Topographics',
    desc: '人与自然、城市边缘、环境变迁',
  },
};

export const PROJECTS_INFO: Record<Project, ProjectInfo> = {
  'old-towns': {
    nameZh: '老乡镇',
    nameEn: 'Old Towns',
    intro: '记录那些即将消失的老乡镇，留住时光的痕迹',
    background: '重庆渝北区老乡镇纪实摄影项目',
    duration: '2025 - 2026',
  },
  'new-villages': {
    nameZh: '新农村',
    nameEn: 'New Villages',
    intro: '新农村建设中的变化与传承',
    background: '重庆渝北区新农村发展记录',
    duration: '2025 - 2026',
  },
  'urban-borders': {
    nameZh: '城市边缘发展',
    nameEn: 'Urban Borders',
    intro: '城市扩张与乡村边界的交汇地带',
    background: '重庆渝北区城市化进程记录',
    duration: '2025 - 2026',
  },
};
`;

if (!content.includes('CATEGORIES_INFO')) {
  content = content.trimEnd() + additions;
}

fs.writeFileSync(filePath, content);
console.log('Done! All titles translated to English / Chinese format.');