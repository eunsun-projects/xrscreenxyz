import { DropdownData } from '@/components/types/vr.type';
import { create } from 'zustand';

export type VrStore = {
  embed: {
    isEmbed: boolean;
    isEmbedMiddle: boolean;
  };
  audioRef: React.RefObject<HTMLAudioElement> | null;
  videoRef: React.RefObject<HTMLVideoElement> | null;
  dropdownData: DropdownData | null;
  isWebCompReady: boolean;
  setEmbed: (embed: VrStore['embed']) => void;
  setIsWebCompReady: (isWebCompReady: boolean) => void;
  setAudioRef: (audioRef: React.RefObject<HTMLAudioElement>) => void;
  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => void;
  setDropdownData: (dropdownData: DropdownData) => void;
};

const useVrStore = create<VrStore>((set) => ({
  embed: {
    isEmbed: false,
    isEmbedMiddle: false,
  },
  audioRef: null,
  videoRef: null,
  dropdownData: null,
  isWebCompReady: false,
  setEmbed: (embed: VrStore['embed']) => set({ embed }),
  setIsWebCompReady: (isWebCompReady: boolean) => set({ isWebCompReady }),
  setAudioRef: (audioRef: React.RefObject<HTMLAudioElement>) => set({ audioRef }),
  setVideoRef: (videoRef: React.RefObject<HTMLVideoElement>) => set({ videoRef }),
  setDropdownData: (dropdownData: DropdownData) => set({ dropdownData }),
}));

export default useVrStore;
