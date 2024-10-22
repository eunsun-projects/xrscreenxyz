import { CustomTagData } from '@/components/types/vr.type';
import { Tag } from '../../../../public/matterport-assets/sdk';

export const subscribeTags = async (
  mpSdk: MpSdk,
): Promise<{
  subscribedTags: CustomTagData[] | undefined | null;
  subscribedAttachs: Tag.Attachment[] | undefined | null;
}> => {
  let tagArr: Array<CustomTagData> = [];
  let attachArr: Tag.Attachment[] = [];

  const tagPromise = new Promise<CustomTagData[] | undefined | null>((resolve) => {
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

  const attachPromise = new Promise<Tag.Attachment[] | undefined | null>((resolve) => {
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
