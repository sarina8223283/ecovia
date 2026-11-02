import amlaBack from '@/assets/amla-packaging-back.webp.asset.json';

// Only inspected brand edits belong here; these are official photos, not review evidence.
export const packagingPhotos: Record<string, Array<{ src: string; label: string }>> = {
  'amla-powder': [{ src: amlaBack.url, label: 'Amla Powder · back label' }],
};