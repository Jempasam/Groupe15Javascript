import type { Nullable } from "../types";
import { SmartArray } from "../Misc/smartArray";
import { Observable } from "../Misc/observable";
import { Vector2 } from "../Maths/math.vector";
import type { Camera } from "../Cameras/camera";
import type { Effect } from "../Materials/effect";
import "../Shaders/postprocess.vertex";
import type { IInspectable } from "../Misc/iInspectable";
import type { Color4 } from "../Maths/math.color";
import "../Engines/Extensions/engine.renderTarget";
import type { NodeMaterial } from "../Materials/Node/nodeMaterial";
import type { AbstractScene } from "../abstractScene";
import type { RenderTargetWrapper } from "../Engines/renderTargetWrapper";
import { ShaderLanguage } from "../Materials/shaderLanguage";
import type { Scene } from "../scene";
import type { InternalTexture } from "../Materials/Textures/internalTexture";
import type { Animation } from "../Animations/animation";
import type { PrePassRenderer } from "../Rendering/prePassRenderer";
import type { PrePassEffectConfiguration } from "../Rendering/prePassEffectConfiguration";
import type { AbstractEngine } from "../Engines/abstractEngine";
/**
 * Allows for custom processing of the shader code used by a post process
 */
export type PostProcessCustomShaderCodeProcessing = {
    /**
     * If provided, will be called two times with the vertex and fragment code so that this code can be updated after the #include have been processed
     */
    processCodeAfterIncludes?: (postProcessName: string, shaderType: string, code: string) => string;
    /**
     * If provided, will be called two times with the vertex and fragment code so that this code can be updated before it is compiled by the GPU
     */
    processFinalCode?: (postProcessName: string, shaderType: string, code: string) => string;
    /**
     * If provided, will be called before creating the effect to collect additional custom bindings (defines, uniforms, samplers)
     */
    defineCustomBindings?: (postProcessName: string, defines: Nullable<string>, uniforms: string[], samplers: string[]) => Nullable<string>;
    /**
     * If provided, will be called when binding inputs to the shader code to allow the user to add custom bindings
     */
    bindCustomBindings?: (postProcessName: string, effect: Effect) => void;
};
/**
 * Options for the PostProcess constructor
 */
export type PostProcessOptions = {
    /**
     * The width of the texture created for this post process.
     * This parameter (and height) is only used when passing a value for the 5th parameter (options) to the PostProcess constructor function.
     * If you use a PostProcessOptions for the 3rd parameter of the constructor, size is used instead of width and height.
     */
    width?: number;
    /**
     * The height of the texture created for this post process.
     * This parameter (and width) is only used when passing a value for the 5th parameter (options) to the PostProcess constructor function.
     * If you use a PostProcessOptions for the 3rd parameter of the constructor, size is used instead of width and height.
     */
    height?: number;
    /**
     * The list of uniforms used in the shader (if any)
     */
    uniforms?: Nullable<string[]>;
    /**
     * The list of samplers used in the shader (if any)
     */
    samplers?: Nullable<string[]>;
    /**
     * The list of uniform buffers used in the shader (if any)
     */
    uniformBuffers?: Nullable<string[]>;
    /**
     * String of defines that will be set when running the fragment shader. (default: null)
     */
    defines?: Nullable<string>;
    /**
     * The size of the post process texture.
     * It is either a ratio to downscale or upscale the texture create for this post process, or an object containing width and height values.
     * Default: 1
     */
    size?: number | {
        width: number;
        height: number;
    };
    /**
     * The camera that the post process will be attached to (default: null)
     */
    camera?: Nullable<Camera>;
    /**
     * The sampling mode to be used by the shader (default: Constants.TEXTURE_NEAREST_SAMPLINGMODE)
     */
    samplingMode?: number;
    /**
     * The engine to be used to render the post process (default: engine from scene)
     */
    engine?: AbstractEngine;
    /**
     * If the post process can be reused on the same frame. (default: false)
     */
    reusable?: boolean;
    /**
     * Type of the texture created for this post process (default: Constants.TEXTURETYPE_UNSIGNED_INT)
     */
    textureType?: number;
    /**
     * The url of the vertex shader to be used. (default: "postprocess")
     */
    vertexUrl?: string;
    /**
     * The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined)
     * See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     */
    indexParameters?: any;
    /**
     * If the shader should not be compiled immediately. (default: false)
     */
    blockCompilation?: boolean;
    /**
     * Format of the texture created for this post process (default: TEXTUREFORMAT_RGBA)
     */
    textureFormat?: number;
    /**
     * The shader language of the shader. (default: GLSL)
     */
    shaderLanguage?: ShaderLanguage;
};
/**
 * PostProcess can be used to apply a shader to a texture after it has been rendered
 * See https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses
 */
