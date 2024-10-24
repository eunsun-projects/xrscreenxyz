export const hideTagNav = (mpSdk: MpSdk): void => {
  mpSdk.Tag.toggleNavControls(false);
};
