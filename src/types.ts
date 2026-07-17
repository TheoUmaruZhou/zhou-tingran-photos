/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Category {
  Landscape = 'landscape',
  Documentary = 'documentary',
  Creative = 'creative',
  NewTopographics = 'new-topographics',
  StillLife = 'still-life',
}

export enum Project {
  OldTowns = 'old-towns',
  NewVillages = 'new-villages',
  UrbanBorders = 'urban-borders',
  TuGuan = 'tu-guan',
  DailyMoments = 'daily-moments',
}

export interface ExifData {
  camera: string;
  lens: string;
  exposure: string; // e.g., "1/250s at f/8, ISO 100"
  focalLength: string; // e.g., "50mm"
  format: string; // e.g., "Medium Format 50MP" or "35mm film"
}

export interface Photograph {
  id: string;
  title: string;
  desc: string;
  category: Category;
  project?: Project;
  location: string;
  year: number;
  imageUrl: string;
  originalJpgUrl?: string;
  aspectRatio: '16:9' | '3:4' | '4:3' | '1:1' | '16:10' | '2:3' | '3:2';
  exif: ExifData;
}

export interface CategoryDetails {
  id: Category;
  nameZh: string;
  nameEn: string;
  intro: string;
}

export interface ProjectDetails {
  id: Project;
  nameZh: string;
  nameEn: string;
  location: string;
  duration: string;
  intro: string;
  background: string;
}
