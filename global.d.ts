import type { MpSdk as MpSdkType } from '@matterport/r3f';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ModelViewerElementProps = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  alt?: string;
  'camera-controls'?: boolean | string;
  'auto-rotate'?: boolean | string;
  'shadow-intensity'?: number | string;
};

declare global {
  type MpSdk = MpSdkType;

  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementProps;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElementProps;
    }
  }
}

export {};
