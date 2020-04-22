const IMAGE_HEIGHT = 2048;
const IMAGE_WIDTH = 2048;

function drawJuliaSet(){
  // Get form values
  let form = document.getElementById('form');

  // FIX ME CHECK INPUTS FOR UNWANTED STUFF
  let rValue = 4; //parseFloat(form[0].value);
  //let xMax = form[1].value;
  //let yMax = form[2].value;
  let cReal = -0.79 //parseFloat(form[3].value);
  let cImag = 0.15 //parseFloat(form[4].value);
  let kValue = 50;

  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var imageData = context.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT);

  for(var rowIndex = 0; rowIndex < IMAGE_HEIGHT ; rowIndex++){

    let xMax = 2;
    let yMax = 2;
    var zx;
    var zy;
    for(var columnnIndex = 0; columnnIndex < IMAGE_WIDTH  ; columnnIndex++){
      // Set Z1 for every RGB ALPHA set (just for every pixel)

      zx = -xMax + ((columnnIndex) * ((2 * xMax) / (IMAGE_WIDTH - 1)));
      zy = yMax - ((rowIndex) * ((2 * yMax) / (IMAGE_HEIGHT - 1)));
      // Check if pixel is in the julia set
      if(isJulia(kValue, cReal, cImag, zx, zy, rValue)){
        var currentPixelIndex = 4 * (( columnnIndex ) + rowIndex * IMAGE_WIDTH);
        imageData.data[currentPixelIndex] = 0;
        imageData.data[currentPixelIndex + 1] = 0;
        imageData.data[currentPixelIndex + 2] = 0;
        imageData.data[currentPixelIndex + 3] = 255;
      }
    }
  }
  context.putImageData(imageData, 0, 0);
  console.log('done');

}

// Determine if a pixel is in the julia set
function isJulia(kValue, cReal, cImag, zx, zy, rValue){
  if(kValue == 1){
    var absValue = Math.sqrt((zx* zx) + (zy * zy));
    if(absValue <= rValue ){
      return true;
    }
    else{
      return false;
    }
  }
  else{
    var new_zx = ((zx * zx) - (zy * zy) + cReal);
    var new_zy = ((2 * (zx * zy)) + cImag);
    kValue--;
    return isJulia(kValue, cReal, cImag, new_zx, new_zy, rValue);
  }
}
