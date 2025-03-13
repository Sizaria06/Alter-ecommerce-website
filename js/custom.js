// var canvas = document.getElementById('myCanvas');
// var context = canvas.getContext('2d');
// var imageObj = new Image();

// var x = 0;
// var y = 0;
// var width = 290;
// var height = 297;

// imageObj.onload = function() {
//     context.drawImage(imageObj, x, y);
// };

// imageObj.src = 'C:/Github/Ecommerce/media/151969_original_3840x3840.jpg';

// other information
var perimeter, halfPerimeter, diameter, radius, cropStartX, cropWidth;

var img = new Image();
img.onload = function() {
  // calculate the information of the circle
  perimeter = img.width;
  halfPerimeter = perimeter/2;
  diameter = perimeter / Math.PI;
  radius = diameter / 2;

  // calculate the position to crop the image, 1/4 -> 3/4
  cropStartX = 0.25 * img.width;
  cropWidth = (0.75 * img.width) - cropStartX;

  transformImage(img); // will be explained later
};
img.src = imageUrl; // replace with the real image url
function createOriginalCanvas(img, cropStartX, cropWidth) {
    var original = {};
  
    // start creating the canvas
    var canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = img.height;
    original.canvas = canvas;
  
    // draw the image on the canvas
    var context = canvas.getContext('2d');
    context.drawImage(img, cropStartX, 0, canvas.width, canvas.height,
                      0, 0, canvas.width, canvas.height);
    original.context = context;
  
    // pixel data
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    original.imageData = imageData;
    original.data = data;
  
    return original;
  }
  function createReflectedCanvas(img, width) {
    var reflected = {};
  
    // start by creating the canvas
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = img.height;
    reflected.canvas = canvas;
  
    var context = canvas.getContext('2d');
    reflected.context = context;
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    reflected.imageData = imageData;
    var data = imageData.data;
    reflected.data = data;
  
    return reflected;
  }
  function transformImage(img) {
    var original = createOriginalCanvas(img, cropStartX, cropWidth);
    var reflected = createReflectedCanvas(img, diameter);
  
    // from the idea picture
    var OA = radius;
    var OM;
    var aa;
    var cosaa; // cosine of aa angle
    var AN; // length of AN curve, also the x position of the projection pixel
  
    // other variables, we need these variables because the pixel data exported from
    // the canvas is an one direction array, not 2D one, so we need to calculate the
    // corresponding position of the data in that array based on the width and height
    var originalPixelOrder; // the order of the pixel in the original image
    var reflectedPixelOrder;    // the order of the pixel in the reflected image
    var r, g, b, a;             // red, green, blue and alpha color value
  }
  // loop it line by line ...
  for(var y = 0; x < reflected.canvas.height; y++) {
    // ... and then column by column
    for(var x = 0; y < reflected.canvas.width; x++) {
      // y current height
      // x the current width

      // calculate the aa angle in radian
      OM = OA - x;
      if(OM > 0) {
        cosaa = OM / OA;
        aa = Math.acos(cosaa); // radian
      } else if(OM === 0) {
        aa = Math.PI/2; // radian
      } else {
        OM = 0 - OM;
        cosaa = OM / OA;
        aa = Math.acos(cosaa); // radian
        aa = Math.PI - aa;     // radian
      }

      // calculate AN curve
      AN = aa * OA;
      AN = Math.floor(AN); // radian

      // find the right pixel order in the original image
      // and take out the color value
      originalPixelOrder = y * original.canvas.width + AN;
      r = original.data[originalPixelOrder * 4];
      g = original.data[originalPixelOrder * 4 + 1];
      b = original.data[originalPixelOrder * 4 + 2];
      a = original.data[originalPixelOrder * 4 + 3];

      // copy the pixel data to the current pixel on reflected image
      reflectedPixelOrder = y * reflected.canvas.width + x;
      reflected.data[reflectedPixelOrder * 4] = r;
      reflected.data[reflectedPixelOrder * 4 + 1] = g;
      reflected.data[reflectedPixelOrder * 4 + 2] = b;
      reflected.data[reflectedPixelOrder * 4 + 3] = a;
    }
    function drawImage(reflected) {
        // draw the pixel data to canvas
        reflected.context.putImageData(reflected.imageData, 0, 0);
      
        // get the image url
        var reflectedUrl = reflected.canvas.toDataURL();
        // you can console.log(reflectedUrl) to see the result
      }
  }

  for(var x = 0; x < reflected.canvas.width; x++) {
    // calculate the aa angle in radian
    OM = OA - x;
    if(OM > 0) {
      cosaa = OM / OA;
      aa = Math.acos(cosaa); // radian
    } else if(OM === 0) {
      aa = Math.PI/2; // radian
    } else {
      OM = 0 - OM;
      cosaa = OM / OA;
      aa = Math.acos(cosaa); // radian
      aa = Math.PI - aa;     // radian
    }
  
    // calculate AN curve
    AN = aa * OA;
    AN = Math.floor(AN); // radian
  
    for(var y = 0; y < reflected.canvas.height; y++) {
      // y current height
      // x the current width
  
      // find the right pixel order in the original image
      originalPixelOrder = y * original.canvas.width + AN;
      r = original.data[originalPixelOrder * 4];
      g = original.data[originalPixelOrder * 4 + 1];
      b = original.data[originalPixelOrder * 4 + 2];
      a = original.data[originalPixelOrder * 4 + 3];
      reflectedPixelOrder = y * reflected.canvas.width + x;
      reflected.data[reflectedPixelOrder * 4] = r;
      reflected.data[reflectedPixelOrder * 4 + 1] = g;
      reflected.data[reflectedPixelOrder * 4 + 2] = b;
      reflected.data[reflectedPixelOrder * 4 + 3] = a;
    }
  }

  // variable
