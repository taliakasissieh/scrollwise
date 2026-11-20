// Licensed photos added at build time from photos/credits.json (see PHOTOS.md).
// build.mjs puts them on window.SW_PHOTOS. Anything without a photo uses its drawn scene instead.
const LIB = (typeof window !== 'undefined' && window.SW_PHOTOS) || {};

export function photo(id) {
  return (id && LIB[id]) || null;
}

export const postPhoto = (post) => photo(post.photo) || photo(`post-${post.id}`);
export const activityPhoto = (a) => photo(a.photo) || photo(`activity-${a.id}`);
export const avatarPhoto = (user) => photo(`avatar-${user}`);

export function allPhotos() {
  return Object.values(LIB);
}
