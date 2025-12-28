//this variable will hold our shader object
let simpleShader;
var cnv;
let paletteTexture;
function preload() {
  simpleShader = loadShader("basic.vert", "basic.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // centerCanvas();
  noStroke();
  let colors = [
    [0.235, 0.153, 0.549],
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
}

function draw() {
  shader(simpleShader);
  simpleShader.setUniform("time", millis() / 1000);
  simpleShader.setUniform("resolution", [width, height]);
  simpleShader.setUniform("mousePos", [mouseX/width, mouseY/height]);
  simpleShader.setUniform("palette", paletteTexture);
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