export declare class PostProcess {
    /** @internal */
    _parentContainer: Nullable<AbstractScene>;
    private static _CustomShaderCodeProcessing;
    /**
     * Registers a shader code processing with a post process name.
     * @param postProcessName name of the post process. Use null for the fallback shader code processing. This is the shader code processing that will be used in case no specific shader code processing has been associated to a post process name
     * @param customShaderCodeProcessing shader code processing to associate to the post process name
     */
    static RegisterShaderCodeProcessing(postProcessName: Nullable<string>, customShaderCodeProcessing?: PostProcessCustomShaderCodeProcessing): void;
    private static _GetShaderCodeProcessing;
    /**
     * Gets or sets the unique id of the post process
     */
    uniqueId: number;
    /** Name of the PostProcess. */
    name: string;
    /**
     * Width of the texture to apply the post process on
     */
    width: number;
    /**
     * Height of the texture to apply the post process on
     */
    height: number;
    /**
     * Gets the node material used to create this postprocess (null if the postprocess was manually created)
     */
    nodeMaterialSource: Nullable<NodeMaterial>;
    /**
     * Internal, reference to the location where this postprocess was output to. (Typically the texture on the next postprocess in the chain)
     * @internal
     */
    _outputTexture: Nullable<RenderTargetWrapper>;
    /**
     * Sampling mode used by the shader
     */
    renderTargetSamplingMode: number;
    /**
     * Clear color to use when screen clearing
     */
    clearColor: Color4;
    /**
     * If the buffer needs to be cleared before applying the post process. (default: true)
     * Should be set to false if shader will overwrite all previous pixels.
     */
    autoClear: boolean;
    /**
     * If clearing the buffer should be forced in autoClear mode, even when alpha mode is enabled (default: false).
     * By default, the buffer will only be cleared if alpha mode is disabled (and autoClear is true).
     */
    forceAutoClearInAlphaMode: boolean;
    /**
     * Type of alpha mode to use when performing the post process (default: Engine.ALPHA_DISABLE)
     */
    alphaMode: number;
    /**
     * Sets the setAlphaBlendConstants of the babylon engine
     */
    alphaConstants: Color4;
    /**
     * Animations to be used for the post processing
     */
    animations: Animation[];
    /**
     * Enable Pixel Perfect mode where texture is not scaled to be power of 2.
     * Can only be used on a single postprocess or on the last one of a chain. (default: false)
     */
    enablePixelPerfectMode: boolean;
    /**
     * Force the postprocess to be applied without taking in account viewport
     */
    forceFullscreenViewport: boolean;
    /**
     * List of inspectable custom properties (used by the Inspector)
     * @see https://doc.babylonjs.com/toolsAndResources/inspector#extensibility
     */
    inspectableCustomProperties: IInspectable[];
    /**
     * Scale mode for the post process (default: Engine.SCALEMODE_FLOOR)
     *
     * | Value | Type                                | Description |
     * | ----- | ----------------------------------- | ----------- |
     * | 1     | SCALEMODE_FLOOR                     | [engine.scalemode_floor](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_floor) |
     * | 2     | SCALEMODE_NEAREST                   | [engine.scalemode_nearest](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_nearest) |
     * | 3     | SCALEMODE_CEILING                   | [engine.scalemode_ceiling](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_ceiling) |
     *
     */
    scaleMode: number;
    /**
     * Force textures to be a power of two (default: false)
     */
    alwaysForcePOT: boolean;
    private _samples;
    /**
     * Number of sample textures (default: 1)
     */
    get samples(): number;
    set samples(n: number);
    /**
     * Modify the scale of the post process to be the same as the viewport (default: false)
     */
    adaptScaleToCurrentViewport: boolean;
    private _camera;
    protected _scene: Scene;
    private _engine;
    private _options;
    private _reusable;
    private _renderId;
    private _textureType;
    private _textureFormat;
    private _shaderLanguage;
    /**
     * if externalTextureSamplerBinding is true, the "apply" method won't bind the textureSampler texture, it is expected to be done by the "outside" (by the onApplyObservable observer most probably).
     * counter-productive in some cases because if the texture bound by "apply" is different from the currently texture bound, (the one set by the onApplyObservable observer, for eg) some
     * internal structures (materialContext) will be dirtified, which may impact performances
     */
    externalTextureSamplerBinding: boolean;
    /**
     * Smart array of input and output textures for the post process.
     * @internal
     */
    _textures: SmartArray<RenderTargetWrapper>;
    /**
     * Smart array of input and output textures for the post process.
     * @internal
     */
    private _textureCache;
    /**
     * The index in _textures that corresponds to the output texture.
     * @internal
     */
    _currentRenderTextureInd: number;
    private _drawWrapper;
    private _samplers;
    private _fragmentUrl;
    private _vertexUrl;
    private _parameters;
    private _uniformBuffers;
    protected _postProcessDefines: Nullable<string>;
    private _scaleRatio;
    protected _indexParameters: any;
    private _shareOutputWithPostProcess;
    private _texelSize;
    /** @internal */
    _forcedOutputTexture: Nullable<RenderTargetWrapper>;
    /**
     * Prepass configuration in case this post process needs a texture from prepass
     * @internal
     */
    _prePassEffectConfiguration: PrePassEffectConfiguration;
    /**
     * Returns the fragment url or shader name used in the post process.
     * @returns the fragment url or name in the shader store.
     */
    getEffectName(): string;
    /**
     * An event triggered when the postprocess is activated.
     */
    onActivateObservable: Observable<Camera>;
    private _onActivateObserver;
    /**
     * A function that is added to the onActivateObservable
     */
    set onActivate(callback: Nullable<(camera: Camera) => void>);
    /**
     * An event triggered when the postprocess changes its size.
     */
    onSizeChangedObservable: Observable<PostProcess>;
    private _onSizeChangedObserver;
    /**
     * A function that is added to the onSizeChangedObservable
     */
    set onSizeChanged(callback: (postProcess: PostProcess) => void);
    /**
     * An event triggered when the postprocess applies its effect.
     */
    onApplyObservable: Observable<Effect>;
    private _onApplyObserver;
    /**
     * A function that is added to the onApplyObservable
     */
    set onApply(callback: (effect: Effect) => void);
    /**
     * An event triggered before rendering the postprocess
     */
    onBeforeRenderObservable: Observable<Effect>;
    private _onBeforeRenderObserver;
    /**
     * A function that is added to the onBeforeRenderObservable
     */
    set onBeforeRender(callback: (effect: Effect) => void);
    /**
     * An event triggered after rendering the postprocess
     */
    onAfterRenderObservable: Observable<Effect>;
    private _onAfterRenderObserver;
    /**
     * A function that is added to the onAfterRenderObservable
     */
    set onAfterRender(callback: (efect: Effect) => void);
    /**
     * The input texture for this post process and the output texture of the previous post process. When added to a pipeline the previous post process will
     * render it's output into this texture and this texture will be used as textureSampler in the fragment shader of this post process.
     */
    get inputTexture(): RenderTargetWrapper;
    set inputTexture(value: RenderTargetWrapper);
    /**
     * Since inputTexture should always be defined, if we previously manually set `inputTexture`,
     * the only way to unset it is to use this function to restore its internal state
     */
    restoreDefaultInputTexture(): void;
    /**
     * Gets the camera which post process is applied to.
     * @returns The camera the post process is applied to.
     */
    getCamera(): Camera;
    /**
     * Gets the texel size of the postprocess.
     * See https://en.wikipedia.org/wiki/Texel_(graphics)
     */
    get texelSize(): Vector2;
    /**
     * Creates a new instance PostProcess
     * @param name The name of the PostProcess.
     * @param fragmentUrl The url of the fragment shader to be used.
     * @param options The options to be used when constructing the post process.
     */
    constructor(name: string, fragmentUrl: string, options?: PostProcessOptions);
    /**
     * Creates a new instance PostProcess
     * @param name The name of the PostProcess.
     * @param fragmentUrl The url of the fragment shader to be used.
     * @param parameters Array of the names of uniform non-sampler2D variables that will be passed to the shader.
     * @param samplers Array of the names of uniform sampler2D variables that will be passed to the shader.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param defines String of defines that will be set when running the fragment shader. (default: null)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param vertexUrl The url of the vertex shader to be used. (default: "postprocess")
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param blockCompilation If the shader should not be compiled immediatly. (default: false)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     * @param shaderLanguage The shader language of the shader. (default: GLSL)
     */
    constructor(name: string, fragmentUrl: string, parameters: Nullable<string[]>, samplers: Nullable<string[]>, options: number | PostProcessOptions, camera: Nullable<Camera>, samplingMode?: number, engine?: AbstractEngine, reusable?: boolean, defines?: Nullable<string>, textureType?: number, vertexUrl?: string, indexParameters?: any, blockCompilation?: boolean, textureFormat?: number, shaderLanguage?: ShaderLanguage);
    /**
     * Gets a string identifying the name of the class
     * @returns "PostProcess" string
     */
    getClassName(): string;
    /**
     * Gets the engine which this post process belongs to.
     * @returns The engine the post process was enabled with.
     */
    getEngine(): AbstractEngine;
    /**
     * The effect that is created when initializing the post process.
     * @returns The created effect corresponding the postprocess.
     */
    getEffect(): Effect;
    /**
     * To avoid multiple redundant textures for multiple post process, the output the output texture for this post process can be shared with another.
     * @param postProcess The post process to share the output with.
     * @returns This post process.
     */
    shareOutputWith(postProcess: PostProcess): PostProcess;
    /**
     * Reverses the effect of calling shareOutputWith and returns the post process back to its original state.
     * This should be called if the post process that shares output with this post process is disabled/disposed.
     */
    useOwnOutput(): void;
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     * @param vertexUrl The url of the vertex shader to be used (default: the one given at construction time)
     * @param fragmentUrl The url of the fragment shader to be used (default: the one given at construction time)
     */
    updateEffect(defines?: Nullable<string>, uniforms?: Nullable<string[]>, samplers?: Nullable<string[]>, indexParameters?: any, onCompiled?: (effect: Effect) => void, onError?: (effect: Effect, errors: string) => void, vertexUrl?: string, fragmentUrl?: string): void;
    /**
     * The post process is reusable if it can be used multiple times within one frame.
     * @returns If the post process is reusable
     */
    isReusable(): boolean;
    /** invalidate frameBuffer to hint the postprocess to create a depth buffer */
    markTextureDirty(): void;
    private _createRenderTargetTexture;
    private _flushTextureCache;
    /**
     * Resizes the post-process texture
     * @param width Width of the texture
     * @param height Height of the texture
     * @param camera The camera this post-process is applied to. Pass null if the post-process is used outside the context of a camera post-process chain (default: null)
     * @param needMipMaps True if mip maps need to be generated after render (default: false)
     * @param forceDepthStencil True to force post-process texture creation with stencil depth and buffer (default: false)
     */
    resize(width: number, height: number, camera?: Nullable<Camera>, needMipMaps?: boolean, forceDepthStencil?: boolean): void;
    private _getTarget;
    /**
     * Activates the post process by intializing the textures to be used when executed. Notifies onActivateObservable.
     * When this post process is used in a pipeline, this is call will bind the input texture of this post process to the output of the previous.
     * @param camera The camera that will be used in the post process. This camera will be used when calling onActivateObservable.
     * @param sourceTexture The source texture to be inspected to get the width and height if not specified in the post process constructor. (default: null)
     * @param forceDepthStencil If true, a depth and stencil buffer will be generated. (default: false)
     * @returns The render target wrapper that was bound to be written to.
     */
    activate(camera: Nullable<Camera>, sourceTexture?: Nullable<InternalTexture>, forceDepthStencil?: boolean): RenderTargetWrapper;
    /**
     * If the post process is supported.
     */
    get isSupported(): boolean;
    /**
     * The aspect ratio of the output texture.
     */
    get aspectRatio(): number;
    /**
     * Get a value indicating if the post-process is ready to be used
     * @returns true if the post-process is ready (shader is compiled)
     */
    isReady(): boolean;
    /**
     * Binds all textures and uniforms to the shader, this will be run on every pass.
     * @returns the effect corresponding to this post process. Null if not compiled or not ready.
     */
    apply(): Nullable<Effect>;
    private _disposeTextures;
    private _disposeTextureCache;
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup.
     * @returns true if the pre pass is needed.
     */
    setPrePassRenderer(prePassRenderer: PrePassRenderer): boolean;
    /**
     * Disposes the post process.
     * @param camera The camera to dispose the post process on.
     */
    dispose(camera?: Camera): void;
    /**
     * Serializes the post process to a JSON object
     * @returns the JSON object
     */
    serialize(): any;
    /**
     * Clones this post process
     * @returns a new post process similar to this one
     */
    clone(): Nullable<PostProcess>;
    /**
     * Creates a material from parsed material data
     * @param parsedPostProcess defines parsed post process data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures
     * @returns a new post process
     */
    static Parse(parsedPostProcess: any, scene: Scene, rootUrl: string): Nullable<PostProcess>;
    /**
     * @internal
     */
    static _Parse(parsedPostProcess: any, targetCamera: Camera, scene: Scene, rootUrl: string): Nullable<PostProcess>;
}
