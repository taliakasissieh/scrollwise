// Optional photos people attach to a completed moment.
// Stored apart from the main state (photos are large), shrunk to 640px, capped at 30.
// Demo Mode photos stay in memory only, so they never mix with real data.

const KEY = 'scrollwise:photos:v1';
const MAX_PHOTOS = 30;
let demoPhotos = {};

export function loadPhotos(demo) {
  if (demo) return demoPhotos;
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '{}') || {};
  } catch (e) {
    return {};
  }
}

function persist(demo, photos) {
  if (demo) {
    demoPhotos = photos;
    return true;
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(photos));
    return true;
  } catch (e) {
    return false;
  }
}

// Returns the new photo map, or null when the browser has no room left.
export function addPhoto(demo, mid, dataUrl) {
  const photos = { ...loadPhotos(demo), [mid]: { src: dataUrl, at: Date.now() } };
  const ids = Object.keys(photos).sort((a, b) => photos[a].at - photos[b].at);
  while (ids.length > MAX_PHOTOS) delete photos[ids.shift()];
  return persist(demo, photos) ? photos : null;
}

export function removePhoto(demo, mid) {
  const photos = { ...loadPhotos(demo) };
  delete photos[mid];
  persist(demo, photos);
  return photos;
}

export function clearPhotos(demo) {
  if (demo) demoPhotos = {};
  else {
    try {
      window.localStorage.removeItem(KEY);
    } catch (e) {
      /* nothing to clear */
    }
  }
  return {};
}

// Reads an image file and returns a small JPEG data URL.
export function shrinkImage(file, max = 640) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\//.test(file.type)) {
      reject(new Error('Please choose an image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('That photo could not be read.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That photo could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.74));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
