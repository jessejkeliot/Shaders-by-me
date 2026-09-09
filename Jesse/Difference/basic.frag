precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform int paletteN;
uniform vec2 mousePos;
uniform sampler2D tex0;
uniform sampler2D tex1;


void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  vec2 tv = uv;
  tv.y = 1.0-tv.y;
  vec2 tv2 = tv;
  // tv2.x = 1.0 - uv.x;
  uv = 2.0*uv -1.0;
  vec3 cam = texture2D(tex0, tv).rgb;
  vec3 camLagged = texture2D(tex1, tv2).rgb;
  //get the difference between cam and camLagged
  // vec3 col = cam - abs(cam - camLagged);
  vec3 col = max(cam, camLagged);
  // vec3 finalColor = gradientMap(cxf);
  gl_FragColor = vec4(col, 1.0);
}