precision lowp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;
uniform sampler2D tex0;

const float kernelSize = 10.0;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

vec3 bw(vec3 col){
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  return vec3(luma);
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  // uv = 2.0*uv -1.0;
  // uv = uv * -2.0 - 1.0;
  // uv.x *= aspect;
  uv = 1.0 - uv;
  
  vec3 count = vec3(0);
  float total = 0.;
  for(float i=-kernelSize; i<=kernelSize;i+=1.0){
    for(float j=-kernelSize; j<=kernelSize;j+=1.0){
      vec2 offset = vec2(i / resolution.x, j / resolution.y);

        float dist2 = i*i + j*j;

        // sigma controls blur softness
        float sigma = kernelSize * 0.5;

        float weight = exp(-dist2 / (2.0 * sigma * sigma));

        count += texture2D(tex0, uv + offset).rgb * weight;

        total += weight;
  }
  }
  count /= total;
  // vec3 finalColor = gradientMap(dot(cam, vec3(1.0)));
  // gl_FragColor = vec4(bw(mod(count * (floor(mousePos.x*resolution.x*0.01 + 1.0)), 1.0)), 1.0);
  gl_FragColor = vec4(count, 1.0);
}