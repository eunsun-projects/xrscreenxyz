import { Control, CustomTagData, VideoXyz, VrModel } from '@/components/types/vr.type';

export async function importMediaModule(
  mpSdk: MpSdk,
  model: VrModel,
  tags: CustomTagData[] | undefined | null,
  attachs: CustomTagData[] | undefined | null,
): Promise<
  [
    CustomTagData[] | undefined | null,
    CustomTagData[] | undefined | null,
    VideoXyz | null,
    Control | null,
  ]
> {
  const isObject = model.object[0];
  const isPlane = model.plane[0];

  if (isObject && isPlane) {
    const objectModule = await import(`./media-modules/${model.object[1]}`);
    const planeModule = await import(`./media-modules/${model.plane[1]}`);
    await planeModule.default(mpSdk, model, tags, attachs);
    return await objectModule.default(mpSdk, model, tags, attachs);
  } else if (isObject) {
    const objectModule = await import(`./media-modules/${model.object[1]}`);
    return await objectModule.default(mpSdk, model, tags, attachs);
  } else if (isPlane) {
    const planeModule = await import(`./media-modules/${model.plane[1]}`);
    return await planeModule.default(mpSdk, model, tags, attachs);
  } else {
    return [tags, attachs, null, null];
  }
}
