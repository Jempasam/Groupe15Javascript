import { Observable } from "../Misc/observable.js";
import { ScenePerformancePriority } from "../scene.js";
import { Quaternion, Matrix, Vector3, TmpVectors } from "../Maths/math.vector.js";
import { Engine } from "../Engines/engine.js";
import { VertexBuffer } from "../Buffers/buffer.js";
import { VertexData } from "../Meshes/mesh.vertexData.js";
import { TransformNode } from "../Meshes/transformNode.js";
import { PickingInfo } from "../Collisions/pickingInfo.js";
import { BoundingInfo } from "../Culling/boundingInfo.js";

import { UniformBuffer } from "../Materials/uniformBuffer.js";
import { _MeshCollisionData } from "../Collisions/meshCollisionData.js";
import { _WarnImport } from "../Misc/devTools.js";
import { extractMinAndMax } from "../Maths/math.functions.js";
import { Color3, Color4 } from "../Maths/math.color.js";
import { Epsilon } from "../Maths/math.constants.js";
import { Axis } from "../Maths/math.axis.js";
import { RegisterClass } from "../Misc/typeStore.js";
/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
class _FacetDataStorage {
    constructor() {
        this.facetNb = 0; // facet number
        this.partitioningSubdivisions = 10; // number of subdivisions per axis in the partitioning space
        this.partitioningBBoxRatio = 1.01; // the partitioning array space is by default 1% bigger than the bounding box
        this.facetDataEnabled = false; // is the facet data feature enabled on this mesh ?
        this.facetParameters = {}; // keep a reference to the object parameters to avoid memory re-allocation
        this.bbSize = Vector3.Zero(); // bbox size approximated for facet data
        this.subDiv = {
            // actual number of subdivisions per axis for ComputeNormals()
            max: 1,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            X: 1,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Y: 1,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            Z: 1,
        };
        this.facetDepthSort = false; // is the facet depth sort to be computed
        this.facetDepthSortEnabled = false; // is the facet depth sort initialized
    }
}
/**
 * @internal
 **/
// eslint-disable-next-line @typescript-eslint/naming-convention
class _InternalAbstractMeshDataInfo {
    constructor() {
        this._hasVertexAlpha = false;
        this._useVertexColors = true;
        this._numBoneInfluencers = 4;
        this._applyFog = true;
        this._receiveShadows = false;
        this._facetData = new _FacetDataStorage();
        this._visibility = 1.0;
        this._skeleton = null;
        this._layerMask = 0x0fffffff;
        this._computeBonesUsingShaders = true;
        this._isActive = false;
        this._onlyForInstances = false;
        this._isActiveIntermediate = false;
        this._onlyForInstancesIntermediate = false;
        this._actAsRegularMesh = false;
        this._currentLOD = null;
        this._currentLODIsUpToDate = false;
        this._collisionRetryCount = 3;
        this._morphTargetManager = null;
        this._renderingGroupId = 0;
        this._bakedVertexAnimationManager = null;
        this._material = null;
        this._positions = null;
        this._pointerOverDisableMeshTesting = false;
        // Collisions
        this._meshCollisionData = new _MeshCollisionData();
        this._enableDistantPicking = false;
        /** @internal
         * Bounding info that is unnafected by the addition of thin instances
         */
        this._rawBoundingInfo = null;
    }
}
/**
 * Class used to store all common mesh properties
 */
