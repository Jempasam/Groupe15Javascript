import { WebXRExperienceHelper } from "./webXRExperienceHelper";
import type { Scene } from "../scene";
import type { IWebXRInputOptions } from "./webXRInput";
import { WebXRInput } from "./webXRInput";
import type { IWebXRControllerPointerSelectionOptions } from "./features/WebXRControllerPointerSelection";
import { WebXRControllerPointerSelection } from "./features/WebXRControllerPointerSelection";
import type { IWebXRNearInteractionOptions } from "./features/WebXRNearInteraction";
import { WebXRNearInteraction } from "./features/WebXRNearInteraction";
import type { WebXRRenderTarget } from "./webXRTypes";
import type { WebXREnterExitUIOptions } from "./webXREnterExitUI";
import { WebXREnterExitUI } from "./webXREnterExitUI";
import type { AbstractMesh } from "../Meshes/abstractMesh";
import type { WebXRManagedOutputCanvasOptions } from "./webXRManagedOutputCanvas";
import type { IWebXRTeleportationOptions } from "./features/WebXRControllerTeleportation";
import { type IWebXRHandTrackingOptions } from "./features/WebXRHandTracking";
import { WebXRMotionControllerTeleportation } from "./features/WebXRControllerTeleportation";
/**
 * Options for the default xr helper
 */
export declare class WebXRDefaultExperienceOptions {
    /**
     * Enable or disable default UI to enter XR
     */
    disableDefaultUI?: boolean;
    /**
     * Should pointer selection not initialize.
     * Note that disabling pointer selection also disables teleportation.
     * Defaults to false.
     */
    disablePointerSelection?: boolean;
    /**
     * Should teleportation not initialize. Defaults to false.
     */
    disableTeleportation?: boolean;
    /**
     * Should nearInteraction not initialize. Defaults to false.
     */
    disableNearInteraction?: boolean;
    /**
     * Should hand tracking be disabled. Defaults to false.
     */
    disableHandTracking?: boolean;
    /**
     * Floor meshes that will be used for teleport
     */
    floorMeshes?: Array<AbstractMesh>;
    /**
     * If set to true, the first frame will not be used to reset position
     * The first frame is mainly used when copying transformation from the old camera
     * Mainly used in AR
     */
    ignoreNativeCameraTransformation?: boolean;
    /**
     * Optional configuration for the XR input object
     */
    inputOptions?: Partial<IWebXRInputOptions>;
    /**
     * optional configuration for pointer selection
     */
    pointerSelectionOptions?: Partial<IWebXRControllerPointerSelectionOptions>;
    /**
     * optional configuration for near interaction
     */
    nearInteractionOptions?: Partial<IWebXRNearInteractionOptions>;
    /**
     * optional configuration for hand tracking
     */
    handSupportOptions?: Partial<IWebXRHandTrackingOptions>;
    /**
     * optional configuration for teleportation
     */
    teleportationOptions?: Partial<IWebXRTeleportationOptions>;
    /**
     * optional configuration for the output canvas
     */
    outputCanvasOptions?: WebXRManagedOutputCanvasOptions;
    /**
     * optional UI options. This can be used among other to change session mode and reference space type
     */
    uiOptions?: Partial<WebXREnterExitUIOptions>;
    /**
     * When loading teleportation and pointer select, use stable versions instead of latest.
     */
    useStablePlugins?: boolean;
    /**
     * An optional rendering group id that will be set globally for teleportation, pointer selection and default controller meshes
     */
    renderingGroupId?: number;
    /**
     * A list of optional features to init the session with
     * If set to true, all features we support will be added
     */
    optionalFeatures?: boolean | string[];
}
/**
 * Default experience for webxr
 */
export declare class WebXRDefaultExperience {
    /**
     * Base experience
     */
    baseExperience: WebXRExperienceHelper;
    /**
     * Enables ui for entering/exiting xr
     */
    enterExitUI: WebXREnterExitUI;
    /**
     * Input experience extension
     */
    input: WebXRInput;
    /**
     * Enables laser pointer and selection
     */
    pointerSelection: WebXRControllerPointerSelection;
    /**
     * Default target xr should render to
     */
    renderTarget: WebXRRenderTarget;
    /**
     * Enables teleportation
     */
    teleportation: WebXRMotionControllerTeleportation;
    /**
     * Enables near interaction for hands/controllers
     */
    nearInteraction: WebXRNearInteraction;
    private constructor();
    /**
     * Creates the default xr experience
     * @param scene scene
     * @param options options for basic configuration
     * @returns resulting WebXRDefaultExperience
     */
    static CreateAsync(scene: Scene, options?: WebXRDefaultExperienceOptions): Promise<WebXRDefaultExperience>;
    /**
     * Disposes of the experience helper
     */
    dispose(): void;
}
