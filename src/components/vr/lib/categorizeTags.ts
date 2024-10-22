import { CustomTagData } from '@/components/types/vr.type';

export function categorizeTags(tagData: CustomTagData[] | null) {
  if (tagData === null) return { merged: null, unCategorized: null, categorized: null };
  const unique = tagData
    .map((tag) => (tag.sorted !== null ? tag.sorted[1] : null))
    .filter((item): item is string => item !== null);

  unique.sort((a, b) => a.localeCompare(b));

  const unCategorized = tagData.filter((tag) => tag.sorted === null);

  const categorized = tagData.filter(
    (tag) => Array.isArray(tag.sorted) && unique.includes(tag.sorted[1]),
  );

  categorized.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

  const merged = [...unCategorized, ...categorized];
  return { merged, unCategorized, categorized, unique };
}