var x1 = reflected.canvas.width / 2;
var x2 = reflected.canvas.width;
var y1 = 0; // input y of O here
var y2 = 0;

// find the equation
var eb = (y2*x1*x1 - y1*x2*x2) / (x2*x1*x1 - x1*x2*x2);
var ea = (y1 - eb*x1) / (x1*x1);

// variable used for the loop
var currentYOffset;

function createReflectedCanvas(img, width) {
    ///

  
    canvas.height = img.height + 0; // input the value of y1 here
  
    ///
  }

for(var x = 0; x < reflected.canvas.width; x++) {
    // calculate the aa angle in radian
    OM = OA - x;
    if(OM > 0) {
      cosaa = OM / OA;
      aa = Math.acos(cosaa); // radian
    } else if(OM === 0) {
      aa = Math.PI/2; // radian
    } else {
      OM = 0 - OM;
      cosaa = OM / OA;
      aa = Math.acos(cosaa); // radian
      aa = Math.PI - aa;     // radian
    }
  
    // calculate AN curve
    AN = aa * OA;
    AN = Math.floor(AN); // radian
  
    // CHANGE
    // calculate the current offset
    currentYOffset = (ea * x * x) + eb * x;
    currentYOffset = Math.ceil(currentYOffset);
    //
  
    for(var y = 0; y < reflected.canvas.height; y++) {
      // y current height
      // x the current width
  
      // find the right pixel order in the original image
      originalPixelOrder = y * original.canvas.width + AN;
      r = original.data[originalPixelOrder * 4];
      g = original.data[originalPixelOrder * 4 + 1];
      b = original.data[originalPixelOrder * 4 + 2];
      a = original.data[originalPixelOrder * 4 + 3];
      // CHANGE
      reflectedPixelOrder = (y + currentYOffset) * reflected.canvas.width + x;
      //
      reflected.data[reflectedPixelOrder * 4] = r;
      reflected.data[reflectedPixelOrder * 4 + 1] = g;
      reflected.data[reflectedPixelOrder * 4 + 2] = b;
      reflected.data[reflectedPixelOrder * 4 + 3] = a;
    }
  }