import { CustomTagData } from '@/components/types/vr.type';
import { MpSdk } from '@matterport/r3f';
import { Tag } from '../../../../public/matterport-assets/sdk';

export const subscribeTags = async (
  mpSdk: MpSdk,
): Promise<{ subscribedTags: CustomTagData[]; subscribedAttachs: Tag.Attachment[] }> => {
  let tagArr: Array<CustomTagData> = [];
  let attachArr: Array<Tag.Attachment> = [];

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

  const attachPromise = new Promise<Tag.Attachment[]>((resolve) => {
    mpSdk.Tag.attachments.subscribe({
      onCollectionUpdated(collection: Tag.Attachment[]) {
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
