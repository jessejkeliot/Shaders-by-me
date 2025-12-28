precision highp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform float time;
uniform sampler2D palette;
uniform vec2 mousePos;


float dot2( vec2 v ) { return dot(v,v); }
float sdHeart(vec2 p )
{
    p.x = abs(p.x);

    if( p.y+p.x>1.0 ){
      return sqrt(dot2(p-vec2(0.25,0.75))) - sqrt(2.0)/4.0;}

      return sqrt(min(dot2(p-vec2(0.00,1.00)), dot2(p-0.5*max(p.x+p.y,0.0)))) * sign(p.x-p.y);
}

vec3 gradientMap(float v){
  v = mod(v, 1.0);
  return texture2D(palette, vec2(v, 0.5)).rgb;
}

float n = 0.5;
void main() {
  float aspect = resolution.x / resolution.y;
  vec2 uv = vTexCoord;
  uv = uv * 2.0 - 1.0;
  uv.x *= aspect;
  vec2 uv0 = uv;
  vec3 finalColor = vec3(0);
  for(float i=1.0; i<=4.0; i++){
    uv = fract(uv * n* i);
    uv -= 0.5;
    float colourHeart = sdHeart(fract(uv0*n) + vec2(0.0, 0.5));
    float offlength = length(uv0/n * abs(cos(time /16.0)));
    float uvoff = length(uv0/n * (sin(time /4.0)*0.25 + 0.4));
    float d0 = fract(mix(offlength, length(uv0/2.0 * (cos(time /3.0))), 0.3) * n * 10. * i);
    // uv += uvoff/3.0;
    float osc1 = (0.1 * sin(time * 2.0 - d0* 2.0) +0.5);
    float d = sdHeart(uv/osc1 + vec2(0.0, 0.5));
    // d = smoothstep(d, 0.1, 0.2);
    d = abs(d);
    d = 0.1/d;
    d = min(4.0, d);
    float mixosc = 0.5 * sin(time * 2.0) + 0.5;
    float dc = length(uv*0.4);
    dc = 0.5 * d0;
    dc = abs(dc);
    dc = 0.1/dc;
    dc += (0.5*sin(time) + 0.7)/1.2;
    float oc = mix(d, dc, 0.1);
    oc = dot(d,2.0/dc);
    oc = smoothstep(0.7, 0.8, oc);


    d = distance(uv, vec2(0));
    // d*=2.0;
    
    vec3 blood = vec3(1.0, 0.05, 0.15);
    vec3 temp = oc * blood / d/5.0;
    temp *= osc1 * vec3(1.3, 0.3, 2.);
    finalColor = finalColor + smoothstep(0.2, 0.7, temp) * temp;
  }
  gl_FragColor = vec4(finalColor, 1.0);
}