export class AbstractMesh extends TransformNode {
    /**
     * No billboard
     */
    static get BILLBOARDMODE_NONE() {
        return TransformNode.BILLBOARDMODE_NONE;
    }
    /** Billboard on X axis */
    static get BILLBOARDMODE_X() {
        return TransformNode.BILLBOARDMODE_X;
    }
    /** Billboard on Y axis */
    static get BILLBOARDMODE_Y() {
        return TransformNode.BILLBOARDMODE_Y;
    }
    /** Billboard on Z axis */
    static get BILLBOARDMODE_Z() {
        return TransformNode.BILLBOARDMODE_Z;
    }
    /** Billboard on all axes */
    static get BILLBOARDMODE_ALL() {
        return TransformNode.BILLBOARDMODE_ALL;
    }
    /** Billboard on using position instead of orientation */
    static get BILLBOARDMODE_USE_POSITION() {
        return TransformNode.BILLBOARDMODE_USE_POSITION;
    }
    /**
     * Gets the number of facets in the mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#what-is-a-mesh-facet
     */
    get facetNb() {
        return this._internalAbstractMeshDataInfo._facetData.facetNb;
    }
    /**
     * Gets or set the number (integer) of subdivisions per axis in the partitioning space
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#tweaking-the-partitioning
     */
    get partitioningSubdivisions() {
        return this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions;
    }
    set partitioningSubdivisions(nb) {
        this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions = nb;
    }
    /**
     * The ratio (float) to apply to the bounding box size to set to the partitioning space.
     * Ex : 1.01 (default) the partitioning space is 1% bigger than the bounding box
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#tweaking-the-partitioning
     */
    get partitioningBBoxRatio() {
        return this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio;
    }
    set partitioningBBoxRatio(ratio) {
        this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio = ratio;
    }
    /**
     * Gets or sets a boolean indicating that the facets must be depth sorted on next call to `updateFacetData()`.
     * Works only for updatable meshes.
     * Doesn't work with multi-materials
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#facet-depth-sort
     */
    get mustDepthSortFacets() {
        return this._internalAbstractMeshDataInfo._facetData.facetDepthSort;
    }
    set mustDepthSortFacets(sort) {
        this._internalAbstractMeshDataInfo._facetData.facetDepthSort = sort;
    }
    /**
     * The location (Vector3) where the facet depth sort must be computed from.
     * By default, the active camera position.
     * Used only when facet depth sort is enabled
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#facet-depth-sort
     */
    get facetDepthSortFrom() {
        return this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom;
    }
    set facetDepthSortFrom(location) {
        this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom = location;
    }
    /** number of collision detection tries. Change this value if not all collisions are detected and handled properly */
    get collisionRetryCount() {
        return this._internalAbstractMeshDataInfo._collisionRetryCount;
    }
    set collisionRetryCount(retryCount) {
        this._internalAbstractMeshDataInfo._collisionRetryCount = retryCount;
    }
    /**
     * gets a boolean indicating if facetData is enabled
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#what-is-a-mesh-facet
     */
    get isFacetDataEnabled() {
        return this._internalAbstractMeshDataInfo._facetData.facetDataEnabled;
    }
    /**
     * Gets or sets the morph target manager
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/morphTargets
     */
    get morphTargetManager() {
        return this._internalAbstractMeshDataInfo._morphTargetManager;
    }
    set morphTargetManager(value) {
        if (this._internalAbstractMeshDataInfo._morphTargetManager === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._morphTargetManager = value;
        this._syncGeometryWithMorphTargetManager();
    }
    /**
     * Gets or sets the baked vertex animation manager
     * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/baked_texture_animations
     */
    get bakedVertexAnimationManager() {
        return this._internalAbstractMeshDataInfo._bakedVertexAnimationManager;
    }
    set bakedVertexAnimationManager(value) {
        if (this._internalAbstractMeshDataInfo._bakedVertexAnimationManager === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._bakedVertexAnimationManager = value;
        this._markSubMeshesAsAttributesDirty();
    }
    /** @internal */
    _syncGeometryWithMorphTargetManager() { }
    /**
     * @internal
     */
    _updateNonUniformScalingState(value) {
        if (!super._updateNonUniformScalingState(value)) {
            return false;
        }
        this._markSubMeshesAsMiscDirty();
        return true;
    }
    /** @internal */
    get rawBoundingInfo() {
        return this._internalAbstractMeshDataInfo._rawBoundingInfo;
    }
    set rawBoundingInfo(boundingInfo) {
        this._internalAbstractMeshDataInfo._rawBoundingInfo = boundingInfo;
    }
    /** Set a function to call when this mesh collides with another one */
    set onCollide(callback) {
        if (this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver) {
            this.onCollideObservable.remove(this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver);
        }
        this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver = this.onCollideObservable.add(callback);
    }
    /** Set a function to call when the collision's position changes */
    set onCollisionPositionChange(callback) {
        if (this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver) {
            this.onCollisionPositionChangeObservable.remove(this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver);
        }
        this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver = this.onCollisionPositionChangeObservable.add(callback);
    }
    /**
     * Gets or sets mesh visibility between 0 and 1 (default is 1)
     */
    get visibility() {
        return this._internalAbstractMeshDataInfo._visibility;
    }
    /**
     * Gets or sets mesh visibility between 0 and 1 (default is 1)
     */
    set visibility(value) {
        if (this._internalAbstractMeshDataInfo._visibility === value) {
            return;
        }
        const oldValue = this._internalAbstractMeshDataInfo._visibility;
        this._internalAbstractMeshDataInfo._visibility = value;
        if ((oldValue === 1 && value !== 1) || (oldValue !== 1 && value === 1)) {
            this._markSubMeshesAsDirty((defines) => {
                defines.markAsMiscDirty();
                defines.markAsPrePassDirty();
            });
        }
    }
    /**
     * Gets or sets the property which disables the test that is checking that the mesh under the pointer is the same than the previous time we tested for it (default: false).
     * Set this property to true if you want thin instances picking to be reported accurately when moving over the mesh.
     * Note that setting this property to true will incur some performance penalties when dealing with pointer events for this mesh so use it sparingly.
     */
    get pointerOverDisableMeshTesting() {
        return this._internalAbstractMeshDataInfo._pointerOverDisableMeshTesting;
    }
    set pointerOverDisableMeshTesting(disable) {
        this._internalAbstractMeshDataInfo._pointerOverDisableMeshTesting = disable;
    }
    /**
     * Specifies the rendering group id for this mesh (0 by default)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
     */
    get renderingGroupId() {
        return this._internalAbstractMeshDataInfo._renderingGroupId;
    }
    set renderingGroupId(value) {
        this._internalAbstractMeshDataInfo._renderingGroupId = value;
    }
    /** Gets or sets current material */
    get material() {
        return this._internalAbstractMeshDataInfo._material;
    }
    set material(value) {
        if (this._internalAbstractMeshDataInfo._material === value) {
            return;
        }
        // remove from material mesh map id needed
        if (this._internalAbstractMeshDataInfo._material && this._internalAbstractMeshDataInfo._material.meshMap) {
            this._internalAbstractMeshDataInfo._material.meshMap[this.uniqueId] = undefined;
        }
        this._internalAbstractMeshDataInfo._material = value;
        if (value && value.meshMap) {
            value.meshMap[this.uniqueId] = this;
        }
        if (this.onMaterialChangedObservable.hasObservers()) {
            this.onMaterialChangedObservable.notifyObservers(this);
        }
        if (!this.subMeshes) {
            return;
        }
        this.resetDrawCache();
        this._unBindEffect();
    }
    /**
     * Gets the material used to render the mesh in a specific render pass
     * @param renderPassId render pass id
     * @returns material used for the render pass. If no specific material is used for this render pass, undefined is returned (meaning mesh.material is used for this pass)
     */
    getMaterialForRenderPass(renderPassId) {
        return this._internalAbstractMeshDataInfo._materialForRenderPass?.[renderPassId];
    }
    /**
     * Sets the material to be used to render the mesh in a specific render pass
     * @param renderPassId render pass id
     * @param material material to use for this render pass. If undefined is passed, no specific material will be used for this render pass but the regular material will be used instead (mesh.material)
     */
    setMaterialForRenderPass(renderPassId, material) {
        this.resetDrawCache(renderPassId);
        if (!this._internalAbstractMeshDataInfo._materialForRenderPass) {
            this._internalAbstractMeshDataInfo._materialForRenderPass = [];
        }
        this._internalAbstractMeshDataInfo._materialForRenderPass[renderPassId] = material;
    }
    /**
     * Gets or sets a boolean indicating that this mesh can receive realtime shadows
     * @see https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows
     */
    get receiveShadows() {
        return this._internalAbstractMeshDataInfo._receiveShadows;
    }
    set receiveShadows(value) {
        if (this._internalAbstractMeshDataInfo._receiveShadows === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._receiveShadows = value;
        this._markSubMeshesAsLightDirty();
    }
    /** Gets or sets a boolean indicating that this mesh contains vertex color data with alpha values */
    get hasVertexAlpha() {
        return this._internalAbstractMeshDataInfo._hasVertexAlpha;
    }
    set hasVertexAlpha(value) {
        if (this._internalAbstractMeshDataInfo._hasVertexAlpha === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._hasVertexAlpha = value;
        this._markSubMeshesAsAttributesDirty();
        this._markSubMeshesAsMiscDirty();
    }
    /** Gets or sets a boolean indicating that this mesh needs to use vertex color data to render (if this kind of vertex data is available in the geometry) */
    get useVertexColors() {
        return this._internalAbstractMeshDataInfo._useVertexColors;
    }
    set useVertexColors(value) {
        if (this._internalAbstractMeshDataInfo._useVertexColors === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._useVertexColors = value;
        this._markSubMeshesAsAttributesDirty();
    }
    /**
     * Gets or sets a boolean indicating that bone animations must be computed by the GPU (true by default)
     */
    get computeBonesUsingShaders() {
        return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
    }
    set computeBonesUsingShaders(value) {
        if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
        this._markSubMeshesAsAttributesDirty();
    }
    /** Gets or sets the number of allowed bone influences per vertex (4 by default) */
    get numBoneInfluencers() {
        return this._internalAbstractMeshDataInfo._numBoneInfluencers;
    }
    set numBoneInfluencers(value) {
        if (this._internalAbstractMeshDataInfo._numBoneInfluencers === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._numBoneInfluencers = value;
        this._markSubMeshesAsAttributesDirty();
    }
    /** Gets or sets a boolean indicating that this mesh will allow fog to be rendered on it (true by default) */
    get applyFog() {
        return this._internalAbstractMeshDataInfo._applyFog;
    }
    set applyFog(value) {
        if (this._internalAbstractMeshDataInfo._applyFog === value) {
            return;
        }
        this._internalAbstractMeshDataInfo._applyFog = value;
        this._markSubMeshesAsMiscDirty();
    }
    /** When enabled, decompose picking matrices for better precision with large values for mesh position and scling */
    get enableDistantPicking() {
        return this._internalAbstractMeshDataInfo._enableDistantPicking;
    }
    set enableDistantPicking(value) {
        this._internalAbstractMeshDataInfo._enableDistantPicking = value;
    }
    /**
     * Gets or sets the current layer mask (default is 0x0FFFFFFF)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/layerMasksAndMultiCam
     */
    get layerMask() {
        return this._internalAbstractMeshDataInfo._layerMask;
    }
    set layerMask(value) {
        if (value === this._internalAbstractMeshDataInfo._layerMask) {
            return;
        }
        this._internalAbstractMeshDataInfo._layerMask = value;
        this._resyncLightSources();
    }
    /**
     * Gets or sets a collision mask used to mask collisions (default is -1).
     * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
     */
    get collisionMask() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._collisionMask;
    }
    set collisionMask(mask) {
        this._internalAbstractMeshDataInfo._meshCollisionData._collisionMask = !isNaN(mask) ? mask : -1;
    }
    /**
     * Gets or sets a collision response flag (default is true).
     * when collisionResponse is false, events are still triggered but colliding entity has no response
     * This helps creating trigger volume when user wants collision feedback events but not position/velocity
     * to respond to the collision.
     */
    get collisionResponse() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._collisionResponse;
    }
    set collisionResponse(response) {
        this._internalAbstractMeshDataInfo._meshCollisionData._collisionResponse = response;
    }
    /**
     * Gets or sets the current collision group mask (-1 by default).
     * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
     */
    get collisionGroup() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._collisionGroup;
    }
    set collisionGroup(mask) {
        this._internalAbstractMeshDataInfo._meshCollisionData._collisionGroup = !isNaN(mask) ? mask : -1;
    }
    /**
     * Gets or sets current surrounding meshes (null by default).
     *
     * By default collision detection is tested against every mesh in the scene.
     * It is possible to set surroundingMeshes to a defined list of meshes and then only these specified
     * meshes will be tested for the collision.
     *
     * Note: if set to an empty array no collision will happen when this mesh is moved.
     */
    get surroundingMeshes() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._surroundingMeshes;
    }
    set surroundingMeshes(meshes) {
        this._internalAbstractMeshDataInfo._meshCollisionData._surroundingMeshes = meshes;
    }
    /** Gets the list of lights affecting that mesh */
    get lightSources() {
        return this._lightSources;
    }
    /** @internal */
    get _positions() {
        return null;
    }
    /**
     * Gets or sets a skeleton to apply skinning transformations
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons
     */
    set skeleton(value) {
        const skeleton = this._internalAbstractMeshDataInfo._skeleton;
        if (skeleton && skeleton.needInitialSkinMatrix) {
            skeleton._unregisterMeshWithPoseMatrix(this);
        }
        if (value && value.needInitialSkinMatrix) {
            value._registerMeshWithPoseMatrix(this);
        }
        this._internalAbstractMeshDataInfo._skeleton = value;
        if (!this._internalAbstractMeshDataInfo._skeleton) {
            this._bonesTransformMatrices = null;
        }
        this._markSubMeshesAsAttributesDirty();
    }
    get skeleton() {
        return this._internalAbstractMeshDataInfo._skeleton;
    }
    // Constructor
    /**
     * Creates a new AbstractMesh
     * @param name defines the name of the mesh
     * @param scene defines the hosting scene
     */
    constructor(name, scene = null) {
        super(name, scene, false);
        // Internal data
        /** @internal */
        this._internalAbstractMeshDataInfo = new _InternalAbstractMeshDataInfo();
        /** @internal */
        this._waitingMaterialId = null;
        /**
         * The culling strategy to use to check whether the mesh must be rendered or not.
         * This value can be changed at any time and will be used on the next render mesh selection.
         * The possible values are :
         * - AbstractMesh.CULLINGSTRATEGY_STANDARD
         * - AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY
         * Please read each static variable documentation to get details about the culling process.
         * */
        this.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        // Events
        /**
         * An event triggered when this mesh collides with another one
         */
        this.onCollideObservable = new Observable();
        /**
         * An event triggered when the collision's position changes
         */
        this.onCollisionPositionChangeObservable = new Observable();
        /**
         * An event triggered when material is changed
         */
        this.onMaterialChangedObservable = new Observable();
        // Properties
        /**
         * Gets or sets the orientation for POV movement & rotation
         */
        this.definedFacingForward = true;
        /** @internal */
        this._occlusionQuery = null;
        /** @internal */
        this._renderingGroup = null;
        /** Gets or sets the alpha index used to sort transparent meshes
         * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#alpha-index
         */
        this.alphaIndex = Number.MAX_VALUE;
        /**
         * Gets or sets a boolean indicating if the mesh is visible (renderable). Default is true
         */
        this.isVisible = true;
        /**
         * Gets or sets a boolean indicating if the mesh can be picked (by scene.pick for instance or through actions). Default is true
         */
        this.isPickable = true;
        /**
         * Gets or sets a boolean indicating if the mesh can be near picked (touched by the XR controller or hands). Default is false
         */
        this.isNearPickable = false;
        /**
         * Gets or sets a boolean indicating if the mesh can be grabbed. Default is false.
         * Setting this to true, while using the XR near interaction feature, will trigger a pointer event when the mesh is grabbed.
         * Grabbing means that the controller is using the squeeze or main trigger button to grab the mesh.
         * This is different from nearPickable which only triggers the event when the mesh is touched by the controller
         */
        this.isNearGrabbable = false;
        /** Gets or sets a boolean indicating that bounding boxes of subMeshes must be rendered as well (false by default) */
        this.showSubMeshesBoundingBox = false;
        /** Gets or sets a boolean indicating if the mesh must be considered as a ray blocker for lens flares (false by default)
         * @see https://doc.babylonjs.com/features/featuresDeepDive/environment/lenseFlare
         */
        this.isBlocker = false;
        /**
         * Gets or sets a boolean indicating that pointer move events must be supported on this mesh (false by default)
         */
        this.enablePointerMoveEvents = false;
        /** Defines color to use when rendering outline */
        this.outlineColor = Color3.Red();
        /** Define width to use when rendering outline */
        this.outlineWidth = 0.02;
        /** Defines color to use when rendering overlay */
        this.overlayColor = Color3.Red();
        /** Defines alpha to use when rendering overlay */
        this.overlayAlpha = 0.5;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes selection (true by default) */
        this.useOctreeForRenderingSelection = true;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes picking (true by default) */
        this.useOctreeForPicking = true;
        /** Gets or sets a boolean indicating that internal octree (if available) can be used to boost submeshes collision (true by default) */
        this.useOctreeForCollisions = true;
        /**
         * True if the mesh must be rendered in any case (this will shortcut the frustum clipping phase)
         */
        this.alwaysSelectAsActiveMesh = false;
        /**
         * Gets or sets a boolean indicating that the bounding info does not need to be kept in sync (for performance reason)
         */
        this.doNotSyncBoundingInfo = false;
        /**
         * Gets or sets the current action manager
         * @see https://doc.babylonjs.com/features/featuresDeepDive/events/actions
         */
        this.actionManager = null;
        /**
         * Gets or sets the ellipsoid used to impersonate this mesh when using collision engine (default is (0.5, 1, 0.5))
         * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
         */
        this.ellipsoid = new Vector3(0.5, 1, 0.5);
        /**
         * Gets or sets the ellipsoid offset used to impersonate this mesh when using collision engine (default is (0, 0, 0))
         * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
         */
        this.ellipsoidOffset = new Vector3(0, 0, 0);
        // Edges
        /**
         * Defines edge width used when edgesRenderer is enabled
         * @see https://www.babylonjs-playground.com/#10OJSG#13
         */
        this.edgesWidth = 1;
        /**
         * Defines edge color used when edgesRenderer is enabled
         * @see https://www.babylonjs-playground.com/#10OJSG#13
         */
        this.edgesColor = new Color4(1, 0, 0, 1);
        /** @internal */
        this._edgesRenderer = null;
        /** @internal */
        this._masterMesh = null;
        this._boundingInfo = null;
        this._boundingInfoIsDirty = true;
        /** @internal */
        this._renderId = 0;
        /** @internal */
        this._intersectionsInProgress = new Array();
        /** @internal */
        this._unIndexed = false;
        /** @internal */
        this._lightSources = new Array();
        // Loading properties
        /** @internal */
        this._waitingData = {
            lods: null,
            actions: null,
            freezeWorldMatrix: null,
        };
        /** @internal */
        this._bonesTransformMatrices = null;
        /** @internal */
        this._transformMatrixTexture = null;
        /**
         * An event triggered when the mesh is rebuilt.
         */
        this.onRebuildObservable = new Observable();
        this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
            newPosition.subtractToRef(this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions, this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions);
            if (this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions.length() > Engine.CollisionsEpsilon) {
                this.position.addInPlace(this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions);
            }
            if (collidedMesh) {
                this.onCollideObservable.notifyObservers(collidedMesh);
            }
            this.onCollisionPositionChangeObservable.notifyObservers(this.position);
        };
        scene = this.getScene();
        scene.addMesh(this);
        this._resyncLightSources();
        // Mesh Uniform Buffer.
        this._uniformBuffer = new UniformBuffer(this.getScene().getEngine(), undefined, undefined, name, !this.getScene().getEngine().isWebGPU);
        this._buildUniformLayout();
        switch (scene.performancePriority) {
            case ScenePerformancePriority.Aggressive:
                this.doNotSyncBoundingInfo = true;
            // eslint-disable-next-line no-fallthrough
            case ScenePerformancePriority.Intermediate:
                this.alwaysSelectAsActiveMesh = true;
                this.isPickable = false;
                break;
        }
    }
    _buildUniformLayout() {
        this._uniformBuffer.addUniform("world", 16);
        this._uniformBuffer.addUniform("visibility", 1);
        this._uniformBuffer.create();
    }
    /**
     * Transfer the mesh values to its UBO.
     * @param world The world matrix associated with the mesh
     */
    transferToEffect(world) {
        const ubo = this._uniformBuffer;
        ubo.updateMatrix("world", world);
        ubo.updateFloat("visibility", this._internalAbstractMeshDataInfo._visibility);
        ubo.update();
    }
    /**
     * Gets the mesh uniform buffer.
     * @returns the uniform buffer of the mesh.
     */
    getMeshUniformBuffer() {
        return this._uniformBuffer;
    }
    /**
     * Returns the string "AbstractMesh"
     * @returns "AbstractMesh"
     */
    getClassName() {
        return "AbstractMesh";
    }
    /**
     * Gets a string representation of the current mesh
     * @param fullDetails defines a boolean indicating if full details must be included
     * @returns a string representation of the current mesh
     */
    toString(fullDetails) {
        let ret = "Name: " + this.name + ", isInstance: " + (this.getClassName() !== "InstancedMesh" ? "YES" : "NO");
        ret += ", # of submeshes: " + (this.subMeshes ? this.subMeshes.length : 0);
        const skeleton = this._internalAbstractMeshDataInfo._skeleton;
        if (skeleton) {
            ret += ", skeleton: " + skeleton.name;
        }
        if (fullDetails) {
            ret += ", billboard mode: " + ["NONE", "X", "Y", null, "Z", null, null, "ALL"][this.billboardMode];
            ret += ", freeze wrld mat: " + (this._isWorldMatrixFrozen || this._waitingData.freezeWorldMatrix ? "YES" : "NO");
        }
        return ret;
    }
    /**
     * @internal
     */
    _getEffectiveParent() {
        if (this._masterMesh && this.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
            return this._masterMesh;
        }
        return super._getEffectiveParent();
    }
    /**
     * @internal
     */
    _getActionManagerForTrigger(trigger, initialCall = true) {
        if (this.actionManager && (initialCall || this.actionManager.isRecursive)) {
            if (trigger) {
                if (this.actionManager.hasSpecificTrigger(trigger)) {
                    return this.actionManager;
                }
            }
            else {
                return this.actionManager;
            }
        }
        if (!this.parent) {
            return null;
        }
        return this.parent._getActionManagerForTrigger(trigger, false);
    }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _rebuild(dispose = false) {
        this.onRebuildObservable.notifyObservers(this);
        if (this._occlusionQuery !== null) {
            this._occlusionQuery = null;
        }
        if (!this.subMeshes) {
            return;
        }
        for (const subMesh of this.subMeshes) {
            subMesh._rebuild();
        }
        this.resetDrawCache();
    }
    /** @internal */
    _resyncLightSources() {
        this._lightSources.length = 0;
        for (const light of this.getScene().lights) {
            if (!light.isEnabled()) {
                continue;
            }
            if (light.canAffectMesh(this)) {
                this._lightSources.push(light);
            }
        }
        this._markSubMeshesAsLightDirty();
    }
    /**
     * @internal
     */
    _resyncLightSource(light) {
        const isIn = light.isEnabled() && light.canAffectMesh(this);
        const index = this._lightSources.indexOf(light);
        let removed = false;
        if (index === -1) {
            if (!isIn) {
                return;
            }
            this._lightSources.push(light);
        }
        else {
            if (isIn) {
                return;
            }
            removed = true;
            this._lightSources.splice(index, 1);
        }
        this._markSubMeshesAsLightDirty(removed);
    }
    /** @internal */
    _unBindEffect() {
        for (const subMesh of this.subMeshes) {
            subMesh.setEffect(null);
        }
    }
    /**
     * @internal
     */
    _removeLightSource(light, dispose) {
        const index = this._lightSources.indexOf(light);
        if (index === -1) {
            return;
        }
        this._lightSources.splice(index, 1);
        this._markSubMeshesAsLightDirty(dispose);
    }
    _markSubMeshesAsDirty(func) {
        if (!this.subMeshes) {
            return;
        }
        for (const subMesh of this.subMeshes) {
            for (let i = 0; i < subMesh._drawWrappers.length; ++i) {
                const drawWrapper = subMesh._drawWrappers[i];
                if (!drawWrapper || !drawWrapper.defines || !drawWrapper.defines.markAllAsDirty) {
                    continue;
                }
                func(drawWrapper.defines);
            }
        }
    }
    /**
     * @internal
     */
    _markSubMeshesAsLightDirty(dispose = false) {
        this._markSubMeshesAsDirty((defines) => defines.markAsLightDirty(dispose));
    }
    /** @internal */
    _markSubMeshesAsAttributesDirty() {
        this._markSubMeshesAsDirty((defines) => defines.markAsAttributesDirty());
    }
    /** @internal */
    _markSubMeshesAsMiscDirty() {
        this._markSubMeshesAsDirty((defines) => defines.markAsMiscDirty());
    }
    /**
     * Flag the AbstractMesh as dirty (Forcing it to update everything)
     * @param property if set to "rotation" the objects rotationQuaternion will be set to null
     * @returns this AbstractMesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    markAsDirty(property) {
        this._currentRenderId = Number.MAX_VALUE;
        this._isDirty = true;
        return this;
    }
    /**
     * Resets the draw wrappers cache for all submeshes of this abstract mesh
     * @param passId If provided, releases only the draw wrapper corresponding to this render pass id
     */
    resetDrawCache(passId) {
        if (!this.subMeshes) {
            return;
        }
        for (const subMesh of this.subMeshes) {
            subMesh.resetDrawCache(passId);
        }
    }
    // Methods
    /**
     * Returns true if the mesh is blocked. Implemented by child classes
     */
    get isBlocked() {
        return false;
    }
    /**
     * Returns the mesh itself by default. Implemented by child classes
     * @param camera defines the camera to use to pick the right LOD level
     * @returns the currentAbstractMesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getLOD(camera) {
        return this;
    }
    /**
     * Returns 0 by default. Implemented by child classes
     * @returns an integer
     */
    getTotalVertices() {
        return 0;
    }
    /**
     * Returns a positive integer : the total number of indices in this mesh geometry.
     * @returns the number of indices or zero if the mesh has no geometry.
     */
    getTotalIndices() {
        return 0;
    }
    /**
     * Returns null by default. Implemented by child classes
     * @returns null
     */
    getIndices() {
        return null;
    }
    /**
     * Returns the array of the requested vertex data kind. Implemented by child classes
     * @param kind defines the vertex data kind to use
     * @returns null
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getVerticesData(kind) {
        return null;
    }
    /**
     * Sets the vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
     * Note that a new underlying VertexBuffer object is created each call.
     * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
     * @param kind defines vertex data kind:
     * * VertexBuffer.PositionKind
     * * VertexBuffer.UVKind
     * * VertexBuffer.UV2Kind
     * * VertexBuffer.UV3Kind
     * * VertexBuffer.UV4Kind
     * * VertexBuffer.UV5Kind
     * * VertexBuffer.UV6Kind
     * * VertexBuffer.ColorKind
     * * VertexBuffer.MatricesIndicesKind
     * * VertexBuffer.MatricesIndicesExtraKind
     * * VertexBuffer.MatricesWeightsKind
     * * VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updatable defines if the data must be flagged as updatable (or static)
     * @param stride defines the vertex stride (size of an entire vertex). Can be null and in this case will be deduced from vertex data kind
     * @returns the current mesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setVerticesData(kind, data, updatable, stride) {
        return this;
    }
    /**
     * Updates the existing vertex data of the mesh geometry for the requested `kind`.
     * If the mesh has no geometry, it is simply returned as it is.
     * @param kind defines vertex data kind:
     * * VertexBuffer.PositionKind
     * * VertexBuffer.UVKind
     * * VertexBuffer.UV2Kind
     * * VertexBuffer.UV3Kind
     * * VertexBuffer.UV4Kind
     * * VertexBuffer.UV5Kind
     * * VertexBuffer.UV6Kind
     * * VertexBuffer.ColorKind
     * * VertexBuffer.MatricesIndicesKind
     * * VertexBuffer.MatricesIndicesExtraKind
     * * VertexBuffer.MatricesWeightsKind
     * * VertexBuffer.MatricesWeightsExtraKind
     * @param data defines the data source
     * @param updateExtends If `kind` is `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed
     * @param makeItUnique If true, a new global geometry is created from this data and is set to the mesh
     * @returns the current mesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateVerticesData(kind, data, updateExtends, makeItUnique) {
        return this;
    }
    /**
     * Sets the mesh indices,
     * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
     * @param indices Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array)
     * @param totalVertices Defines the total number of vertices
     * @returns the current mesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setIndices(indices, totalVertices) {
        return this;
    }
    /**
     * Gets a boolean indicating if specific vertex data is present
     * @param kind defines the vertex data kind to use
     * @returns true is data kind is present
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isVerticesDataPresent(kind) {
        return false;
    }
    /**
     * Returns the mesh BoundingInfo object or creates a new one and returns if it was undefined.
     * Note that it returns a shallow bounding of the mesh (i.e. it does not include children).
     * However, if the mesh contains thin instances, it will be expanded to include them. If you want the "raw" bounding data instead, then use `getRawBoundingInfo()`.
     * To get the full bounding of all children, call `getHierarchyBoundingVectors` instead.
     * @returns a BoundingInfo
     */
    getBoundingInfo() {
        if (this._masterMesh) {
            return this._masterMesh.getBoundingInfo();
        }
        if (this._boundingInfoIsDirty) {
            this._boundingInfoIsDirty = false;
            // this._boundingInfo is being created if undefined
            this._updateBoundingInfo();
        }
        // cannot be null.
        return this._boundingInfo;
    }
    /**
     * Returns the bounding info unnafected by instance data.
     * @returns the bounding info of the mesh unaffected by instance data.
     */
    getRawBoundingInfo() {
        return this.rawBoundingInfo ?? this.getBoundingInfo();
    }
    /**
     * Overwrite the current bounding info
     * @param boundingInfo defines the new bounding info
     * @returns the current mesh
     */
    setBoundingInfo(boundingInfo) {
        this._boundingInfo = boundingInfo;
        return this;
    }
    /**
     * Returns true if there is already a bounding info
     */
    get hasBoundingInfo() {
        return this._boundingInfo !== null;
    }
    /**
     * Creates a new bounding info for the mesh
     * @param minimum min vector of the bounding box/sphere
     * @param maximum max vector of the bounding box/sphere
     * @param worldMatrix defines the new world matrix
     * @returns the new bounding info
     */
    buildBoundingInfo(minimum, maximum, worldMatrix) {
        this._boundingInfo = new BoundingInfo(minimum, maximum, worldMatrix);
        return this._boundingInfo;
    }
    /**
     * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
     * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box. Default is false
     * @param ignoreRotation ignore rotation when computing the scale (ie. object will be axis aligned). Default is false
     * @param predicate predicate that is passed in to getHierarchyBoundingVectors when selecting which object should be included when scaling
     * @returns the current mesh
     */
    normalizeToUnitCube(includeDescendants = true, ignoreRotation = false, predicate) {
        return super.normalizeToUnitCube(includeDescendants, ignoreRotation, predicate);
    }
    /** Gets a boolean indicating if this mesh has skinning data and an attached skeleton */
    get useBones() {
        return ((this.skeleton &&
            this.getScene().skeletonsEnabled &&
            this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind) &&
            this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)));
    }
    /** @internal */
    _preActivate() { }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _preActivateForIntermediateRendering(renderId) { }
    /**
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _activate(renderId, intermediateRendering) {
        this._renderId = renderId;
        return true;
    }
    /** @internal */
    _postActivate() {
        // Do nothing
    }
    /** @internal */
    _freeze() {
        // Do nothing
    }
    /** @internal */
    _unFreeze() {
        // Do nothing
    }
    /**
     * Gets the current world matrix
     * @returns a Matrix
     */
    getWorldMatrix() {
        if (this._masterMesh && this.billboardMode === TransformNode.BILLBOARDMODE_NONE) {
            return this._masterMesh.getWorldMatrix();
        }
        return super.getWorldMatrix();
    }
    /** @internal */
    _getWorldMatrixDeterminant() {
        if (this._masterMesh) {
            return this._masterMesh._getWorldMatrixDeterminant();
        }
        return super._getWorldMatrixDeterminant();
    }
    /**
     * Gets a boolean indicating if this mesh is an instance or a regular mesh
     */
    get isAnInstance() {
        return false;
    }
    /**
     * Gets a boolean indicating if this mesh has instances
     */
    get hasInstances() {
        return false;
    }
    /**
     * Gets a boolean indicating if this mesh has thin instances
     */
    get hasThinInstances() {
        return false;
    }
    // ================================== Point of View Movement =================================
    /**
     * Perform relative position change from the point of view of behind the front of the mesh.
     * This is performed taking into account the meshes current rotation, so you do not have to care.
     * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
     * @param amountRight defines the distance on the right axis
     * @param amountUp defines the distance on the up axis
     * @param amountForward defines the distance on the forward axis
     * @returns the current mesh
     */
    movePOV(amountRight, amountUp, amountForward) {
        this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
        return this;
    }
    /**
     * Calculate relative position change from the point of view of behind the front of the mesh.
     * This is performed taking into account the meshes current rotation, so you do not have to care.
     * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
     * @param amountRight defines the distance on the right axis
     * @param amountUp defines the distance on the up axis
     * @param amountForward defines the distance on the forward axis
     * @returns the new displacement vector
     */
    calcMovePOV(amountRight, amountUp, amountForward) {
        const rotMatrix = new Matrix();
        const rotQuaternion = this.rotationQuaternion ? this.rotationQuaternion : Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
        rotQuaternion.toRotationMatrix(rotMatrix);
        const translationDelta = Vector3.Zero();
        const defForwardMult = this.definedFacingForward ? -1 : 1;
        Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, rotMatrix, translationDelta);
        return translationDelta;
    }
    // ================================== Point of View Rotation =================================
    /**
     * Perform relative rotation change from the point of view of behind the front of the mesh.
     * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
     * @param flipBack defines the flip
     * @param twirlClockwise defines the twirl
     * @param tiltRight defines the tilt
     * @returns the current mesh
     */
    rotatePOV(flipBack, twirlClockwise, tiltRight) {
        this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
        return this;
    }
    /**
     * Calculate relative rotation change from the point of view of behind the front of the mesh.
     * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
     * @param flipBack defines the flip
     * @param twirlClockwise defines the twirl
     * @param tiltRight defines the tilt
     * @returns the new rotation vector
     */
    calcRotatePOV(flipBack, twirlClockwise, tiltRight) {
        const defForwardMult = this.definedFacingForward ? 1 : -1;
        return new Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
    }
    /**
     * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
     * This means the mesh underlying bounding box and sphere are recomputed.
     * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
     * @param applyMorph  defines whether to apply the morph target before computing the bounding info
     * @returns the current mesh
     */
    refreshBoundingInfo(applySkeleton = false, applyMorph = false) {
        if (this._boundingInfo && this._boundingInfo.isLocked) {
            return this;
        }
        this._refreshBoundingInfo(this._getPositionData(applySkeleton, applyMorph), null);
        return this;
    }
    /**
     * @internal
     */
    _refreshBoundingInfo(data, bias) {
        if (data) {
            const extend = extractMinAndMax(data, 0, this.getTotalVertices(), bias);
            if (this._boundingInfo) {
                this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
            }
            else {
                this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
            }
        }
        if (this.subMeshes) {
            for (let index = 0; index < this.subMeshes.length; index++) {
                this.subMeshes[index].refreshBoundingInfo(data);
            }
        }
        this._updateBoundingInfo();
    }
    /**
     * Internal function to get buffer data and possibly apply morphs and normals
     * @param applySkeleton
     * @param applyMorph
     * @param data
     * @param kind the kind of data you want. Can be Normal or Position
     * @returns a FloatArray of the vertex data
     */
    _getData(applySkeleton = false, applyMorph = false, data, kind = VertexBuffer.PositionKind) {
        data = data ?? this.getVerticesData(kind).slice();
        if (data && applyMorph && this.morphTargetManager) {
            let faceIndexCount = 0;
            let positionIndex = 0;
            for (let vertexCount = 0; vertexCount < data.length; vertexCount++) {
                let value = data[vertexCount];
                for (let targetCount = 0; targetCount < this.morphTargetManager.numTargets; targetCount++) {
                    const targetMorph = this.morphTargetManager.getTarget(targetCount);
                    const influence = targetMorph.influence;
                    if (influence !== 0.0) {
                        let morphTargetData = null;
                        switch (kind) {
                            case VertexBuffer.PositionKind:
                                morphTargetData = targetMorph.getPositions();
                                break;
                            case VertexBuffer.NormalKind:
                                morphTargetData = targetMorph.getNormals();
                                break;
                            case VertexBuffer.TangentKind:
                                morphTargetData = targetMorph.getTangents();
                                break;
                            case VertexBuffer.UVKind:
                                morphTargetData = targetMorph.getUVs();
                                break;
                        }
                        if (morphTargetData) {
                            value += (morphTargetData[vertexCount] - data[vertexCount]) * influence;
                        }
                    }
                }
                data[vertexCount] = value;
                faceIndexCount++;
                if (kind === VertexBuffer.PositionKind) {
                    if (this._positions && faceIndexCount === 3) {
                        // We want to merge into positions every 3 indices starting (but not 0)
                        faceIndexCount = 0;
                        const index = positionIndex * 3;
                        this._positions[positionIndex++].copyFromFloats(data[index], data[index + 1], data[index + 2]);
                    }
                }
            }
        }
        if (data && applySkeleton && this.skeleton) {
            const matricesIndicesData = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
            const matricesWeightsData = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
            if (matricesWeightsData && matricesIndicesData) {
                const needExtras = this.numBoneInfluencers > 4;
                const matricesIndicesExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind) : null;
                const matricesWeightsExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind) : null;
                const skeletonMatrices = this.skeleton.getTransformMatrices(this);
                const tempVector = TmpVectors.Vector3[0];
                const finalMatrix = TmpVectors.Matrix[0];
                const tempMatrix = TmpVectors.Matrix[1];
                let matWeightIdx = 0;
                for (let index = 0; index < data.length; index += 3, matWeightIdx += 4) {
                    finalMatrix.reset();
                    let inf;
                    let weight;
                    for (inf = 0; inf < 4; inf++) {
                        weight = matricesWeightsData[matWeightIdx + inf];
                        if (weight > 0) {
                            Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesData[matWeightIdx + inf] * 16), weight, tempMatrix);
                            finalMatrix.addToSelf(tempMatrix);
                        }
                    }
                    if (needExtras) {
                        for (inf = 0; inf < 4; inf++) {
                            weight = matricesWeightsExtraData[matWeightIdx + inf];
                            if (weight > 0) {
                                Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesExtraData[matWeightIdx + inf] * 16), weight, tempMatrix);
                                finalMatrix.addToSelf(tempMatrix);
                            }
                        }
                    }
                    if (kind === VertexBuffer.NormalKind) {
                        Vector3.TransformNormalFromFloatsToRef(data[index], data[index + 1], data[index + 2], finalMatrix, tempVector);
                    }
                    else {
                        Vector3.TransformCoordinatesFromFloatsToRef(data[index], data[index + 1], data[index + 2], finalMatrix, tempVector);
                    }
                    tempVector.toArray(data, index);
                    if (kind === VertexBuffer.PositionKind && this._positions) {
                        this._positions[index / 3].copyFrom(tempVector);
                    }
                }
            }
        }
        return data;
    }
    /**
     * Get the normals vertex data and optionally apply skeleton and morphing.
     * @param applySkeleton defines whether to apply the skeleton
     * @param applyMorph  defines whether to apply the morph target
     * @returns the normals data
     */
    getNormalsData(applySkeleton = false, applyMorph = false) {
        return this._getData(applySkeleton, applyMorph, null, VertexBuffer.NormalKind);
    }
    /**
     * Get the position vertex data and optionally apply skeleton and morphing.
     * @param applySkeleton defines whether to apply the skeleton
     * @param applyMorph  defines whether to apply the morph target
     * @param data defines the position data to apply the skeleton and morph to
     * @returns the position data
     */
    getPositionData(applySkeleton = false, applyMorph = false, data) {
        return this._getData(applySkeleton, applyMorph, data, VertexBuffer.PositionKind);
    }
    /**
     * @internal
     */
    _getPositionData(applySkeleton, applyMorph) {
        let data = this.getVerticesData(VertexBuffer.PositionKind);
        if (this._internalAbstractMeshDataInfo._positions) {
            this._internalAbstractMeshDataInfo._positions = null;
        }
        if (data && ((applySkeleton && this.skeleton) || (applyMorph && this.morphTargetManager))) {
            data = data.slice();
            this._generatePointsArray();
            if (this._positions) {
                const pos = this._positions;
                this._internalAbstractMeshDataInfo._positions = new Array(pos.length);
                for (let i = 0; i < pos.length; i++) {
                    this._internalAbstractMeshDataInfo._positions[i] = pos[i]?.clone() || new Vector3();
                }
            }
            return this.getPositionData(applySkeleton, applyMorph, data);
        }
        return data;
    }
    /** @internal */
    _updateBoundingInfo() {
        if (this._boundingInfo) {
            this._boundingInfo.update(this.worldMatrixFromCache);
        }
        else {
            this._boundingInfo = new BoundingInfo(Vector3.Zero(), Vector3.Zero(), this.worldMatrixFromCache);
        }
        this._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
        return this;
    }
    /**
     * @internal
     */
    _updateSubMeshesBoundingInfo(matrix) {
        if (!this.subMeshes) {
            return this;
        }
        const count = this.subMeshes.length;
        for (let subIndex = 0; subIndex < count; subIndex++) {
            const subMesh = this.subMeshes[subIndex];
            if (count > 1 || !subMesh.IsGlobal) {
                subMesh.updateBoundingInfo(matrix);
            }
        }
        return this;
    }
    /** @internal */
    _afterComputeWorldMatrix() {
        if (this.doNotSyncBoundingInfo) {
            return;
        }
        // Bounding info
        this._boundingInfoIsDirty = true;
    }
    /**
     * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
     * A mesh is in the frustum if its bounding box intersects the frustum
     * @param frustumPlanes defines the frustum to test
     * @returns true if the mesh is in the frustum planes
     */
    isInFrustum(frustumPlanes) {
        return this.getBoundingInfo().isInFrustum(frustumPlanes, this.cullingStrategy);
    }
    /**
     * Returns `true` if the mesh is completely in the frustum defined be the passed array of planes.
     * A mesh is completely in the frustum if its bounding box it completely inside the frustum.
     * @param frustumPlanes defines the frustum to test
     * @returns true if the mesh is completely in the frustum planes
     */
    isCompletelyInFrustum(frustumPlanes) {
        return this.getBoundingInfo().isCompletelyInFrustum(frustumPlanes);
    }
    /**
     * True if the mesh intersects another mesh or a SolidParticle object
     * @param mesh defines a target mesh or SolidParticle to test
     * @param precise Unless the parameter `precise` is set to `true` the intersection is computed according to Axis Aligned Bounding Boxes (AABB), else according to OBB (Oriented BBoxes)
     * @param includeDescendants Can be set to true to test if the mesh defined in parameters intersects with the current mesh or any child meshes
     * @returns true if there is an intersection
     */
    intersectsMesh(mesh, precise = false, includeDescendants) {
        const boundingInfo = this.getBoundingInfo();
        const otherBoundingInfo = mesh.getBoundingInfo();
        if (boundingInfo.intersects(otherBoundingInfo, precise)) {
            return true;
        }
        if (includeDescendants) {
            for (const child of this.getChildMeshes()) {
                if (child.intersectsMesh(mesh, precise, true)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Returns true if the passed point (Vector3) is inside the mesh bounding box
     * @param point defines the point to test
     * @returns true if there is an intersection
     */
    intersectsPoint(point) {
        return this.getBoundingInfo().intersectsPoint(point);
    }
    // Collisions
    /**
     * Gets or sets a boolean indicating that this mesh can be used in the collision engine
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
     */
    get checkCollisions() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._checkCollisions;
    }
    set checkCollisions(collisionEnabled) {
        this._internalAbstractMeshDataInfo._meshCollisionData._checkCollisions = collisionEnabled;
    }
    /**
     * Gets Collider object used to compute collisions (not physics)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
     */
    get collider() {
        return this._internalAbstractMeshDataInfo._meshCollisionData._collider;
    }
    /**
     * Move the mesh using collision engine
     * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
     * @param displacement defines the requested displacement vector
     * @returns the current mesh
     */
    moveWithCollisions(displacement) {
        const globalPosition = this.getAbsolutePosition();
        globalPosition.addToRef(this.ellipsoidOffset, this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions);
        const coordinator = this.getScene().collisionCoordinator;
        if (!this._internalAbstractMeshDataInfo._meshCollisionData._collider) {
            this._internalAbstractMeshDataInfo._meshCollisionData._collider = coordinator.createCollider();
        }
        this._internalAbstractMeshDataInfo._meshCollisionData._collider._radius = this.ellipsoid;
        coordinator.getNewPosition(this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions, displacement, this._internalAbstractMeshDataInfo._meshCollisionData._collider, this.collisionRetryCount, this, this._onCollisionPositionChange, this.uniqueId);
        return this;
    }
    // Collisions
    /**
     * @internal
     */
    _collideForSubMesh(subMesh, transformMatrix, collider) {
        this._generatePointsArray();
        if (!this._positions) {
            return this;
        }
        // Transformation
        if (!subMesh._lastColliderWorldVertices || !subMesh._lastColliderTransformMatrix.equals(transformMatrix)) {
            subMesh._lastColliderTransformMatrix = transformMatrix.clone();
            subMesh._lastColliderWorldVertices = [];
            subMesh._trianglePlanes = [];
            const start = subMesh.verticesStart;
            const end = subMesh.verticesStart + subMesh.verticesCount;
            for (let i = start; i < end; i++) {
                subMesh._lastColliderWorldVertices.push(Vector3.TransformCoordinates(this._positions[i], transformMatrix));
            }
        }
        // Collide
        collider._collide(subMesh._trianglePlanes, subMesh._lastColliderWorldVertices, this.getIndices(), subMesh.indexStart, subMesh.indexStart + subMesh.indexCount, subMesh.verticesStart, !!subMesh.getMaterial(), this, this._shouldConvertRHS(), subMesh.getMaterial()?.fillMode === 7);
        return this;
    }
    /**
     * @internal
     */
    _processCollisionsForSubMeshes(collider, transformMatrix) {
        const subMeshes = this._scene.getCollidingSubMeshCandidates(this, collider);
        const len = subMeshes.length;
        for (let index = 0; index < len; index++) {
            const subMesh = subMeshes.data[index];
            // Bounding test
            if (len > 1 && !subMesh._checkCollision(collider)) {
                continue;
            }
            this._collideForSubMesh(subMesh, transformMatrix, collider);
        }
        return this;
    }
    /** @internal */
    _shouldConvertRHS() {
        return false;
    }
    /**
     * @internal
     */
    _checkCollision(collider) {
        // Bounding box test
        if (!this.getBoundingInfo()._checkCollision(collider)) {
            return this;
        }
        // Transformation matrix
        const collisionsScalingMatrix = TmpVectors.Matrix[0];
        const collisionsTransformMatrix = TmpVectors.Matrix[1];
        Matrix.ScalingToRef(1.0 / collider._radius.x, 1.0 / collider._radius.y, 1.0 / collider._radius.z, collisionsScalingMatrix);
        this.worldMatrixFromCache.multiplyToRef(collisionsScalingMatrix, collisionsTransformMatrix);
        this._processCollisionsForSubMeshes(collider, collisionsTransformMatrix);
        return this;
    }
    // Picking
    /** @internal */
    _generatePointsArray() {
        return false;
    }
    /**
     * Checks if the passed Ray intersects with the mesh. A mesh triangle can be picked both from its front and back sides,
     * irrespective of orientation.
     * @param ray defines the ray to use. It should be in the mesh's LOCAL coordinate space.
     * @param fastCheck defines if fast mode (but less precise) must be used (false by default)
     * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
     * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
     * @param worldToUse defines the world matrix to use to get the world coordinate of the intersection point
     * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
     * @returns the picking info
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/mesh_intersect
     */
    intersects(ray, fastCheck, trianglePredicate, onlyBoundingInfo = false, worldToUse, skipBoundingInfo = false) {
        const pickingInfo = new PickingInfo();
        const className = this.getClassName();
        const intersectionThreshold = className === "InstancedLinesMesh" || className === "LinesMesh" || className === "GreasedLineMesh" ? this.intersectionThreshold : 0;
        const boundingInfo = this.getBoundingInfo();
        if (!this.subMeshes) {
            return pickingInfo;
        }
        if (!skipBoundingInfo &&
            (!ray.intersectsSphere(boundingInfo.boundingSphere, intersectionThreshold) || !ray.intersectsBox(boundingInfo.boundingBox, intersectionThreshold))) {
            return pickingInfo;
        }
        if (onlyBoundingInfo) {
            pickingInfo.hit = skipBoundingInfo ? false : true;
            pickingInfo.pickedMesh = skipBoundingInfo ? null : this;
            pickingInfo.distance = skipBoundingInfo ? 0 : Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
            pickingInfo.subMeshId = 0;
            return pickingInfo;
        }
        if (!this._generatePointsArray()) {
            return pickingInfo;
        }
        let intersectInfo = null;
        const subMeshes = this._scene.getIntersectingSubMeshCandidates(this, ray);
        const len = subMeshes.length;
        // Check if all submeshes are using a material that don't allow picking (point/lines rendering)
        // if no submesh can be picked that way, then fallback to BBox picking
        let anySubmeshSupportIntersect = false;
        for (let index = 0; index < len; index++) {
            const subMesh = subMeshes.data[index];
            const material = subMesh.getMaterial();
            if (!material) {
                continue;
            }
            if (material.fillMode == 7 ||
                material.fillMode == 0 ||
                material.fillMode == 1 ||
                material.fillMode == 2 ||
                material.fillMode == 4) {
                anySubmeshSupportIntersect = true;
                break;
            }
        }
        // no sub mesh support intersection, fallback to BBox that has already be done
        if (!anySubmeshSupportIntersect) {
            pickingInfo.hit = true;
            pickingInfo.pickedMesh = this;
            pickingInfo.distance = Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
            pickingInfo.subMeshId = -1;
            return pickingInfo;
        }
        // at least 1 submesh supports intersection, keep going
        for (let index = 0; index < len; index++) {
            const subMesh = subMeshes.data[index];
            // Bounding test
            if (len > 1 && !skipBoundingInfo && !subMesh.canIntersects(ray)) {
                continue;
            }
            const currentIntersectInfo = subMesh.intersects(ray, this._positions, this.getIndices(), fastCheck, trianglePredicate);
            if (currentIntersectInfo) {
                if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
                    intersectInfo = currentIntersectInfo;
                    intersectInfo.subMeshId = index;
                    if (fastCheck) {
                        break;
                    }
                }
            }
        }
        if (intersectInfo) {
            // Get picked point
            const world = worldToUse ?? this.getWorldMatrix();
            const worldOrigin = TmpVectors.Vector3[0];
            const direction = TmpVectors.Vector3[1];
            Vector3.TransformCoordinatesToRef(ray.origin, world, worldOrigin);
            ray.direction.scaleToRef(intersectInfo.distance, direction);
            const worldDirection = Vector3.TransformNormal(direction, world);
            const pickedPoint = worldDirection.addInPlace(worldOrigin);
            // Return result
            pickingInfo.hit = true;
            pickingInfo.distance = Vector3.Distance(worldOrigin, pickedPoint);
            pickingInfo.pickedPoint = pickedPoint;
            pickingInfo.pickedMesh = this;
            pickingInfo.bu = intersectInfo.bu || 0;
            pickingInfo.bv = intersectInfo.bv || 0;
            pickingInfo.subMeshFaceId = intersectInfo.faceId;
            pickingInfo.faceId = intersectInfo.faceId + subMeshes.data[intersectInfo.subMeshId].indexStart / (this.getClassName().indexOf("LinesMesh") !== -1 ? 2 : 3);
            pickingInfo.subMeshId = intersectInfo.subMeshId;
            return pickingInfo;
        }
        return pickingInfo;
    }
    /**
     * Clones the current mesh
     * @param name defines the mesh name
     * @param newParent defines the new mesh parent
     * @param doNotCloneChildren defines a boolean indicating that children must not be cloned (false by default)
     * @returns the new mesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    clone(name, newParent, doNotCloneChildren) {
        return null;
    }
    /**
     * Disposes all the submeshes of the current meshnp
     * @returns the current mesh
     */
    releaseSubMeshes() {
        if (this.subMeshes) {
            while (this.subMeshes.length) {
                this.subMeshes[0].dispose();
            }
        }
        else {
            this.subMeshes = [];
        }
        return this;
    }
    /**
     * Releases resources associated with this abstract mesh.
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    dispose(doNotRecurse, disposeMaterialAndTextures = false) {
        let index;
        const scene = this.getScene();
        // mesh map release.
        if (this._scene.useMaterialMeshMap) {
            // remove from material mesh map id needed
            if (this._internalAbstractMeshDataInfo._material && this._internalAbstractMeshDataInfo._material.meshMap) {
                this._internalAbstractMeshDataInfo._material.meshMap[this.uniqueId] = undefined;
            }
        }
        // Smart Array Retainers.
        scene.freeActiveMeshes();
        scene.freeRenderingGroups();
        if (scene.renderingManager.maintainStateBetweenFrames) {
            scene.renderingManager.restoreDispachedFlags();
        }
        // Action manager
        if (this.actionManager !== undefined && this.actionManager !== null) {
            // If it's the only mesh using the action manager, dispose of it.
            if (!this._scene.meshes.some((m) => m !== this && m.actionManager === this.actionManager)) {
                this.actionManager.dispose();
            }
            this.actionManager = null;
        }
        // Skeleton
        this._internalAbstractMeshDataInfo._skeleton = null;
        if (this._transformMatrixTexture) {
            this._transformMatrixTexture.dispose();
            this._transformMatrixTexture = null;
        }
        // Intersections in progress
        for (index = 0; index < this._intersectionsInProgress.length; index++) {
            const other = this._intersectionsInProgress[index];
            const pos = other._intersectionsInProgress.indexOf(this);
            other._intersectionsInProgress.splice(pos, 1);
        }
        this._intersectionsInProgress.length = 0;
        // Lights
        const lights = scene.lights;
        lights.forEach((light) => {
            let meshIndex = light.includedOnlyMeshes.indexOf(this);
            if (meshIndex !== -1) {
                light.includedOnlyMeshes.splice(meshIndex, 1);
            }
            meshIndex = light.excludedMeshes.indexOf(this);
            if (meshIndex !== -1) {
                light.excludedMeshes.splice(meshIndex, 1);
            }
            // Shadow generators
            const generators = light.getShadowGenerators();
            if (generators) {
                const iterator = generators.values();
                for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
                    const generator = key.value;
                    const shadowMap = generator.getShadowMap();
                    if (shadowMap && shadowMap.renderList) {
                        meshIndex = shadowMap.renderList.indexOf(this);
                        if (meshIndex !== -1) {
                            shadowMap.renderList.splice(meshIndex, 1);
                        }
                    }
                }
            }
        });
        // SubMeshes
        if (this.getClassName() !== "InstancedMesh" || this.getClassName() !== "InstancedLinesMesh") {
            this.releaseSubMeshes();
        }
        // Query
        const engine = scene.getEngine();
        if (this._occlusionQuery !== null) {
            this.isOcclusionQueryInProgress = false;
            engine.deleteQuery(this._occlusionQuery);
            this._occlusionQuery = null;
        }
        // Engine
        engine.wipeCaches();
        // Remove from scene
        scene.removeMesh(this);
        if (this._parentContainer) {
            const index = this._parentContainer.meshes.indexOf(this);
            if (index > -1) {
                this._parentContainer.meshes.splice(index, 1);
            }
            this._parentContainer = null;
        }
        if (disposeMaterialAndTextures) {
            if (this.material) {
                if (this.material.getClassName() === "MultiMaterial") {
                    this.material.dispose(false, true, true);
                }
                else {
                    this.material.dispose(false, true);
                }
            }
        }
        if (!doNotRecurse) {
            // Particles
            for (index = 0; index < scene.particleSystems.length; index++) {
                if (scene.particleSystems[index].emitter === this) {
                    scene.particleSystems[index].dispose();
                    index--;
                }
            }
        }
        // facet data
        if (this._internalAbstractMeshDataInfo._facetData.facetDataEnabled) {
            this.disableFacetData();
        }
        this._uniformBuffer.dispose();
        this.onAfterWorldMatrixUpdateObservable.clear();
        this.onCollideObservable.clear();
        this.onCollisionPositionChangeObservable.clear();
        this.onRebuildObservable.clear();
        super.dispose(doNotRecurse, disposeMaterialAndTextures);
    }
    /**
     * Adds the passed mesh as a child to the current mesh
     * @param mesh defines the child mesh
     * @param preserveScalingSign if true, keep scaling sign of child. Otherwise, scaling sign might change.
     * @returns the current mesh
     */
    addChild(mesh, preserveScalingSign = false) {
        mesh.setParent(this, preserveScalingSign);
        return this;
    }
    /**
     * Removes the passed mesh from the current mesh children list
     * @param mesh defines the child mesh
     * @param preserveScalingSign if true, keep scaling sign of child. Otherwise, scaling sign might change.
     * @returns the current mesh
     */
    removeChild(mesh, preserveScalingSign = false) {
        mesh.setParent(null, preserveScalingSign);
        return this;
    }
    // Facet data
    /** @internal */
    _initFacetData() {
        const data = this._internalAbstractMeshDataInfo._facetData;
        if (!data.facetNormals) {
            data.facetNormals = [];
        }
        if (!data.facetPositions) {
            data.facetPositions = [];
        }
        if (!data.facetPartitioning) {
            data.facetPartitioning = new Array();
        }
        data.facetNb = (this.getIndices().length / 3) | 0;
        data.partitioningSubdivisions = data.partitioningSubdivisions ? data.partitioningSubdivisions : 10; // default nb of partitioning subdivisions = 10
        data.partitioningBBoxRatio = data.partitioningBBoxRatio ? data.partitioningBBoxRatio : 1.01; // default ratio 1.01 = the partitioning is 1% bigger than the bounding box
        for (let f = 0; f < data.facetNb; f++) {
            data.facetNormals[f] = Vector3.Zero();
            data.facetPositions[f] = Vector3.Zero();
        }
        data.facetDataEnabled = true;
        return this;
    }
    /**
     * Updates the mesh facetData arrays and the internal partitioning when the mesh is morphed or updated.
     * This method can be called within the render loop.
     * You don't need to call this method by yourself in the render loop when you update/morph a mesh with the methods CreateXXX() as they automatically manage this computation
     * @returns the current mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    updateFacetData() {
        const data = this._internalAbstractMeshDataInfo._facetData;
        if (!data.facetDataEnabled) {
            this._initFacetData();
        }
        const positions = this.getVerticesData(VertexBuffer.PositionKind);
        const indices = this.getIndices();
        const normals = this.getVerticesData(VertexBuffer.NormalKind);
        const bInfo = this.getBoundingInfo();
        if (data.facetDepthSort && !data.facetDepthSortEnabled) {
            // init arrays, matrix and sort function on first call
            data.facetDepthSortEnabled = true;
            if (indices instanceof Uint16Array) {
                data.depthSortedIndices = new Uint16Array(indices);
            }
            else if (indices instanceof Uint32Array) {
                data.depthSortedIndices = new Uint32Array(indices);
            }
            else {
                let needs32bits = false;
                for (let i = 0; i < indices.length; i++) {
                    if (indices[i] > 65535) {
                        needs32bits = true;
                        break;
                    }
                }
                if (needs32bits) {
                    data.depthSortedIndices = new Uint32Array(indices);
                }
                else {
                    data.depthSortedIndices = new Uint16Array(indices);
                }
            }
            data.facetDepthSortFunction = function (f1, f2) {
                return f2.sqDistance - f1.sqDistance;
            };
            if (!data.facetDepthSortFrom) {
                const camera = this.getScene().activeCamera;
                data.facetDepthSortFrom = camera ? camera.position : Vector3.Zero();
            }
            data.depthSortedFacets = [];
            for (let f = 0; f < data.facetNb; f++) {
                const depthSortedFacet = { ind: f * 3, sqDistance: 0.0 };
                data.depthSortedFacets.push(depthSortedFacet);
            }
            data.invertedMatrix = Matrix.Identity();
            data.facetDepthSortOrigin = Vector3.Zero();
        }
        data.bbSize.x = bInfo.maximum.x - bInfo.minimum.x > Epsilon ? bInfo.maximum.x - bInfo.minimum.x : Epsilon;
        data.bbSize.y = bInfo.maximum.y - bInfo.minimum.y > Epsilon ? bInfo.maximum.y - bInfo.minimum.y : Epsilon;
        data.bbSize.z = bInfo.maximum.z - bInfo.minimum.z > Epsilon ? bInfo.maximum.z - bInfo.minimum.z : Epsilon;
        let bbSizeMax = data.bbSize.x > data.bbSize.y ? data.bbSize.x : data.bbSize.y;
        bbSizeMax = bbSizeMax > data.bbSize.z ? bbSizeMax : data.bbSize.z;
        data.subDiv.max = data.partitioningSubdivisions;
        data.subDiv.X = Math.floor((data.subDiv.max * data.bbSize.x) / bbSizeMax); // adjust the number of subdivisions per axis
        data.subDiv.Y = Math.floor((data.subDiv.max * data.bbSize.y) / bbSizeMax); // according to each bbox size per axis
        data.subDiv.Z = Math.floor((data.subDiv.max * data.bbSize.z) / bbSizeMax);
        data.subDiv.X = data.subDiv.X < 1 ? 1 : data.subDiv.X; // at least one subdivision
        data.subDiv.Y = data.subDiv.Y < 1 ? 1 : data.subDiv.Y;
        data.subDiv.Z = data.subDiv.Z < 1 ? 1 : data.subDiv.Z;
        // set the parameters for ComputeNormals()
        data.facetParameters.facetNormals = this.getFacetLocalNormals();
        data.facetParameters.facetPositions = this.getFacetLocalPositions();
        data.facetParameters.facetPartitioning = this.getFacetLocalPartitioning();
        data.facetParameters.bInfo = bInfo;
        data.facetParameters.bbSize = data.bbSize;
        data.facetParameters.subDiv = data.subDiv;
        data.facetParameters.ratio = this.partitioningBBoxRatio;
        data.facetParameters.depthSort = data.facetDepthSort;
        if (data.facetDepthSort && data.facetDepthSortEnabled) {
            this.computeWorldMatrix(true);
            this._worldMatrix.invertToRef(data.invertedMatrix);
            Vector3.TransformCoordinatesToRef(data.facetDepthSortFrom, data.invertedMatrix, data.facetDepthSortOrigin);
            data.facetParameters.distanceTo = data.facetDepthSortOrigin;
        }
        data.facetParameters.depthSortedFacets = data.depthSortedFacets;
        if (normals) {
            VertexData.ComputeNormals(positions, indices, normals, data.facetParameters);
        }
        if (data.facetDepthSort && data.facetDepthSortEnabled) {
            data.depthSortedFacets.sort(data.facetDepthSortFunction);
            const l = (data.depthSortedIndices.length / 3) | 0;
            for (let f = 0; f < l; f++) {
                const sind = data.depthSortedFacets[f].ind;
                data.depthSortedIndices[f * 3] = indices[sind];
                data.depthSortedIndices[f * 3 + 1] = indices[sind + 1];
                data.depthSortedIndices[f * 3 + 2] = indices[sind + 2];
            }
            this.updateIndices(data.depthSortedIndices, undefined, true);
        }
        return this;
    }
    /**
     * Returns the facetLocalNormals array.
     * The normals are expressed in the mesh local spac
     * @returns an array of Vector3
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetLocalNormals() {
        const facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetNormals) {
            this.updateFacetData();
        }
        return facetData.facetNormals;
    }
    /**
     * Returns the facetLocalPositions array.
     * The facet positions are expressed in the mesh local space
     * @returns an array of Vector3
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetLocalPositions() {
        const facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetPositions) {
            this.updateFacetData();
        }
        return facetData.facetPositions;
    }
    /**
     * Returns the facetLocalPartitioning array
     * @returns an array of array of numbers
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetLocalPartitioning() {
        const facetData = this._internalAbstractMeshDataInfo._facetData;
        if (!facetData.facetPartitioning) {
            this.updateFacetData();
        }
        return facetData.facetPartitioning;
    }
    /**
     * Returns the i-th facet position in the world system.
     * This method allocates a new Vector3 per call
     * @param i defines the facet index
     * @returns a new Vector3
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetPosition(i) {
        const pos = Vector3.Zero();
        this.getFacetPositionToRef(i, pos);
        return pos;
    }
    /**
     * Sets the reference Vector3 with the i-th facet position in the world system
     * @param i defines the facet index
     * @param ref defines the target vector
     * @returns the current mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetPositionToRef(i, ref) {
        const localPos = this.getFacetLocalPositions()[i];
        const world = this.getWorldMatrix();
        Vector3.TransformCoordinatesToRef(localPos, world, ref);
        return this;
    }
    /**
     * Returns the i-th facet normal in the world system.
     * This method allocates a new Vector3 per call
     * @param i defines the facet index
     * @returns a new Vector3
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetNormal(i) {
        const norm = Vector3.Zero();
        this.getFacetNormalToRef(i, norm);
        return norm;
    }
    /**
     * Sets the reference Vector3 with the i-th facet normal in the world system
     * @param i defines the facet index
     * @param ref defines the target vector
     * @returns the current mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetNormalToRef(i, ref) {
        const localNorm = this.getFacetLocalNormals()[i];
        Vector3.TransformNormalToRef(localNorm, this.getWorldMatrix(), ref);
        return this;
    }
    /**
     * Returns the facets (in an array) in the same partitioning block than the one the passed coordinates are located (expressed in the mesh local system)
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @returns the array of facet indexes
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetsAtLocalCoordinates(x, y, z) {
        const bInfo = this.getBoundingInfo();
        const data = this._internalAbstractMeshDataInfo._facetData;
        const ox = Math.floor(((x - bInfo.minimum.x * data.partitioningBBoxRatio) * data.subDiv.X * data.partitioningBBoxRatio) / data.bbSize.x);
        const oy = Math.floor(((y - bInfo.minimum.y * data.partitioningBBoxRatio) * data.subDiv.Y * data.partitioningBBoxRatio) / data.bbSize.y);
        const oz = Math.floor(((z - bInfo.minimum.z * data.partitioningBBoxRatio) * data.subDiv.Z * data.partitioningBBoxRatio) / data.bbSize.z);
        if (ox < 0 || ox > data.subDiv.max || oy < 0 || oy > data.subDiv.max || oz < 0 || oz > data.subDiv.max) {
            return null;
        }
        return data.facetPartitioning[ox + data.subDiv.max * oy + data.subDiv.max * data.subDiv.max * oz];
    }
    /**
     * Returns the closest mesh facet index at (x,y,z) World coordinates, null if not found
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @param projected sets as the (x,y,z) world projection on the facet
     * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
     * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
     * @returns the face index if found (or null instead)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getClosestFacetAtCoordinates(x, y, z, projected, checkFace = false, facing = true) {
        const world = this.getWorldMatrix();
        const invMat = TmpVectors.Matrix[5];
        world.invertToRef(invMat);
        const invVect = TmpVectors.Vector3[8];
        Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, invMat, invVect); // transform (x,y,z) to coordinates in the mesh local space
        const closest = this.getClosestFacetAtLocalCoordinates(invVect.x, invVect.y, invVect.z, projected, checkFace, facing);
        if (projected) {
            // transform the local computed projected vector to world coordinates
            Vector3.TransformCoordinatesFromFloatsToRef(projected.x, projected.y, projected.z, world, projected);
        }
        return closest;
    }
    /**
     * Returns the closest mesh facet index at (x,y,z) local coordinates, null if not found
     * @param x defines x coordinate
     * @param y defines y coordinate
     * @param z defines z coordinate
     * @param projected sets as the (x,y,z) local projection on the facet
     * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
     * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
     * @returns the face index if found (or null instead)
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getClosestFacetAtLocalCoordinates(x, y, z, projected, checkFace = false, facing = true) {
        let closest = null;
        let tmpx = 0.0;
        let tmpy = 0.0;
        let tmpz = 0.0;
        let d = 0.0; // tmp dot facet normal * facet position
        let t0 = 0.0;
        let projx = 0.0;
        let projy = 0.0;
        let projz = 0.0;
        // Get all the facets in the same partitioning block than (x, y, z)
        const facetPositions = this.getFacetLocalPositions();
        const facetNormals = this.getFacetLocalNormals();
        const facetsInBlock = this.getFacetsAtLocalCoordinates(x, y, z);
        if (!facetsInBlock) {
            return null;
        }
        // Get the closest facet to (x, y, z)
        let shortest = Number.MAX_VALUE; // init distance vars
        let tmpDistance = shortest;
        let fib; // current facet in the block
        let norm; // current facet normal
        let p0; // current facet barycenter position
        // loop on all the facets in the current partitioning block
        for (let idx = 0; idx < facetsInBlock.length; idx++) {
            fib = facetsInBlock[idx];
            norm = facetNormals[fib];
            p0 = facetPositions[fib];
            d = (x - p0.x) * norm.x + (y - p0.y) * norm.y + (z - p0.z) * norm.z;
            if (!checkFace || (checkFace && facing && d >= 0.0) || (checkFace && !facing && d <= 0.0)) {
                // compute (x,y,z) projection on the facet = (projx, projy, projz)
                d = norm.x * p0.x + norm.y * p0.y + norm.z * p0.z;
                t0 = -(norm.x * x + norm.y * y + norm.z * z - d) / (norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
                projx = x + norm.x * t0;
                projy = y + norm.y * t0;
                projz = z + norm.z * t0;
                tmpx = projx - x;
                tmpy = projy - y;
                tmpz = projz - z;
                tmpDistance = tmpx * tmpx + tmpy * tmpy + tmpz * tmpz; // compute length between (x, y, z) and its projection on the facet
                if (tmpDistance < shortest) {
                    // just keep the closest facet to (x, y, z)
                    shortest = tmpDistance;
                    closest = fib;
                    if (projected) {
                        projected.x = projx;
                        projected.y = projy;
                        projected.z = projz;
                    }
                }
            }
        }
        return closest;
    }
    /**
     * Returns the object "parameter" set with all the expected parameters for facetData computation by ComputeNormals()
     * @returns the parameters
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    getFacetDataParameters() {
        return this._internalAbstractMeshDataInfo._facetData.facetParameters;
    }
    /**
     * Disables the feature FacetData and frees the related memory
     * @returns the current mesh
     * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
     */
    disableFacetData() {
        const facetData = this._internalAbstractMeshDataInfo._facetData;
        if (facetData.facetDataEnabled) {
            facetData.facetDataEnabled = false;
            facetData.facetPositions = [];
            facetData.facetNormals = [];
            facetData.facetPartitioning = new Array();
            facetData.facetParameters = null;
            facetData.depthSortedIndices = new Uint32Array(0);
        }
        return this;
    }
    /**
     * Updates the AbstractMesh indices array
     * @param indices defines the data source
     * @param offset defines the offset in the index buffer where to store the new data (can be null)
     * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
     * @returns the current mesh
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateIndices(indices, offset, gpuMemoryOnly = false) {
        return this;
    }
    /**
     * Creates new normals data for the mesh
     * @param updatable defines if the normal vertex buffer must be flagged as updatable
     * @returns the current mesh
     */
    createNormals(updatable) {
        const positions = this.getVerticesData(VertexBuffer.PositionKind);
        const indices = this.getIndices();
        let normals;
        if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
            normals = this.getVerticesData(VertexBuffer.NormalKind);
        }
        else {
            normals = [];
        }
        VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: this.getScene().useRightHandedSystem });
        this.setVerticesData(VertexBuffer.NormalKind, normals, updatable);
        return this;
    }
    /**
     * Align the mesh with a normal
     * @param normal defines the normal to use
     * @param upDirection can be used to redefined the up vector to use (will use the (0, 1, 0) by default)
     * @returns the current mesh
     */
    alignWithNormal(normal, upDirection) {
        if (!upDirection) {
            upDirection = Axis.Y;
        }
        const axisX = TmpVectors.Vector3[0];
        const axisZ = TmpVectors.Vector3[1];
        Vector3.CrossToRef(upDirection, normal, axisZ);
        Vector3.CrossToRef(normal, axisZ, axisX);
        if (this.rotationQuaternion) {
            Quaternion.RotationQuaternionFromAxisToRef(axisX, normal, axisZ, this.rotationQuaternion);
        }
        else {
            Vector3.RotationFromAxisToRef(axisX, normal, axisZ, this.rotation);
        }
        return this;
    }
    /** @internal */
    _checkOcclusionQuery() {
        // Will be replaced by correct code if Occlusion queries are referenced
        return false;
    }
    // eslint-disable-next-line jsdoc/require-returns-check
    /**
     * Disables the mesh edge rendering mode
     * @returns the currentAbstractMesh
     */
    disableEdgesRendering() {
        throw _WarnImport("EdgesRenderer");
    }
    // eslint-disable-next-line jsdoc/require-returns-check
    /**
     * Enables the edge rendering mode on the mesh.
     * This mode makes the mesh edges visible
     * @param epsilon defines the maximal distance between two angles to detect a face
     * @param checkVerticesInsteadOfIndices indicates that we should check vertex list directly instead of faces
     * @param options options to the edge renderer
     * @returns the currentAbstractMesh
     * @see https://www.babylonjs-playground.com/#19O9TU#0
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enableEdgesRendering(epsilon, checkVerticesInsteadOfIndices, options) {
        throw _WarnImport("EdgesRenderer");
    }
    /**
     * This function returns all of the particle systems in the scene that use the mesh as an emitter.
     * @returns an array of particle systems in the scene that use the mesh as an emitter
     */
    getConnectedParticleSystems() {
        return this._scene.particleSystems.filter((particleSystem) => particleSystem.emitter === this);
    }
}
/** No occlusion */
AbstractMesh.OCCLUSION_TYPE_NONE = 0;
/** Occlusion set to optimistic */
AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC = 1;
/** Occlusion set to strict */
AbstractMesh.OCCLUSION_TYPE_STRICT = 2;
/** Use an accurate occlusion algorithm */
AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE = 0;
/** Use a conservative occlusion algorithm */
AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE = 1;
/** Default culling strategy : this is an exclusion test and it's the more accurate.
 *  Test order :
 *  Is the bounding sphere outside the frustum ?
 *  If not, are the bounding box vertices outside the frustum ?
 *  It not, then the cullable object is in the frustum.
 */
