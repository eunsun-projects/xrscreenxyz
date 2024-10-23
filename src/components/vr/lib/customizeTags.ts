import { CustomTagData } from '@/components/types/vr.type';
import { sortRegex } from '@/utils/common';

export const customizeTags = (tagData: CustomTagData[] | undefined | null) => {
  if (tagData && tagData.length > 0) {
    const mapped: CustomTagData[] = tagData.map((tag) => {
      let attachments: string[] = [];
      if (tag.attachments && tag.customAttachments) {
        attachments = [...tag.attachments, ...tag.customAttachments];
      }
      if (tag.customAttachments) {
        attachments = [...tag.customAttachments];
      }
      attachments = [...tag.attachments];
      return {
        ...tag,
        sorted: tag.description.match(sortRegex), //[1]
        attachments,
      };
    });

    mapped.sort(function (a, b) {
      const upperCaseA = a.label.toUpperCase();
      const upperCaseB = b.label.toUpperCase();
      if (upperCaseA > upperCaseB) return 1;
      if (upperCaseA < upperCaseB) return -1;
      return 0;
    });

    return mapped;
  } else {
    return null;
  }
};
