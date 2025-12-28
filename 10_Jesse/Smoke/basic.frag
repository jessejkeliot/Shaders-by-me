precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;
uniform sampler2D tex0;
uniform sampler2D tex1;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}
float squares = 20.0;
float squares2 = 50.0;
void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  vec2 tile = floor(uv * squares) / squares;
  vec2 tile2 = floor(uv * squares2) / squares2;
  vec3 col = texture2D(tex0, tile).rgb;
  float brightness = (col.r + col.g + col.b) / 3.0;
  if(brightness > 0.5){
    col = (texture2D(tex1, tile2).rgb * vec3(-0.5) + 1.0) * col;
  }
  gl_FragColor = vec4(col, 1.0);
}