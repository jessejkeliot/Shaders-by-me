// this sketch shows how to use texture coordinates to create a fly's eye mosaic effect

// the shader variable
let camShader;

// the camera variable
let cam;
let paletteTexture;
let paletteLink = "statue.jpg-palette.json";
let jsonColors = [];

function preload() {
  // load the shader
  loadJSON(paletteLink, (data) => {
    jsonColors = data;
  });
  camShader = loadShader("effect.vert", "effect.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // initialize the webcam at the window size
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  video.hide();

  let colors = [
    [0.235, 0.153, 0.549],
    [0.188, 0.125, 0.125],
    [0.992, 0.847, 0.4],
    [0.376, 0.427, 0.392],
    [0.0, 0.0, 0.0],
    [0.902, 0.2, 0.286],
    [0.012, 0.714, 0.871],
  ];
  colors = [[0.0, 1.0, 0.5],
   [1.0, 0.0, 0.8], [0.5, 0.2, 0.0]];
  // if (paletteLink != "") {
  //   let colorKeys = Object.keys(jsonColors);
  //   colors = colorKeys.map((c) => {
  //     let rgb = hexToColour(c);
  //     return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
  //   });
  // }
  console.log(colors);

  paletteTexture = createGraphics(colors.length, 1);
  paletteTexture.noStroke();
  for (let i = 0; i < colors.length; i++) {
    paletteTexture.fill(colors[i][0] * 255, colors[i][1] * 255, colors[i][2] * 255);
    paletteTexture.rect(i, 0, 1, 1);
  }
}

function draw() {
  // shader() sets the active shader with our shader
  shader(camShader);

  // send the camera and the resolution to the shader
  camShader.setUniform("tex0", video);
  camShader.setUniform("resolution", [width, height]);
  camShader.setUniform("palette", paletteTexture);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function hexToColour(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return color(r, g, b);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}