// 경로 alias를 상대 경로로 변경한 예시
import { Tag } from '../../../../sdk';
import { Control, CustomTagData, VideoXyz, VrModel } from '../../../components/types/vr.type';
// const context = require.context('@/components/vr/lib/media-modules', false, /\.ts$/);

// 모듈 매핑 객체 생성
const mediaModules: { [key: string]: () => Promise<any> } = {
  defragmentation: () => import('@/components/vr/lib/media-modules/defragmentation'),
  // 필요한 모듈들을 추가
};

export async function importMediaModule(
  mpSdk: MpSdk,
  model: VrModel,
  tags: CustomTagData[] | undefined | null,
  attachs: Tag.Attachment[] | undefined | null,
): Promise<
  [
    CustomTagData[] | undefined | null,
    Tag.Attachment[] | undefined | null,
    VideoXyz | null,
    Control | null,
  ]
> {
  const isObject = model.object[0];
  const isPlane = model.plane[0];
  const objectModel = model.object[1] as string;
  const planeModel = model.plane[1] as string;

  if (isObject && isPlane) {
    const objectImport = mediaModules[objectModel];
    const planeImport = mediaModules[planeModel];

    if (planeImport) {
      const planeModule = await planeImport();
      await planeModule.default(mpSdk, model, tags, attachs);
    }

    if (objectImport) {
      const objectModule = await objectImport();
      return await objectModule.default(mpSdk, model, tags, attachs);
    }
  } else if (isObject) {
    const objectImport = mediaModules[objectModel];

    if (objectImport) {
      const objectModule = await objectImport();
      return await objectModule.default(mpSdk, model, tags, attachs);
    }
  } else if (isPlane) {
    const planeImport = mediaModules[planeModel];

    if (planeImport) {
      const planeModule = await planeImport();
      return await planeModule.default(mpSdk, model, tags, attachs);
    }
  } else {
    return [tags, attachs, null, null];
  }
  return [tags, attachs, null, null];
}
