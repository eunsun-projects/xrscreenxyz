import { MpSdk } from '@matterport/r3f';

export const hidePucks = (mpSdk: MpSdk): void => {
  mpSdk.Settings.update('features/sweep_pucks', false).then(function (data: boolean) {
    console.log('PUCK : ' + data);
  });
};
