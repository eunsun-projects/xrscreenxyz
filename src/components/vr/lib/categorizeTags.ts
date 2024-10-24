import { CustomTagData } from '@/components/types/vr.type';

export function categorizeTags(tagData: CustomTagData[] | null) {
  if (tagData === null) return { merged: null, unCategorized: null, categorized: null };
  const unSettedUnique = tagData
    .map((tag) => (tag.sorted !== null ? tag.sorted[1] : null))
    .filter((item): item is string => item !== null);

  unSettedUnique.sort((a, b) => a.localeCompare(b));

  const unique = [...new Set(unSettedUnique)];

  const unCategorized = tagData.filter((tag) => tag.sorted === null);

  const categorized = tagData.filter(
    (tag) => Array.isArray(tag.sorted) && unSettedUnique.includes(tag.sorted[1]),
  );

  categorized.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

  const merged = [...unCategorized, ...categorized];
  return { merged, unCategorized, categorized, unique };
}
