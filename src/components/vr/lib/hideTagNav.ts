import { MpSdk } from '@matterport/r3f';

export const hideTagNav = (mpSdk: MpSdk): void => {
  mpSdk.Tag.toggleNavControls(false);
};
