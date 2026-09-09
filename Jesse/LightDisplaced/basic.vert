// this is an attribute sent to the shader by p5 
// it contains all of our vertex position information
// attribute signals that this is a global variable sent by the sketch
// it is read only, meaning it cannot be changed directly (you can copy it though)
// attributes exist in vertex shaders only

precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;

varying vec2 vUv;

uniform sampler2D tex0;
uniform float displacementScale;

// all shaders have one main function
// the vertex shader requires there to be a vec4 output called gl_Position
void main() {
   
  // copy the position data into a vec4, using 1.0 as the w component
  vUv = aTexCoord;
  vec4 color = texture2D(tex0, vec2(vUv.x, 1.0-vUv.y));

  float brightness = (color.r * 0.2126) + (color.g * 0.7152) + (color.b * 0.0722);
  vec3 newPosition = aPosition;

  newPosition.z += brightness * displacementScale;
  // positionVec4.xy = positionVec4.xy * positionVec4.xy * 0.5 + 0.5;

  // send the vertex information on to the fragment shader
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix* vec4(newPosition, 1.0);
}