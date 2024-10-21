import { vrData } from '@/data/vr.data';
import { Tag } from '../../../public/matterport-assets/sdk';

export type VrModel = (typeof vrData)[number];
export interface TestData {
  back: string;
  description: string;
  downLogo: [boolean, string];
  isBgm: [boolean, string];
  isPublic: boolean;
  keywords: string;
  logo: [boolean, string];
  object: [boolean, string];
  plane: [boolean, string];
  screenxyz: boolean;
  sid: string;
  time: Date;
  title: string;
  unique: string;
  url: string;
  video: [boolean, string];
  route: string;
  urlKey: string;
  parentFolder: string;
  backUrl: string;
  logoUrl: string;
  lowLogoUrl: string;
  vidsUrl: string[];
  objsUrl: string[];
  planesUrl: string[];
  songNames: string[];
  bgmsUrl: string[];
  cdUrl: string[];
}
export interface CustomTagData extends Tag.TagData {
  sorted: RegExpMatchArray | null;
  customAttachments: string[];
}

export interface VideoXyz {
  isVideo: boolean;
  position: number[];
  backPosition: number[];
  rotation: number[];
  scale: number[];
}

export interface Control {
  isControl: boolean;
  position: number[];
}

export type ExtendedVideo = HTMLVideoElement & {
  value: string;
};
