//this variable will hold our shader object
let simpleShader;
var cnv;
let paletteTexture;
let imageTexture;
let paletteLink = "../palettes/AmigaWorldT-palette.json";
let imageLink = "test_image.png";
let jsonColors = [];
let pN;
let laggedFrame;
let laggedFrame1;
const waitFrames = 30;
let buffer = new Array(waitFrames).fill(null);
let cycleCount = 0;

function preload() {
  loadJSON(paletteLink, (data) => {
    jsonColors = data;
  });
  simpleShader = loadShader("basic.vert", "basic.frag");
}

function setup() {
  createCanvas(600*1.3, 480*1.2, WEBGL);
  // centerCanvas();
  // initialize the webcam at the window size
  video = createCapture(VIDEO);
  video.size(width, height);
  frameRate(30);

  // hide the html element that createCapture adds to the screen
  video.hide();
  noStroke();
  let colors = [
    [0.235, 0.153, 0.549],
    [0.188, 0.125, 0.125],
    [0.992, 0.847, 0.4],
    [0.376, 0.427, 0.392],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.03],
  ];
  if (paletteLink != "") {
    let colorKeys = Object.keys(jsonColors);
    colors = colorKeys.map((c) => {
      let rgb = hexToColour(c);
      return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    });
  }
  //add the first colour again to the end so we can loop
  colors.push(colors[0]);
  console.log(colors);
  pN = colors.length;
  paletteTexture = createGraphics(colors.length, 1);
  paletteTexture.noStroke();
  for (let i = 0; i < colors.length; i++) {
    paletteTexture.fill(colors[i][0] * 255, colors[i][1] * 255, colors[i][2] * 255);
    paletteTexture.rect(i, 0, 1, 1);
  }

  //to make a smoother gradient we should

  // imageTexture = loadImage(imageLink);
  imageTexture = video;
}

function draw() {

  if (video.width === 0) {
    background(0);
    return;
  }
  let index = cycleCount % waitFrames;
  buffer[index] = video.get();

  let readIndex = (index + 1) % waitFrames;
  let readIndex1 = (index + 1 + floor(waitFrames/2)) % waitFrames;

  // If the buffer is full show the oldest frame and remove it
  if (buffer[readIndex] !== null && buffer[readIndex1] !== null) {
    laggedFrame = buffer[readIndex];
    laggedFrame1 = buffer[readIndex1];
  }
  if (laggedFrame && laggedFrame.width > 0 && laggedFrame1 && laggedFrame1.width > 0) {
    shader(simpleShader);

    // Use the globals
    simpleShader.setUniform("time", millis() / 1000);
    simpleShader.setUniform("resolution", [width, height]);
    simpleShader.setUniform("mousePos", [mouseX / width, mouseY / height]);
    simpleShader.setUniform("palette", paletteTexture);
    simpleShader.setUniform("paletteN", pN);

    // tex0 = webcam, tex1 = ghost
    simpleShader.setUniform("tex0", video);
    simpleShader.setUniform("tex1", laggedFrame);
    simpleShader.setUniform("tex2", laggedFrame1);

    rect(-width / 2, -height / 2, width, height);
  } else {
    background(0);
  }
  cycleCount++;
  

  if (cycleCount >= waitFrames) {
    cycleCount = 0; 
  }
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}
function hexToColour(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
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

function takeScreenshot(linkString) {
  let fileName = `${linkString}_frame_${nf(frameCount, 4)}`;

  saveCanvas(fileName, "png");
}

function keyPressed() {
  if (key === "s" || key === "S") {
    takeScreenshot(imageLink);
  }
}
