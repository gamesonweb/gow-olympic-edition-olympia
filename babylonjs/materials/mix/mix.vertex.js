// Do not edit.
import { ShaderStore } from "../../core/Engines/shaderStore.js";
import "../../core/Shaders/ShadersInclude/bonesDeclaration.js";
import "../../core/Shaders/ShadersInclude/bakedVertexAnimationDeclaration.js";
import "../../core/Shaders/ShadersInclude/instancesDeclaration.js";
import "../../core/Shaders/ShadersInclude/clipPlaneVertexDeclaration.js";
import "../../core/Shaders/ShadersInclude/logDepthDeclaration.js";
import "../../core/Shaders/ShadersInclude/fogVertexDeclaration.js";
import "../../core/Shaders/ShadersInclude/lightFragmentDeclaration.js";
import "../../core/Shaders/ShadersInclude/lightUboDeclaration.js";
import "../../core/Shaders/ShadersInclude/instancesVertex.js";
import "../../core/Shaders/ShadersInclude/bonesVertex.js";
import "../../core/Shaders/ShadersInclude/bakedVertexAnimation.js";
import "../../core/Shaders/ShadersInclude/clipPlaneVertex.js";
import "../../core/Shaders/ShadersInclude/fogVertex.js";
import "../../core/Shaders/ShadersInclude/shadowsVertex.js";
import "../../core/Shaders/ShadersInclude/vertexColorMixing.js";
import "../../core/Shaders/ShadersInclude/logDepthVertex.js";
const name = "mixVertexShader";
const shader = `precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform mat4 view;uniform mat4 viewProjection;
#ifdef DIFFUSE
varying vec2 vTextureUV;uniform mat4 textureMatrix;uniform vec2 vTextureInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vTextureInfos.x==0.)
{vTextureUV=vec2(textureMatrix*vec4(uv,1.0,0.0));}
else
{vTextureUV=vec2(textureMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const mixVertexShader = { name, shader };
//# sourceMappingURL=mix.vertex.js.map