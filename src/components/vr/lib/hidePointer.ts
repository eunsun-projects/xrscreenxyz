import { MpSdk } from '@matterport/r3f';

export const hidePointer = (mpSdk: MpSdk): void => {
  mpSdk.Settings.update('features/cursor', false).then(function (data: boolean) {
    console.log('CURSOR : ' + data);
  });
};
