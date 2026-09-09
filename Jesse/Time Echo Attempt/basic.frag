precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform int paletteN;
uniform vec2 mousePos;
uniform sampler2D tex0;
uniform sampler2D tex1;

const float cuts = 12.0;
vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

vec3 gradientMapLinearInterpolation(float v, float pN){
  v = mod(v + mousePos.x, 1.0);
  float m = v * (pN-1.0); //reused later (and repurposed), removing the denominator
  float x1 = floor(m);
  float x2 = ceil(m);
  m = fract(m);
  // m = normalise(x1, x2, gscl);
  vec3 cx1 = gradientMap(x1 / (pN - 1.0));
  vec3 cx2 = gradientMap(x2 / (pN - 1.0));
  vec3 cxf = mix(cx1, cx2, m);
  return cxf;
}

float normalise(float inMin, float inMax, float v){
  return ((v - inMin)/(inMax - inMin));
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  vec2 tv = uv;
  tv.y = 1.0-tv.y;
  vec2 tc = uv;
  uv = 2.0*uv -1.0;
  vec3 cam = texture2D(tex0, tv).rgb;
  vec3 camLagged = texture2D(tex1, tv).rgb;

  float pN = float(paletteN);
  // vec3 finalColor = gradientMap(dot(cam.rgb, vec3(1.0)));
  float gscl0 = dot(cam, vec3(0.333)); //this goes over 1.0 right now shoudl use a map to fix. or just a brightness func
  float gscl1 = dot(camLagged, vec3(0.333)); //this goes over 1.0 right now shoudl use a map to fix. or just a brightness func
  vec3 col = vec3(0);
  float alt1y = step(fract(uv.y*cuts), 0.5);
  float alt2y = step(fract(uv.y*cuts + 0.5), 0.5);
  float alt1x = step(fract(uv.x*cuts), 0.5);
  float alt2x = step(fract(uv.x*cuts + 0.5), 0.5);

  col += gradientMap(gscl1) * alt1y;
  col += gradientMapLinearInterpolation(gscl0, pN) * alt2y;
  // vec3 finalColor = gradientMap(cxf);
  gl_FragColor = vec4(col, 1.0);
}