export const hidePucks = (mpSdk: MpSdk): void => {
  mpSdk.Settings.update('features/sweep_pucks', false).then(() => {
    console.log('Pucks hidden');
  });
};
