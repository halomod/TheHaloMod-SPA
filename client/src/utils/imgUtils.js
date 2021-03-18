/* eslint-disable */
export default (svgString, width, height, format, doc) => {
    console.log("got here");
  //var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
  const imgsrc = svgString;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  console.log(imgsrc);
  canvas.width = width;
  canvas.height = height;
  console.log("got here");
  const image = new Image();
  
  image.onload = function () {
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    console.log("got here");
    doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 800, 300);
    doc.save('test.pdf')
  };
  image.src = imgsrc;
  console.log("got here");
};
