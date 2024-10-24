export function navigateToTag(mpSdk: MpSdk, sid: string) {
  mpSdk.Mattertag.navigateToTag(sid, mpSdk.Mattertag.Transition.FLY); //will deprecated???????
  mpSdk.Tag.allowAction(sid, {
    docking: false,
    navigating: false,
    opening: false,
  });
}
