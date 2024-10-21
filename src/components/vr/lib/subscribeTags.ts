import { CustomTagData } from '@/components/types/vr.type';
import { MpSdk } from '@matterport/r3f';

export const subscribeTags = async (
  mpSdk: MpSdk,
): Promise<{ subscribedTags: CustomTagData[]; subscribedAttachs: CustomTagData[] }> => {
  let tagArr: Array<CustomTagData> = [];
  let attachArr: Array<CustomTagData> = [];

  const tagPromise = new Promise<CustomTagData[]>((resolve) => {
    mpSdk.Tag.data.subscribe({
      onAdded: function (index: number) {
        mpSdk.Tag.allowAction(index, {
          docking: false,
          navigating: true,
          opening: false,
        });
      },
      onCollectionUpdated(collection: CustomTagData[]) {
        // console.log('태그목록 ', collection);
        for (const value of Object.values(collection)) {
          tagArr = [...tagArr, { ...value }];
        }
        resolve(tagArr);
      },
    });
  });

  const attachPromise = new Promise<CustomTagData[]>((resolve) => {
    mpSdk.Tag.attachments.subscribe({
      onCollectionUpdated(collection: CustomTagData[]) {
        // console.log('첨부파일 ', collection )
        for (const value of Object.values(collection)) {
          attachArr = [...attachArr, value];
        }
        resolve(attachArr);
      },
    });
  });

  const [tags, attachs] = await Promise.all([tagPromise, attachPromise]);
  return { subscribedTags: tags, subscribedAttachs: attachs };
};
