// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "layerPixelShader";
const shader = `varying vec2 vUV;uniform sampler2D textureSampler;uniform vec4 color;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 baseColor=texture2D(textureSampler,vUV);
#ifdef LINEAR
baseColor.rgb=toGammaSpace(baseColor.rgb);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4)
discard;
#endif
gl_FragColor=baseColor*color;
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const layerPixelShader = { name, shader };
//# sourceMappingURL=layer.fragment.js.map