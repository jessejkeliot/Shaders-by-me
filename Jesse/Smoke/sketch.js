let simpleShader;
let snapshot;
let webcam;
let m = 20;
function preload() {
  simpleShader = loadShader("basic.vert", "basic.frag");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  webcam = createCapture(VIDEO);
  webcam.size(windowWidth, windowHeight);
}

function draw() {
  //
  // 1️⃣ draw your standard scene (NO SHADER HERE)
  //
  resetShader();  // turn off any previous shader
  background(30);

  // Circle motion
  let radius = 400;
  let angle = frameCount * 0.05;

  
  for (let index = 0; index < m; index++) {
    let x = cos(angle + index/m) * radius + m;
    let y = sin(angle + m/index) * radius;
    push();
    translate(x, y);
    fill(255 * index/m, sin(frameCount * 0.01) * 100 + 100, 150 * (m/index) * 1.9);
    square(-50, -50, 300 * index/m + 200);
    // rotateX(frameCount * 0.02);
    pop();
  }


  //
  // 2️⃣ snapshot the canvas BEFORE shader mode
  //
  snapshot = get();   // now safe — renderer is in normal mode


  //
  // 3️⃣ apply shader to fullscreen quad
  //
  shader(simpleShader);
  simpleShader.setUniform("tex0", snapshot);
  simpleShader.setUniform("tex1", webcam);
  simpleShader.setUniform("resolution", [width, height]);
  simpleShader.setUniform("time", millis() / 1000.0);

  // Draw shader quad
  rect(0, 0, width, height);
}
