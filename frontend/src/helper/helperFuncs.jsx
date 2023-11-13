// convert file to image
export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
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

// convert dayjs object to string
export function dateToString (date) {
  return date.format('DD/MM/YYYY').toString()
}

// get user ratings given the listing.reviews
export function getUserRating (reviews) {
  let userRating = 0;
  let reviewLength = 0;
  if (reviews) {
    reviewLength = reviews.length;
    for (const review of reviews) {
      userRating += parseFloat(review.rating);
    }
    userRating /= reviewLength;
  }
  return [userRating, reviewLength]
}
