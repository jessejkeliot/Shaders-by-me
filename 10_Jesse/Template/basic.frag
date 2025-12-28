precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  
  vec3 finalColor = vec3(0);
  gl_FragColor = vec4(finalColor, 1.0);
}