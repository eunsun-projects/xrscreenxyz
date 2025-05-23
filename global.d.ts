import { MpSdk as MpSdkType } from '@matterport/r3f';

declare global {
  type MpSdk = MpSdkType;
  declare namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}
