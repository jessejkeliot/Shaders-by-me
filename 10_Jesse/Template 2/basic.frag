precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;
uniform sampler2D tex0;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  vec2 tv = uv;
  vec2 tc = uv;
  uv = 2.0*uv -1.0;
  tc.y = 1.0 - tc.y;
  tc *= 0.9;

  // tc = vec2(mod(tc.x * 2.0, 1.0));
  tc.x += step(mod(tc.x * 15.0 - length(uv.x), 1.0), 0.5) * mod((uv.x*20.0), 1.0) * 0.1;
  // tc.y -= (1.0-(step(mod(tc.y * 2.0, 0.75), 0.5))) * mod((tc.y*20.0), 1.0) * 0.1;
  tc.y += fract(tc.y* 15.0)*0.1 + length(tc) * 0.05;

  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  
  vec3 cam = texture2D(tex0, tc).xyz;
  // vec3 finalColor = gradientMap(mod(tv.x + time*0.1, 1.0) + cam.x);
  gl_FragColor = vec4(cam, 1.0);
}