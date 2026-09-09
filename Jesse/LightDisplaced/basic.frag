precision highp float;

varying vec2 vUv;

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
  vec4 color = texture2D(tex0, vUv);
  gl_FragColor = color;
}