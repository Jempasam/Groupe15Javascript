import { AbstractScene } from "./abstractScene";
import type { Scene } from "./scene";
import { Mesh } from "./Meshes/mesh";
import type { Skeleton } from "./Bones/skeleton";
import type { AnimationGroup } from "./Animations/animationGroup";
import type { Animatable } from "./Animations/animatable";
import type { Nullable } from "./types";
import type { Node } from "./node";
/**
 * Set of assets to keep when moving a scene into an asset container.
 */
export declare class KeepAssets extends AbstractScene {
}
/**
 * Class used to store the output of the AssetContainer.instantiateAllMeshesToScene function
 */
export declare class InstantiatedEntries {
    /**
     * List of new root nodes (eg. nodes with no parent)
     */
    rootNodes: Node[];
    /**
     * List of new skeletons
     */
    skeletons: Skeleton[];
    /**
     * List of new animation groups
     */
    animationGroups: AnimationGroup[];
    /**
     * Disposes the instantiated entries from the scene
     */
    dispose(): void;
}
/**
 * Container with a set of assets that can be added or removed from a scene.
 */
export declare class AssetContainer extends AbstractScene {
    private _wasAddedToScene;
    private _onContextRestoredObserver;
    /**
     * The scene the AssetContainer belongs to.
     */
    scene: Scene;
    /**
     * Instantiates an AssetContainer.
     * @param scene The scene the AssetContainer belongs to.
     */
    constructor(scene?: Nullable<Scene>);
    /**
     * Given a list of nodes, return a topological sorting of them.
     * @param nodes
     * @returns a sorted array of nodes
     */
    private _topologicalSort;
    private _addNodeAndDescendantsToList;
    /**
     * Check if a specific node is contained in this asset container.
     * @param node the node to check
     * @returns true if the node is contained in this container, otherwise false.
     */
    private _isNodeInContainer;
    /**
     * For every node in the scene, check if its parent node is also in the scene.
     * @returns true if every node's parent is also in the scene, otherwise false.
     */
    private _isValidHierarchy;
    /**
     * Instantiate or clone all meshes and add the new ones to the scene.
     * Skeletons and animation groups will all be cloned
     * @param nameFunction defines an optional function used to get new names for clones
     * @param cloneMaterials defines an optional boolean that defines if materials must be cloned as well (false by default)
     * @param options defines an optional list of options to control how to instantiate / clone models
     * @param options.doNotInstantiate defines if the model must be instantiated or just cloned
     * @param options.predicate defines a predicate used to filter whih mesh to instantiate/clone
     * @returns a list of rootNodes, skeletons and animation groups that were duplicated
     */
    instantiateModelsToScene(nameFunction?: (sourceName: string) => string, cloneMaterials?: boolean, options?: {
        doNotInstantiate?: boolean | ((node: Node) => boolean);
        predicate?: (entity: any) => boolean;
    }): InstantiatedEntries;
    /**
     * Adds all the assets from the container to the scene.
     */
    addAllToScene(): void;
    /**
     * Adds assets from the container to the scene.
     * @param predicate defines a predicate used to select which entity will be added (can be null)
     */
    addToScene(predicate?: Nullable<(entity: any) => boolean>): void;
    /**
     * Removes all the assets in the container from the scene
     */
    removeAllFromScene(): void;
    /**
     * Removes assets in the container from the scene
     * @param predicate defines a predicate used to select which entity will be added (can be null)
     */
    removeFromScene(predicate?: Nullable<(entity: any) => boolean>): void;
    /**
     * Disposes all the assets in the container
     */
    dispose(): void;
    private _moveAssets;
    /**
     * Removes all the assets contained in the scene and adds them to the container.
     * @param keepAssets Set of assets to keep in the scene. (default: empty)
     */
    moveAllFromScene(keepAssets?: KeepAssets): void;
    /**
     * Adds all meshes in the asset container to a root mesh that can be used to position all the contained meshes. The root mesh is then added to the front of the meshes in the assetContainer.
     * @returns the root mesh
     */
    createRootMesh(): Mesh;
    /**
     * Merge animations (direct and animation groups) from this asset container into a scene
     * @param scene is the instance of BABYLON.Scene to append to (default: last created scene)
     * @param animatables set of animatables to retarget to a node from the scene
     * @param targetConverter defines a function used to convert animation targets from the asset container to the scene (default: search node by name)
     * @returns an array of the new AnimationGroup added to the scene (empty array if none)
     */
    mergeAnimationsTo(scene: Nullable<Scene> | undefined, animatables: Animatable[], targetConverter?: Nullable<(target: any) => Nullable<Node>>): AnimationGroup[];
    /**
     * @since 6.15.0
     * This method checks for any node that has no parent
     * and is not in the rootNodes array, and adds the node
     * there, if so.
     */
    populateRootNodes(): void;
    /**
     * @since 6.26.0
     * Given a root asset, this method will traverse its hierarchy and add it, its children and any materials/skeletons/animation groups to the container.
     * @param root root node
     */
    addAllAssetsToContainer(root: Node): void;
}
