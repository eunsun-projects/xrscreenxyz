import { CustomTagData } from '@/components/types/vr.type';
import useVrStore from '@/zustand/vr.store';
import { Tag } from '../../../../public/matterport-assets/sdk';

export const watchTagState = (
  mpSdk: MpSdk,
  subscribedTags?: CustomTagData[] | null | undefined,
  customizedTags?: CustomTagData[] | null | undefined,
): void => {
  const { setModalState } = useVrStore.getState();
  mpSdk.Tag.toggleNavControls(false);
  mpSdk.Tag.openTags.subscribe({
    prevState: {
      hovered: null,
      docked: null,
      selected: null,
    },
    onChanged(newState: Tag.OpenTags) {
      const [selected = null] = newState.selected; // destructure and coerce the first Set element to null
      if (selected !== this.prevState.selected) {
        if (selected) {
          const tag =
            subscribedTags?.find((tag) => tag.id === selected) ??
            customizedTags?.find((tag) => tag.id === selected);
          if (tag) {
            setModalState({ type: 'tag', isOpen: true, selectedTag: tag });
          }
        }
      }
      this.prevState = {
        ...newState,
        selected,
      };
    },
  });
};
