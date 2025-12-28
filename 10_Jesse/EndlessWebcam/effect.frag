precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;
uniform vec2 mousePos;

float n = 30.0;
float mouseSensitivity = 3.0;
// vec3 colours[6] = vec3[6](vec3(0.235,0.153,0.549), vec3(0.188,0.125,0.125), vec3(0.992,0.847,0.4), vec3(0.376,0.427,0.392), vec3(0.902,0.2,0.286), vec3(0.012,0.714,0.871));
void main() {
  float aspect = resolution.x / resolution.y; //calculating the aspect ratio
  vec2 uv = vTexCoord;
  vec2 nMouse = mousePos /resolution;
  uv.y = 1.0 - uv.y;
  vec2 tile = fract((uv + nMouse * mouseSensitivity) * n);
  vec3 sample = texture2D(tex0, tile).rgb;
  gl_FragColor = vec4(sample, 1.0);
}