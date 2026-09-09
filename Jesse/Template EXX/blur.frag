precision lowp float;

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform sampler2D tex0;

const float kernelSize = 10.0;
void main(){
    vec2 uv = vTexCoord;
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

    gl_FragColor = vec4(count, 1.0);
}