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
  var dataURL = canvas.toDataURL("image/png");
  var image = new Image;
  image.src = dataURL;
  zoom(image);
  //setInterval(zoom, 100);
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



function zoom(image){
  var ctx = canvas.getContext('2d');
  trackTransforms(ctx);
  function redraw(){
      // Clear the entire canvas
      var p1 = ctx.transformedPoint(0,0);
      var p2 = ctx.transformedPoint(canvas.width,canvas.height);
      ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

      // Alternatively:
      // ctx.save();
      // ctx.setTransform(1,0,0,1,0,0);
      // ctx.clearRect(0,0,canvas.width,canvas.height);
      // ctx.restore();

      ctx.drawImage(image,0,0);
      
  }
  redraw();
  
  var lastX=canvas.width/2, lastY=canvas.height/2;
  var dragStart,dragged;
  canvas.addEventListener('mousedown',function(evt){
      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
      lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
      lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
      dragStart = ctx.transformedPoint(lastX,lastY);
      dragged = false;
  },false);
  canvas.addEventListener('mousemove',function(evt){
      lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
      lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
      dragged = true;
      if (dragStart){
          var pt = ctx.transformedPoint(lastX,lastY);
          ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
          redraw();
      }
  },false);
  canvas.addEventListener('mouseup',function(evt){
      dragStart = null;
      if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
  },false);

  var scaleFactor = 1.1;
  var zoom = function(clicks){
      var pt = ctx.transformedPoint(lastX,lastY);
      ctx.translate(pt.x,pt.y);
      var factor = Math.pow(scaleFactor,clicks);
      ctx.scale(factor,factor);
      ctx.translate(-pt.x,-pt.y);
      redraw();
  }

  var handleScroll = function(evt){
      var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
      if (delta) zoom(delta);
      return evt.preventDefault() && false;
  };
  canvas.addEventListener('DOMMouseScroll',handleScroll,false);
  canvas.addEventListener('mousewheel',handleScroll,false);
};


function trackTransforms(ctx){
  var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
  var xform = svg.createSVGMatrix();
  ctx.getTransform = function(){ return xform; };
  
  var savedTransforms = [];
  var save = ctx.save;
  ctx.save = function(){
      savedTransforms.push(xform.translate(0,0));
      return save.call(ctx);
  };
  var restore = ctx.restore;
  ctx.restore = function(){
      xform = savedTransforms.pop();
      return restore.call(ctx);
  };

  var scale = ctx.scale;
  ctx.scale = function(sx,sy){
      xform = xform.scaleNonUniform(sx,sy);
      return scale.call(ctx,sx,sy);
  };
  var rotate = ctx.rotate;
  ctx.rotate = function(radians){
      xform = xform.rotate(radians*180/Math.PI);
      return rotate.call(ctx,radians);
  };
  var translate = ctx.translate;
  ctx.translate = function(dx,dy){
      xform = xform.translate(dx,dy);
      return translate.call(ctx,dx,dy);
  };
  var transform = ctx.transform;
  ctx.transform = function(a,b,c,d,e,f){
      var m2 = svg.createSVGMatrix();
      m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
      xform = xform.multiply(m2);
      return transform.call(ctx,a,b,c,d,e,f);
  };
  var setTransform = ctx.setTransform;
  ctx.setTransform = function(a,b,c,d,e,f){
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(ctx,a,b,c,d,e,f);
  };
  var pt  = svg.createSVGPoint();
  ctx.transformedPoint = function(x,y){
      pt.x=x; pt.y=y;
      return pt.matrixTransform(xform.inverse());
  }
}
