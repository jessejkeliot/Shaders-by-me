precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform float zoom;
uniform vec2 viewOffset;
uniform sampler2D palette;
uniform vec2 mousePos;

vec2 cx_mul(vec2 a, vec2 b){
  return vec2(a.x * b.x - a.y* b.y, (a.x*b.y + b.x*a.y));
}

float cx_modulus(vec2 c){
  return sqrt(c.x*c.x + c.y*c.y);
}

float julia(vec2 z, vec2 c, float R){
  int iteration = 0;
  vec2 uv = z;
  float ibe = 0.0;
  for(int iteration=maxIterations; iteration>0; iteration--){
    
      float xtemp = (uv.x * uv.x) - (uv.y * uv.y);
      uv.y = xtemp + c.x;
      if(uv.x * uv.x + uv.y + uv.y >= pow(R, 2.0)){
        ibe= float(iteration);
        break;
      }
  }


  if(uv.x * uv.x + uv.y + uv.y < pow(R, 2.0)){
    return 1.0;
  }
  else
  {
    return float(iteration);
  }
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  uv.x -= sqrt(2.0) /2.0;
  uv*= zoom;
  uv/=0.85;
  // uv*=(1.0 - log(time/10.0));
  // vec3 finalColor = log(mandelbrot(uv)* 5.0) * vec3(0.9, 0.21, 1.8);
  vec3 finalColor = vec3(julia(uv, mousePos));
  gl_FragColor = vec4(finalColor, 1.0);
}