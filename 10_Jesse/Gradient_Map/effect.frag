precision mediump float;

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our textures coming from p5
uniform sampler2D tex0;
uniform vec2 resolution;
uniform sampler2D palette;

// vec3 colours[6] = vec3[6](vec3(0.235,0.153,0.549), vec3(0.188,0.125,0.125), vec3(0.992,0.847,0.4), vec3(0.376,0.427,0.392), vec3(0.902,0.2,0.286), vec3(0.012,0.714,0.871));

vec3 gradientMap(float v){
  v = clamp(v, 0.0, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

float getNaiveLuminance(vec3 c){
  return (c.r + c.g + c.b) / 3.0;
}

void main() {
  float aspect = resolution.x / resolution.y; //calculating the aspect ratio
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;
  // uv.x = mod(uv.x * aspect, 1.0/aspect);
  // gl_FragColor = texture2D(tex0, tile3);
  // gl_FragColor = texture2D(tile + tile2);
  vec3 col = texture2D(tex0, uv).rgb;
  float luminance = getNaiveLuminance(col);
  vec3 mapped = gradientMap(luminance);
  gl_FragColor = vec4(mapped, 1.0);
}