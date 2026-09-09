precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;

float n = 1.0;

vec3 getColourFromPalette(float v){
  v = smoothstep(0.0, 1.0, v);
  vec3 a = vec3(0.610, 0.498, 0.650);
  vec3 b = vec3(0.0, 0.393, 0.89);
  vec3 c = vec3(1.0, 0.11, 0.98);
  return mix(a, mix(b, c, v), v);
}

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  vec3 finalColor = vec3(0);
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  vec2 uv0 = uv;
  float d0 = length(uv);
  float freq = 2.0;
  float d = 0.0;
  for(float i=1.0; i <= 2.0; i++){
    uv = fract(uv * i * n);
    uv -= 0.5;
    // uv += 0.5 * (i-1.0);
    d = length(uv);
    d += distance(vec2(0.5, 0.5), mousePos);
    // d = step(0.2, d);
    vec3 col = gradientMap(d);
    d = sin(d * freq * i - (0.5*sin(time) +0.9) * length(uv0));
    d = abs(d);
    d = (0.5*sin(time) + 0.7)/d;
    // d = exp(d) / 30.0;
    
    col *= d;
    finalColor += col;
  }
  // d = smoothstep(0.2, 0.24, d);
  // d*= -1;
  float alpha = 0.95/d0;
  // alpha = smoothstep(0.1, 0.4, alpha);

  // assign redColor to be output to the screen
  gl_FragColor = vec4(finalColor, alpha);
}