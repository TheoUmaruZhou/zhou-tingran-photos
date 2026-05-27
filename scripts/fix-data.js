import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.dirname(__dirname);
const filePath = path.join(PROJECT_ROOT, 'src', 'data.ts');
let content = fs.readFileSync(filePath, 'utf8');

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
console.log('Done!');