import type { Nullable } from "../../types";
import type { Camera } from "../../Cameras/camera";
import type { PostProcess } from "../postProcess";
import type { AbstractEngine } from "../../Engines/abstractEngine";
/**
 * This represents a set of one or more post processes in Babylon.
 * A post process can be used to apply a shader to a texture after it is rendered.
 * @example https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/postProcessRenderPipeline
 */
export declare class PostProcessRenderEffect {
    private _postProcesses;
    private _getPostProcesses;
    private _singleInstance;
    private _cameras;
    private _indicesForCamera;
    /**
     * Name of the effect
     * @internal
     */
    _name: string;
    /**
     * Instantiates a post process render effect.
     * A post process can be used to apply a shader to a texture after it is rendered.
     * @param engine The engine the effect is tied to
     * @param name The name of the effect
     * @param getPostProcesses A function that returns a set of post processes which the effect will run in order to be run.
     * @param singleInstance False if this post process can be run on multiple cameras. (default: true)
     */
    constructor(engine: AbstractEngine, name: string, getPostProcesses: () => Nullable<PostProcess | Array<PostProcess>>, singleInstance?: boolean);
    /**
     * Checks if all the post processes in the effect are supported.
     */
    get isSupported(): boolean;
    /**
     * Updates the current state of the effect
     * @internal
     */
    _update(): void;
    /**
     * Attaches the effect on cameras
     * @param cameras The camera to attach to.
     * @internal
     */
    _attachCameras(cameras: Camera): void;
    /**
     * Attaches the effect on cameras
     * @param cameras The camera to attach to.
     * @internal
     */
    _attachCameras(cameras: Camera[]): void;
    /**
     * Detaches the effect on cameras
     * @param cameras The camera to detach from.
     * @internal
     */
    _detachCameras(cameras: Camera): void;
    /**
     * Detaches the effect on cameras
     * @param cameras The camera to detach from.
     * @internal
     */
    _detachCameras(cameras: Camera[]): void;
    /**
     * Enables the effect on given cameras
     * @param cameras The camera to enable.
     * @internal
     */
    _enable(cameras: Camera): void;
    /**
     * Enables the effect on given cameras
     * @param cameras The camera to enable.
     * @internal
     */
    _enable(cameras: Nullable<Camera[]>): void;
    /**
     * Disables the effect on the given cameras
     * @param cameras The camera to disable.
     * @internal
     */
    _disable(cameras: Camera): void;
    /**
     * Disables the effect on the given cameras
     * @param cameras The camera to disable.
     * @internal
     */
    _disable(cameras: Nullable<Camera[]>): void;
    /**
     * Gets a list of the post processes contained in the effect.
     * @param camera The camera to get the post processes on.
     * @returns The list of the post processes in the effect.
     */
    getPostProcesses(camera?: Camera): Nullable<Array<PostProcess>>;
}
