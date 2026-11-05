// Genuine stock photography, served locally when downloaded or from Unsplash.
// Source/licence details are recorded in IMAGE-SOURCES.md.
export const imageSources = {
  warehouse: { id: 'photo-1586528116311-ad8dd3c8310d', width: 1600 },
  'warehouse-contact': { id: 'photo-1586528116311-ad8dd3c8310d', width: 1000 },
  electronics: { id: 'photo-1546435770-a3e426bf472b', width: 1000 },
  household: { id: 'photo-1507473885765-e6ed057f782c', width: 1000 },
  general: { id: 'photo-1586023492125-27b2c045efd7', width: 1000 }
};
export function stockImageUrl(name) {
  const image = imageSources[name];
  if (!image) return null;
  return `https://images.unsplash.com/${image.id}?auto=format&fit=crop&w=${image.width}&q=82&fm=jpg`;
}
