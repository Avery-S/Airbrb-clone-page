export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export function dateToString (date) {
  return date.format('DD/MM/YYYY').toString()
}

export function getUserRating (reviews) {
  let userRating = 0;
  const reviewLength = reviews.length;
  for (const review of reviews) {
    userRating += parseFloat(review.rating);
  }
  userRating /= reviewLength;
  return [userRating, reviewLength]
}
