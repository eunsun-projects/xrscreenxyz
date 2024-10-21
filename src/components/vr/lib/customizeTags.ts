import { CustomTagData } from '@/components/types/vr.type';

export const customizeTags = (tagData: CustomTagData[]) => {
  const regexExp = /\{([^\]\[\r\n]*)\}/; //do not set global flag

  if (tagData.length > 0) {
    const mapped: CustomTagData[] = tagData.map((tag) => {
      let attachments: string[] = [];
      if (tag.attachments && tag.customAttachments) {
        attachments = [...tag.attachments, ...tag.customAttachments];
      }
      if (tag.customAttachments) {
        attachments = [...tag.customAttachments];
      }
      return {
        ...tag,
        sorted: tag.description.match(regexExp), //[1]
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
