import { DropdownData, VrModel } from '@/components/types/vr.type';
import { MpSdk } from '@matterport/r3f';
import { categorizeTags } from './categorizeTags';
import { customizeTags } from './customizeTags';
import { hidePointer } from './hidePointer';
import { hidePucks } from './hidePucks';
import { importMediaModule } from './importMediaModule';
import { setSceneObject } from './setSceneObject';
import { subscribeTags } from './subscribeTags';
import { watchTagState } from './watchTagState';

export async function customizeVr(mpSdk: MpSdk, model: VrModel) {
  hidePointer(mpSdk);
  hidePucks(mpSdk);
  watchTagState(mpSdk);
  const { subscribedTags, subscribedAttachs } = await subscribeTags(mpSdk);
  const [tags, attachs, objectModule, planeModule] = await importMediaModule(
    mpSdk,
    model,
    subscribedTags,
    subscribedAttachs,
  );
  const customizedTags = customizeTags(tags);
  const { merged, unCategorized, categorized } = categorizeTags(customizedTags);
  await setSceneObject(mpSdk, model, objectModule, planeModule);
  return { merged, unCategorized, categorized, customizedAttachs: attachs } as DropdownData;
}
