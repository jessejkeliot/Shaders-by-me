//this variable will hold our shader object
let simpleShader;
var cnv;
let paletteTexture;
let zoomDepth;
let viewOffset;
let viewOffsetSpeed = 0.05;
function preload() {
  simpleShader = loadShader("basic.vert", "Mandelbrot.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // centerCanvas();
  noStroke();
  let colors = [
    [0.235, 0.153, 0.96],
    [0.188, 0.125, 0.125],
    [0.992, 0.847, 0.4],  
    [0.376, 0.427, 0.392],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.03],
  ];
  paletteTexture = createGraphics(colors.length, 1);
  paletteTexture.noStroke();
  for (let i = 0; i < colors.length; i++) {
    paletteTexture.fill(colors[i][0] * 255, colors[i][1] * 255, colors[i][2] * 255);
    paletteTexture.rect(i, 0, 1, 1);
  }
  zoomDepth = 1.0;
  viewOffset = createVector(0.0, 0.0);
}

function draw() {
  shader(simpleShader);
  simpleShader.setUniform("time", millis()/1000);
  simpleShader.setUniform("resolution", [width, height]);
  simpleShader.setUniform("mousePos", [mouseX/width, mouseY/height]);
  simpleShader.setUniform("palette", paletteTexture);
  simpleShader.setUniform("zoom", zoomDepth);
  simpleShader.setUniform("viewOffset", [viewOffset.x, viewOffset.y]);
  rect(0, 0, width, height);
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  // centerCanvas();
  resizeCanvas(windowWidth, windowHeight);
}
function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}
function keyPressed() {
  if(key=="x"){
    zoomDepth *= 1.5;
  }
  if(key=="z"){
    zoomDepth /= 1.5;
  }
  if(key=="w"){
    viewOffset.y += viewOffsetSpeed*zoomDepth;
  }
  if(key=="s"){
    viewOffset.y -= viewOffsetSpeed*zoomDepth;
  }
  if(key=="d"){
    viewOffset.x += viewOffsetSpeed*zoomDepth;
  }
  if(key=="a"){
    viewOffset.x -= viewOffsetSpeed* zoomDepth;
  }
}
