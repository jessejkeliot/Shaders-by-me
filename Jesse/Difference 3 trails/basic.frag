precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform int paletteN;
uniform vec2 mousePos;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;

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

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
//   uv = fract(uv);
  vec2 tv = uv;
  tv.y = 1.0-tv.y;
  vec2 tv2 = tv;
  // tv2.x = 1.0 - uv.x;
  uv = 2.0*uv -1.0;
  vec3 cam = texture2D(tex0, tv).rgb;
  vec3 camLagged = texture2D(tex1, tv2).rgb;
  vec3 camLagged1 = texture2D(tex2, tv2).rgb;

  // 2. Max them together
  vec3 col = max(cam, max(camLagged, camLagged1));
  //get the difference between cam and camLagged
  // vec3 col = cam - abs(cam - camLagged);
  // vec3 finalColor = gradientMap(cxf);
  // float dark = step(0.05, dot(col, vec3(0.333)));
  // gl_FragColor = vec4(gradientMapLinearInterpolation(dot(col, vec3(0.333)), float(paletteN)), 1.0);
  gl_FragColor = vec4(col, 1.0);
}