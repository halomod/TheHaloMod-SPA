/* eslint-disable */
export default (svgString, width, height, format, callback) => {
  // var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
  const imgsrc = svgString;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;
  console.log("got here");
  const image = new Image();
  image.onload = function () {
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    console.log("got here");
    canvas.toBlob((blob) => {
      const filesize = `${Math.round(blob.length / 1024)} KB`;
      if (callback) callback(blob, filesize);
    });
  };

  image.src = imgsrc;
  console.log("got here");
  return image;
};
