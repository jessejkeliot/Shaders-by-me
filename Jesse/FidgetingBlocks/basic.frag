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

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  float blocks = 5.0;
  vec2 blockID = floor(uv*blocks*1.2);
  vec2 fuv = fract(uv * blocks);
  vec2 offset = vec2(
    random(blockID + floor(time*4.134)),
    uv.y
  );

  vec3 col = texture2D(tex0, offset + vec2((fuv / blocks).x, 0.0)).rgb;
  gl_FragColor = vec4(col, 1.0);
}