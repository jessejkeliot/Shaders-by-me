precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;
uniform sampler2D tex0;

const float ks = 50.0;

const float SRGB_ALPHA = 0.055;

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

vec3 hsb2rgb(vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 rainbowMap(float v){
  return hsb2rgb(vec3(v, 0.89, 0.89));
}


vec3 bloomlap(sampler2D tex, vec2 resolution, vec2 uv){
  vec2 tc = uv;
  tc = 1.0 - tc ;
  vec2 texelSize = 1.0 / resolution;

  vec3 sum = vec3(0.0);
  const vec3 purple = vec3(0.677, 0.12, 0.8611);
  const float kernelSize = ks;
  float divisor = 0.0;
  for(float i=-kernelSize; i<=kernelSize; i+=1.0){
    // for(float j=-kernelSize; j<=kernelSize; j+=5.0){
    sum += texture2D(tex, tc + vec2(i, 0.0) * texelSize).rgb / dot(vec3(1.0), texture2D(tex, tc).rgb)*purple;
    divisor++;
  }
  sum = sum / divisor;
  
  // sum *= vec3(1.8);
  sum += step(texture2D(tex, tc).rgb, vec3(0.5)) - purple;
  // vec3 cam = texture2D(tex0, sum).xyz;
  
  return rainbowMap(length(sum));
}

vec3 bloom(sampler2D tex, vec2 resolution, vec2 uv){
  //blurring
  vec2 tc = uv;
  tc.y = 1.0 - tc.y ;
  vec2 texelSize = 1.0 / resolution;

  vec3 sum = vec3(0.0);

  const float kernelSize = ks;
  for(float i=-kernelSize; i<=kernelSize; i+=1.0){
    vec3 col = texture2D(tex0, tc + vec2(i, 0.0) * texelSize).rgb;
    float brightness = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float onlybright = smoothstep(brightness, 0.8, 1.0);
    sum += vec3(onlybright)*col;
  }
  sum = sum / (kernelSize * 2.0 + 1.0);

  vec3 colour = texture2D(tex0, tc).rgb + sum;

  return colour;
}


vec3 bw(vec3 col){
  float luma = dot(col, vec3(0.2126, 0.7152, 0.0722));
  return vec3(luma);
}

void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  vec3 bloom1 = rainbowMap(length(bloom(tex0, resolution, uv)));

  // vec3 bloomlap = bloomlap(tex0, resolution, uv);
  gl_FragColor = vec4(bloom1, 1.0);
  // gl_FragColor = vec4(bloomlap(tex0, resolution, uv), 1.0);
}