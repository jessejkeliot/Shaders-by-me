precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;
uniform sampler2D tex0;

const float cuts = 10.0;

float brightness(vec3 col){
  return dot(vec3(1.0), col);
}

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 slidingbasic(vec2 uv){
  float alternate = step(fract(uv.y*cuts
), 0.5) - 0.5;
  float ymoving = abs(fract(uv.x + time*alternate));
  vec3 col = texture2D(tex0, vec2(ymoving, uv.y)).rgb;
  return col;
}
vec3 slidebothdir(vec2 uv){
  float alternatex = step(fract(uv.x*cuts
), 0.5) - 0.5;
  float alternatey = (step(fract(uv.y*cuts
), 0.5) - 0.5) * -1.0;
  float xmoving = abs(fract(uv.x + time*alternatey));
  float ymoving = abs(fract(uv.y - time*alternatex));
  vec3 col = texture2D(tex0, vec2(xmoving, ymoving)).rgb;
  return col;
}
vec3 slidebothdir2(vec2 uv){
  vec2 uvn = 2.0*(uv - 0.5);
  float alternatex = step(fract(uv.x*cuts
), 0.5) - 0.5;
  float alternatey = (step(fract(uv.y*cuts
), 0.5) - 0.5) * -1.0;
  float xmoving = abs(fract(uv.x + time*alternatey*length(uvn)));
  float ymoving = abs(fract(uv.y + time*alternatex*2.0*length(uvn)));
  vec3 col = texture2D(tex0, vec2(xmoving, ymoving)).rgb;
  return col;
}
vec3 slidingWeirder(vec2 uv){
  float yvaluefloored = (floor(uv.y*cuts
) + 1.0) / (cuts
+1.0);
  float alternate = step(fract(uv.y*cuts
), 0.5) - 0.5;
  float ymoving = abs(fract(uv.x + time*alternate*yvaluefloored));
  vec3 col = texture2D(tex0, vec2(ymoving, uv.y)).rgb;
  return col;
}

vec3 slidebothdir3(vec2 uv){
  float alternatex = step(fract(uv.x*cuts
), 0.5) - 0.5;
  float alternatey = (step(fract(uv.y*cuts + time
), 0.5) - 0.5) * -1.0;
  float xmoving = abs(fract(uv.x + time*alternatey));
  float ymoving = abs(fract(uv.y + time*alternatex + alternatey));
  vec3 col = texture2D(tex0, vec2(xmoving, ymoving)).rgb;
  return col;
}

vec3 messupCols(vec3 col){
  return abs(gradientMap(brightness(gradientMap(col.y))) - gradientMap(brightness(gradientMap(col.z *1.5))));
}
vec3 saturate(vec3 col) {
  return col * vec3(1.5);
}

void main() {
  vec2 uv = vTexCoord;
  float aspect = resolution.x / resolution.y;
  uv.y = 1.0 - uv.y;
  uv.x *= aspect;
  vec3 col = slidebothdir2(uv);
  gl_FragColor = vec4( saturate(col), 1.0);
}