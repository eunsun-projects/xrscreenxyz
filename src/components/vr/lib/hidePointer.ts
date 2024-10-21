export const hidePointer = (mpSdk: MpSdk): void => {
  mpSdk.Settings.update('features/cursor', false).then(() => {
    console.log('Cursor hidden');
  });
};
