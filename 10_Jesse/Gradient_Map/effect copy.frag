precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;


float amt = 0.1; // the amount of displacement, higher is more
float squares = 20.0; // the number of squares to render vertically

void main() {
  float aspect = resolution.x /resolution.y;
  float offset = amt * 0.5;

  vec2 uv = vTexCoord;
  vec2 tc = uv;
  uv.y = 1.0 - uv.y;
  uv.x *= aspect;
  uv -= 0.5;

  vec2 tile = fract(uv * squares + 0.5) * amt;
  gl_FragColor = sampler2D(tex0, tc + tile - offset);
}