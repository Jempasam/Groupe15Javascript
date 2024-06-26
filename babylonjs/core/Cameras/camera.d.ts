import { SmartArray } from "../Misc/smartArray";
import { Observable } from "../Misc/observable";
import type { DeepImmutable, Nullable } from "../types";
import type { CameraInputsManager } from "./cameraInputsManager";
import type { Scene } from "../scene";
import { Matrix, Vector3, Quaternion } from "../Maths/math.vector";
import { Node } from "../node";
import type { Mesh } from "../Meshes/mesh";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { ICullable } from "../Culling/boundingInfo";
import { Viewport } from "../Maths/math.viewport";
import type { PostProcess } from "../PostProcesses/postProcess";
import type { RenderTargetTexture } from "../Materials/Textures/renderTargetTexture";
import type { FreeCamera } from "./freeCamera";
import type { Ray } from "../Culling/ray";
/**
 * Oblique projection values
 */
export interface IObliqueParams {
    /** The angle of the plane */
    angle: number;
    /** The length of the plane */
    length: number;
    /** The offset of the plane */
    offset: number;
}
/**
 * This is the base class of all the camera used in the application.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
 */
export declare class Camera extends Node {
    /**
     * @internal
     */
    static _CreateDefaultParsedCamera: (name: string, scene: Scene) => Camera;
    /**
     * This is the default projection mode used by the cameras.
     * It helps recreating a feeling of perspective and better appreciate depth.
     * This is the best way to simulate real life cameras.
     */
    static readonly PERSPECTIVE_CAMERA = 0;
    /**
     * This helps creating camera with an orthographic mode.
     * Orthographic is commonly used in engineering as a means to produce object specifications that communicate dimensions unambiguously, each line of 1 unit length (cm, meter..whatever) will appear to have the same length everywhere on the drawing. This allows the drafter to dimension only a subset of lines and let the reader know that other lines of that length on the drawing are also that length in reality. Every parallel line in the drawing is also parallel in the object.
     */
    static readonly ORTHOGRAPHIC_CAMERA = 1;
    /**
     * This is the default FOV mode for perspective cameras.
     * This setting aligns the upper and lower bounds of the viewport to the upper and lower bounds of the camera frustum.
     */
    static readonly FOVMODE_VERTICAL_FIXED = 0;
    /**
     * This setting aligns the left and right bounds of the viewport to the left and right bounds of the camera frustum.
     */
    static readonly FOVMODE_HORIZONTAL_FIXED = 1;
    /**
     * This specifies there is no need for a camera rig.
     * Basically only one eye is rendered corresponding to the camera.
     */
    static readonly RIG_MODE_NONE = 0;
    /**
     * Simulates a camera Rig with one blue eye and one red eye.
     * This can be use with 3d blue and red glasses.
     */
    static readonly RIG_MODE_STEREOSCOPIC_ANAGLYPH = 10;
    /**
     * Defines that both eyes of the camera will be rendered side by side with a parallel target.
     */
    static readonly RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL = 11;
    /**
     * Defines that both eyes of the camera will be rendered side by side with a none parallel target.
     */
    static readonly RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED = 12;
    /**
     * Defines that both eyes of the camera will be rendered over under each other.
     */
    static readonly RIG_MODE_STEREOSCOPIC_OVERUNDER = 13;
    /**
     * Defines that both eyes of the camera will be rendered on successive lines interlaced for passive 3d monitors.
     */
    static readonly RIG_MODE_STEREOSCOPIC_INTERLACED = 14;
    /**
     * Defines that both eyes of the camera should be renderered in a VR mode (carbox).
     */
    static readonly RIG_MODE_VR = 20;
    /**
     * Custom rig mode allowing rig cameras to be populated manually with any number of cameras
     */
    static readonly RIG_MODE_CUSTOM = 22;
    /**
     * Defines if by default attaching controls should prevent the default javascript event to continue.
     */
    static ForceAttachControlToAlwaysPreventDefault: boolean;
    /**
     * Define the input manager associated with the camera.
     */
    inputs: CameraInputsManager<Camera>;
    /** @internal */
    _position: Vector3;
    /**
     * Define the current local position of the camera in the scene
     */
    get position(): Vector3;
    set position(newPosition: Vector3);
    protected _upVector: Vector3;
    /**
     * The vector the camera should consider as up.
     * (default is Vector3(0, 1, 0) aka Vector3.Up())
     */
    set upVector(vec: Vector3);
    get upVector(): Vector3;
    /**
     * Object containing oblique projection values (only used with ORTHOGRAPHIC_CAMERA)
     */
    oblique: Nullable<IObliqueParams>;
    /**
     * The screen area in scene units squared
     */
    get screenArea(): number;
    private _orthoLeft;
    /**
     * Define the current limit on the left side for an orthographic camera
     * In scene unit
     */
    set orthoLeft(value: Nullable<number>);
    get orthoLeft(): Nullable<number>;
    private _orthoRight;
    /**
     * Define the current limit on the right side for an orthographic camera
     * In scene unit
     */
    set orthoRight(value: Nullable<number>);
    get orthoRight(): Nullable<number>;
    private _orthoBottom;
    /**
     * Define the current limit on the bottom side for an orthographic camera
     * In scene unit
     */
    set orthoBottom(value: Nullable<number>);
    get orthoBottom(): Nullable<number>;
    private _orthoTop;
    /**
     * Define the current limit on the top side for an orthographic camera
     * In scene unit
     */
    set orthoTop(value: Nullable<number>);
    get orthoTop(): Nullable<number>;
    /**
     * Field Of View is set in Radians. (default is 0.8)
     */
    fov: number;
    /**
     * Projection plane tilt around the X axis (horizontal), set in Radians. (default is 0)
     * Can be used to make vertical lines in world space actually vertical on the screen.
     * See https://forum.babylonjs.com/t/add-vertical-shift-to-3ds-max-exporter-babylon-cameras/17480
     */
    projectionPlaneTilt: number;
    /**
     * Define the minimum distance the camera can see from.
     * This is important to note that the depth buffer are not infinite and the closer it starts
     * the more your scene might encounter depth fighting issue.
     */
    minZ: number;
    /**
     * Define the maximum distance the camera can see to.
     * This is important to note that the depth buffer are not infinite and the further it end
     * the more your scene might encounter depth fighting issue.
     */
    maxZ: number;
    /**
     * Define the default inertia of the camera.
     * This helps giving a smooth feeling to the camera movement.
     */
    inertia: number;
    private _mode;
    /**
     * Define the mode of the camera (Camera.PERSPECTIVE_CAMERA or Camera.ORTHOGRAPHIC_CAMERA)
     */
    set mode(mode: number);
    get mode(): number;
    /**
     * Define whether the camera is intermediate.
     * This is useful to not present the output directly to the screen in case of rig without post process for instance
     */
    isIntermediate: boolean;
    /**
     * Define the viewport of the camera.
     * This correspond to the portion of the screen the camera will render to in normalized 0 to 1 unit.
     */
    viewport: Viewport;
    /**
     * Restricts the camera to viewing objects with the same layerMask.
     * A camera with a layerMask of 1 will render mesh.layerMask & camera.layerMask!== 0
     */
    layerMask: number;
    /**
     * fovMode sets the camera frustum bounds to the viewport bounds. (default is FOVMODE_VERTICAL_FIXED)
     */
    fovMode: number;
    /**
     * Rig mode of the camera.
     * This is useful to create the camera with two "eyes" instead of one to create VR or stereoscopic scenes.
     * This is normally controlled byt the camera themselves as internal use.
     */
    cameraRigMode: number;
    /**
     * Defines the distance between both "eyes" in case of a RIG
     */
    interaxialDistance: number;
    /**
     * Defines if stereoscopic rendering is done side by side or over under.
     */
    isStereoscopicSideBySide: boolean;
    /**
     * Defines the list of custom render target which are rendered to and then used as the input to this camera's render. Eg. display another camera view on a TV in the main scene
     * This is pretty helpful if you wish to make a camera render to a texture you could reuse somewhere
     * else in the scene. (Eg. security camera)
     *
     * To change the final output target of the camera, camera.outputRenderTarget should be used instead (eg. webXR renders to a render target corresponding to an HMD)
     */
    customRenderTargets: RenderTargetTexture[];
    /**
     * When set, the camera will render to this render target instead of the default canvas
     *
     * If the desire is to use the output of a camera as a texture in the scene consider using camera.customRenderTargets instead
     */
    outputRenderTarget: Nullable<RenderTargetTexture>;
    /**
     * Observable triggered when the camera view matrix has changed.
     */
    onViewMatrixChangedObservable: Observable<Camera>;
    /**
     * Observable triggered when the camera Projection matrix has changed.
     */
    onProjectionMatrixChangedObservable: Observable<Camera>;
    /**
     * Observable triggered when the inputs have been processed.
     */
    onAfterCheckInputsObservable: Observable<Camera>;
    /**
     * Observable triggered when reset has been called and applied to the camera.
     */
    onRestoreStateObservable: Observable<Camera>;
    /**
     * Is this camera a part of a rig system?
     */
    isRigCamera: boolean;
    /**
     * If isRigCamera set to true this will be set with the parent camera.
     * The parent camera is not (!) necessarily the .parent of this camera (like in the case of XR)
     */
    rigParent?: Camera;
    /**
     * Render pass id used by the camera to render into the main framebuffer
     */
    renderPassId: number;
    private _hasMoved;
    /**
     * Gets a flag indicating that the camera has moved in some way since the last call to Camera.update()
     */
    get hasMoved(): boolean;
    /** @internal */
    _cameraRigParams: any;
    /** @internal */
    _rigCameras: Camera[];
    /** @internal */
    _rigPostProcess: Nullable<PostProcess>;
    /** @internal */
    _skipRendering: boolean;
    /** @internal */
    _projectionMatrix: Matrix;
    /** @internal */
    _postProcesses: Nullable<PostProcess>[];
    /** @internal */
    _activeMeshes: SmartArray<AbstractMesh>;
    protected _globalPosition: Vector3;
    /** @internal */
    _computedViewMatrix: Matrix;
    private _doNotComputeProjectionMatrix;
    private _transformMatrix;
    private _frustumPlanes;
    private _refreshFrustumPlanes;
    private _storedFov;
    private _stateStored;
    private _absoluteRotation;
    /**
     * Instantiates a new camera object.
     * This should not be used directly but through the inherited cameras: ArcRotate, Free...
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
     * @param name Defines the name of the camera in the scene
     * @param position Defines the position of the camera
     * @param scene Defines the scene the camera belongs too
     * @param setActiveOnSceneIfNoneActive Defines if the camera should be set as active after creation if no other camera have been defined in the scene
     */
    constructor(name: string, position: Vector3, scene?: Scene, setActiveOnSceneIfNoneActive?: boolean);
    /**
     * Store current camera state (fov, position, etc..)
     * @returns the camera
     */
    storeState(): Camera;
    /**
     * Restores the camera state values if it has been stored. You must call storeState() first
     * @returns true if restored and false otherwise
     */
    protected _restoreStateValues(): boolean;
    /**
     * Restored camera state. You must call storeState() first.
     * @returns true if restored and false otherwise
     */
    restoreState(): boolean;
    /**
     * Gets the class name of the camera.
     * @returns the class name
     */
    getClassName(): string;
    /** @internal */
    readonly _isCamera = true;
    /**
     * Gets a string representation of the camera useful for debug purpose.
     * @param fullDetails Defines that a more verbose level of logging is required
     * @returns the string representation
     */
    toString(fullDetails?: boolean): string;
    /**
     * Automatically tilts the projection plane, using `projectionPlaneTilt`, to correct the perspective effect on vertical lines.
     */
    applyVerticalCorrection(): void;
    /**
     * Gets the current world space position of the camera.
     */
    get globalPosition(): Vector3;
    /**
     * Gets the list of active meshes this frame (meshes no culled or excluded by lod s in the frame)
     * @returns the active meshe list
     */
    getActiveMeshes(): SmartArray<AbstractMesh>;
    /**
     * Check whether a mesh is part of the current active mesh list of the camera
     * @param mesh Defines the mesh to check
     * @returns true if active, false otherwise
     */
    isActiveMesh(mesh: Mesh): boolean;
    /**
     * Is this camera ready to be used/rendered
     * @param completeCheck defines if a complete check (including post processes) has to be done (false by default)
     * @returns true if the camera is ready
     */
    isReady(completeCheck?: boolean): boolean;
    /** @internal */
    _initCache(): void;
    /**
     * @internal
     */
    _updateCache(ignoreParentClass?: boolean): void;
    /** @internal */
    _isSynchronized(): boolean;
    /** @internal */
    _isSynchronizedViewMatrix(): boolean;
    /** @internal */
    _isSynchronizedProjectionMatrix(): boolean;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault?: boolean): void;
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param ignored defines an ignored parameter kept for backward compatibility.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     * BACK COMPAT SIGNATURE ONLY.
     */
    attachControl(ignored: any, noPreventDefault?: boolean): void;
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl(): void;
    /**
     * Detach the current controls from the specified dom element.
     * @param ignored defines an ignored parameter kept for backward compatibility.
     */
    detachControl(ignored?: any): void;
    /**
     * Update the camera state according to the different inputs gathered during the frame.
     */
    update(): void;
    /** @internal */
    _checkInputs(): void;
    /** @internal */
    get rigCameras(): Camera[];
    /**
     * Gets the post process used by the rig cameras
     */
    get rigPostProcess(): Nullable<PostProcess>;
    /**
     * Internal, gets the first post process.
     * @returns the first post process to be run on this camera.
     */
    _getFirstPostProcess(): Nullable<PostProcess>;
    private _cascadePostProcessesToRigCams;
    /**
     * Attach a post process to the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#attach-postprocess
     * @param postProcess The post process to attach to the camera
     * @param insertAt The position of the post process in case several of them are in use in the scene
     * @returns the position the post process has been inserted at
     */
    attachPostProcess(postProcess: PostProcess, insertAt?: Nullable<number>): number;
    /**
     * Detach a post process to the camera.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses#attach-postprocess
     * @param postProcess The post process to detach from the camera
     */
    detachPostProcess(postProcess: PostProcess): void;
    /**
     * Gets the current world matrix of the camera
     * @returns the world matrix
     */
    getWorldMatrix(): Matrix;
    /** @internal */
    _getViewMatrix(): Matrix;
    /**
     * Gets the current view matrix of the camera.
     * @param force forces the camera to recompute the matrix without looking at the cached state
     * @returns the view matrix
     */
    getViewMatrix(force?: boolean): Matrix;
    /**
     * Freeze the projection matrix.
     * It will prevent the cache check of the camera projection compute and can speed up perf
     * if no parameter of the camera are meant to change
     * @param projection Defines manually a projection if necessary
     */
    freezeProjectionMatrix(projection?: Matrix): void;
    /**
     * Unfreeze the projection matrix if it has previously been freezed by freezeProjectionMatrix.
     */
    unfreezeProjectionMatrix(): void;
    /**
     * Gets the current projection matrix of the camera.
     * @param force forces the camera to recompute the matrix without looking at the cached state
     * @returns the projection matrix
     */
    getProjectionMatrix(force?: boolean): Matrix;
    /**
     * Gets the transformation matrix (ie. the multiplication of view by projection matrices)
     * @returns a Matrix
     */
    getTransformationMatrix(): Matrix;
    private _computeObliqueDistance;
    private _updateFrustumPlanes;
    /**
     * Checks if a cullable object (mesh...) is in the camera frustum
     * This checks the bounding box center. See isCompletelyInFrustum for a full bounding check
     * @param target The object to check
     * @param checkRigCameras If the rig cameras should be checked (eg. with VR camera both eyes should be checked) (Default: false)
     * @returns true if the object is in frustum otherwise false
     */
    isInFrustum(target: ICullable, checkRigCameras?: boolean): boolean;
    /**
     * Checks if a cullable object (mesh...) is in the camera frustum
     * Unlike isInFrustum this checks the full bounding box
     * @param target The object to check
     * @returns true if the object is in frustum otherwise false
     */
    isCompletelyInFrustum(target: ICullable): boolean;
    /**
     * Gets a ray in the forward direction from the camera.
     * @param length Defines the length of the ray to create
     * @param transform Defines the transform to apply to the ray, by default the world matrix is used to create a workd space ray
     * @param origin Defines the start point of the ray which defaults to the camera position
     * @returns the forward ray
     */
    getForwardRay(length?: number, transform?: Matrix, origin?: Vector3): Ray;
    /**
     * Gets a ray in the forward direction from the camera.
     * @param refRay the ray to (re)use when setting the values
     * @param length Defines the length of the ray to create
     * @param transform Defines the transform to apply to the ray, by default the world matrx is used to create a workd space ray
     * @param origin Defines the start point of the ray which defaults to the camera position
     * @returns the forward ray
     */
    getForwardRayToRef(refRay: Ray, length?: number, transform?: Matrix, origin?: Vector3): Ray;
    /**
     * Releases resources associated with this node.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void;
    /** @internal */
    _isLeftCamera: boolean;
    /**
     * Gets the left camera of a rig setup in case of Rigged Camera
     */
    get isLeftCamera(): boolean;
    /** @internal */
    _isRightCamera: boolean;
    /**
     * Gets the right camera of a rig setup in case of Rigged Camera
     */
    get isRightCamera(): boolean;
    /**
     * Gets the left camera of a rig setup in case of Rigged Camera
     */
    get leftCamera(): Nullable<FreeCamera>;
    /**
     * Gets the right camera of a rig setup in case of Rigged Camera
     */
    get rightCamera(): Nullable<FreeCamera>;
    /**
     * Gets the left camera target of a rig setup in case of Rigged Camera
     * @returns the target position
     */
    getLeftTarget(): Nullable<Vector3>;
    /**
     * Gets the right camera target of a rig setup in case of Rigged Camera
     * @returns the target position
     */
    getRightTarget(): Nullable<Vector3>;
    /**
     * @internal
     */
    setCameraRigMode(mode: number, rigParams: any): void;
    protected _setRigMode(rigParams: any): void;
    /** @internal */
    _getVRProjectionMatrix(): Matrix;
    /**
     * @internal
     */
    setCameraRigParameter(name: string, value: any): void;
    /**
     * needs to be overridden by children so sub has required properties to be copied
     * @internal
     */
    createRigCamera(name: string, cameraIndex: number): Nullable<Camera>;
    /**
     * May need to be overridden by children
     * @internal
     */
    _updateRigCameras(): void;
    /** @internal */
    _setupInputs(): void;
    /**
     * Serialiaze the camera setup to a json representation
     * @returns the JSON representation
     */
    serialize(): any;
    /**
     * Clones the current camera.
     * @param name The cloned camera name
     * @param newParent The cloned camera's new parent (none by default)
     * @returns the cloned camera
     */
    clone(name: string, newParent?: Nullable<Node>): Camera;
    /**
     * Gets the direction of the camera relative to a given local axis.
     * @param localAxis Defines the reference axis to provide a relative direction.
     * @returns the direction
     */
    getDirection(localAxis: DeepImmutable<Vector3>): Vector3;
    /**
     * Returns the current camera absolute rotation
     */
    get absoluteRotation(): Quaternion;
    /**
     * Gets the direction of the camera relative to a given local axis into a passed vector.
     * @param localAxis Defines the reference axis to provide a relative direction.
     * @param result Defines the vector to store the result in
     */
    getDirectionToRef(localAxis: DeepImmutable<Vector3>, result: Vector3): void;
    /**
     * Gets a camera constructor for a given camera type
     * @param type The type of the camera to construct (should be equal to one of the camera class name)
     * @param name The name of the camera the result will be able to instantiate
     * @param scene The scene the result will construct the camera in
     * @param interaxial_distance In case of stereoscopic setup, the distance between both eyes
     * @param isStereoscopicSideBySide In case of stereoscopic setup, should the sereo be side b side
     * @returns a factory method to construct the camera
     */
    static GetConstructorFromName(type: string, name: string, scene: Scene, interaxial_distance?: number, isStereoscopicSideBySide?: boolean): () => Camera;
    /**
     * Compute the world  matrix of the camera.
     * @returns the camera world matrix
     */
    computeWorldMatrix(): Matrix;
    /**
     * Parse a JSON and creates the camera from the parsed information
     * @param parsedCamera The JSON to parse
     * @param scene The scene to instantiate the camera in
     * @returns the newly constructed camera
     */
    static Parse(parsedCamera: any, scene: Scene): Camera;
    /** @internal */
    _calculateHandednessMultiplier(): number;
}
