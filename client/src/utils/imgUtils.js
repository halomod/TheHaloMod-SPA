/* eslint-disable */
import canvg from 'canvg';

export default (svgString, width, height, format, callback) => {
    console.log("got here");
  //var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to data URL
  const imgsrc = svgString;
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  console.log(imgsrc);
  canvas.width = width;
  canvas.height = height;
  const image = new Image();
  image.src = imgsrc;
  image.onload = function() {
    context.clearRect ( 0, 0, width, height );
    context.drawImage(image, 0, 0, width, height);

    canvas.toBlob( function(blob) {
        var filesize = Math.round( blob.length/1024 ) + ' KB';
        if ( callback ) callback( blob, filesize );
    });

};


  
  console.log("got here");
};