AbstractMesh.CULLINGSTRATEGY_STANDARD = 0;
/** Culling strategy : Bounding Sphere Only.
 *  This is an exclusion test. It's faster than the standard strategy because the bounding box is not tested.
 *  It's also less accurate than the standard because some not visible objects can still be selected.
 *  Test : is the bounding sphere outside the frustum ?
 *  If not, then the cullable object is in the frustum.
 */
AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
/** Culling strategy : Optimistic Inclusion.
 *  This in an inclusion test first, then the standard exclusion test.
 *  This can be faster when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the standard test when the tested object center is not the frustum but one of its bounding box vertex is still inside.
 *  Anyway, it's as accurate as the standard strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the default culling strategy.
 */
AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
/** Culling strategy : Optimistic Inclusion then Bounding Sphere Only.
 *  This in an inclusion test first, then the bounding sphere only exclusion test.
 *  This can be the fastest test when a cullable object is expected to be almost always in the camera frustum.
 *  This could also be a little slower than the BoundingSphereOnly strategy when the tested object center is not in the frustum but its bounding sphere still intersects it.
 *  It's less accurate than the standard strategy and as accurate as the BoundingSphereOnly strategy.
 *  Test :
 *  Is the cullable object bounding sphere center in the frustum ?
 *  If not, apply the Bounding Sphere Only strategy. No Bounding Box is tested here.
 */
AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
RegisterClass("BABYLON.AbstractMesh", AbstractMesh);
//# sourceMappingURL=abstractMesh.js.map