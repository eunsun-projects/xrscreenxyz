import { App, Tag } from '../../../../public/matterport-assets/sdk';

export const logAppState = (mpSdk: MpSdk, tags: Tag.TagData[], attachs: Tag.Attachment[]) => {
  mpSdk.App.state.subscribe(function (appState: App.State) {
    if (appState.phase === mpSdk.App.Phase.PLAYING) {
      if (tags.length >= 1) {
        console.log('%c data receiving completed!', 'background: #333333; color: #8dceff');
      } else {
        console.log('%c This model has no tag data', 'background: #333333; color: #8dceff');
      }
      if (attachs.length >= 1) {
        console.log('%c attachments receiving completed!', 'background: #333333; color: #8dceff');
      } else {
        console.log('%c This model has no attachments!', 'background: #333333; color: #8dceff');
      }
    }
  });
};
