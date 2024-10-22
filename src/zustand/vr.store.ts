import { DropdownData } from '@/components/types/vr.type';
import { Viewer } from '@/components/vr/MpWebComp';
import { create } from 'zustand';
import { Model } from '../../public/matterport-assets/sdk';

export type VrStore = {
  mpSdk: MpSdk | null;
  embed: {
    isEmbed: boolean;
    isEmbedMiddle: boolean;
  };
  audioRef: React.RefObject<HTMLAudioElement> | null;
  videoRef: React.RefObject<HTMLVideoElement> | null;
  viewerRef: React.RefObject<Viewer> | null;
  dropdownData: DropdownData | null;
  isWebCompReady: boolean;
  isDropdownReady: boolean;
  modelInfo: Model.ModelDetails | null;
  setMpSdk: (mpSdk: MpSdk) => void;
  setEmbed: (embed: VrStore['embed']) => void;
  setIsWebCompReady: (isWebCompReady: boolean) => void;
  setAudioRef: (audioRef: React.RefObject<HTMLAudioElement>) => void;
  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  setViewerRef: (viewerRef: React.RefObject<Viewer>) => void;
  setDropdownData: (dropdownData: DropdownData) => void;
  setIsDropdownReady: (isDropdownReady: boolean) => void;
  setModelInfo: (modelInfo: Model.ModelDetails) => void;
};

const useVrStore = create<VrStore>((set) => ({
  mpSdk: null,
  embed: {
    isEmbed: false,
    isEmbedMiddle: false,
  },
  audioRef: null,
  videoRef: null,
  viewerRef: null,
  dropdownData: null,
  isWebCompReady: false,
  isDropdownReady: false,
  modelInfo: null,
  setMpSdk: (mpSdk: MpSdk) => set({ mpSdk }),
  setEmbed: (embed: VrStore['embed']) => set({ embed }),
  setIsWebCompReady: (isWebCompReady: boolean) => set({ isWebCompReady }),
  setAudioRef: (audioRef: React.RefObject<HTMLAudioElement>) => set({ audioRef }),
  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => set({ videoRef }),
  setViewerRef: (viewerRef: React.RefObject<Viewer>) => set({ viewerRef }),
  setDropdownData: (dropdownData: DropdownData) => set({ dropdownData }),
  setIsDropdownReady: (isDropdownReady: boolean) => set({ isDropdownReady }),
  setModelInfo: (modelInfo: Model.ModelDetails) => set({ modelInfo }),
}));

export default useVrStore;
