import { Observable } from "../../Misc/observable";
import type { Nullable } from "../../types";
import { Mesh } from "../mesh";
import type { Scene } from "../../scene";
import { GeometryOutputBlock } from "./Blocks/geometryOutputBlock";
import type { NodeGeometryBlock } from "./nodeGeometryBlock";
import type { GeometryInputBlock } from "./Blocks/geometryInputBlock";
import type { Color4 } from "../../Maths/math.color";
/**
 * Interface used to configure the node geometry editor
 */
export interface INodeGeometryEditorOptions {
    /** Define the URL to load node editor script from */
    editorURL?: string;
    /** Additional configuration for the NGE */
    nodeGeometryEditorConfig?: {
        backgroundColor?: Color4;
        hostScene?: Scene;
        hostMesh?: Mesh;
    };
}
/**
 * Defines a node based geometry
 * @see demo at https://playground.babylonjs.com#PYY6XE#69
 */
export declare class NodeGeometry {
    private static _BuildIdGenerator;
    private _buildId;
    private _buildWasSuccessful;
    private _vertexData;
    private _buildExecutionTime;
    /** Define the Url to load node editor script */
    static EditorURL: string;
    /** Define the Url to load snippets */
    static SnippetUrl: string;
    private BJSNODEGEOMETRYEDITOR;
    /** @returns the inspector from bundle or global */
    private _getGlobalNodeGeometryEditor;
    /**
     * Gets the time spent to build this block (in ms)
     */
    get buildExecutionTime(): number;
    /**
     * Gets or sets data used by visual editor
     * @see https://nge.babylonjs.com
     */
    editorData: any;
    /**
     * Gets an array of blocks that needs to be serialized even if they are not yet connected
     */
    attachedBlocks: NodeGeometryBlock[];
    /**
     * Observable raised when the geometry is built
     */
    onBuildObservable: Observable<NodeGeometry>;
    /** Gets or sets the GeometryOutputBlock used to gather the final geometry data */
    outputBlock: Nullable<GeometryOutputBlock>;
    /**
     * Snippet ID if the material was created from the snippet server
     */
    snippetId: string;
    /**
     * The name of the geometry
     */
    name: string;
    /**
     * A free comment about the geometry
     */
    comment: string;
    /**
     * Creates a new geometry
     * @param name defines the name of the geometry
     */
    constructor(name: string);
    /**
     * Gets the current class name of the geometry e.g. "NodeGeometry"
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Get a block by its name
     * @param name defines the name of the block to retrieve
     * @returns the required block or null if not found
     */
    getBlockByName(name: string): NodeGeometryBlock | null;
    /**
     * Get a block using a predicate
     * @param predicate defines the predicate used to find the good candidate
     * @returns the required block or null if not found
     */
    getBlockByPredicate(predicate: (block: NodeGeometryBlock) => boolean): NodeGeometryBlock | null;
    /**
     * Gets the list of input blocks attached to this material
     * @returns an array of InputBlocks
     */
    getInputBlocks(): GeometryInputBlock[];
    /**
     * Launch the node geometry editor
     * @param config Define the configuration of the editor
     * @returns a promise fulfilled when the node editor is visible
     */
    edit(config?: INodeGeometryEditorOptions): Promise<void>;
    /**
     * Creates the node editor window.
     * @param additionalConfig Additional configuration for the NGE
     */
    private _createNodeEditor;
    /**
     * Build the final geometry
     * @param verbose defines if the build should log activity
     * @param updateBuildId defines if the internal build Id should be updated (default is true)
     * @param autoConfigure defines if the autoConfigure method should be called when initializing blocks (default is false)
     */
    build(verbose?: boolean, updateBuildId?: boolean, autoConfigure?: boolean): void;
    /**
     * Creates a mesh from the geometry blocks
     * @param name defines the name of the mesh
     * @param scene The scene the mesh is scoped to
     * @returns The new mesh
     */
    createMesh(name: string, scene?: Nullable<Scene>): Nullable<Mesh>;
    /**
     * Creates a mesh from the geometry blocks
     * @param mesh the mesh to update
     * @returns True if successfully updated
     */
    updateMesh(mesh: Mesh): false | Mesh;
    private _initializeBlock;
    /**
     * Clear the current geometry
     */
    clear(): void;
    /**
     * Remove a block from the current geometry
     * @param block defines the block to remove
     */
    removeBlock(block: NodeGeometryBlock): void;
    /**
     * Clear the current graph and load a new one from a serialization object
     * @param source defines the JSON representation of the geometry
     * @param merge defines whether or not the source must be merged or replace the current content
     */
    parseSerializedObject(source: any, merge?: boolean): void;
    private _restoreConnections;
    /**
     * Generate a string containing the code declaration required to create an equivalent of this geometry
     * @returns a string
     */
    generateCode(): string;
    private _gatherBlocks;
    /**
     * Clear the current geometry and set it to a default state
     */
    setToDefault(): void;
    /**
     * Makes a duplicate of the current geometry.
     * @param name defines the name to use for the new geometry
     * @returns the new geometry
     */
    clone(name: string): NodeGeometry;
    /**
     * Serializes this geometry in a JSON representation
     * @param selectedBlocks defines the list of blocks to save (if null the whole geometry will be saved)
     * @returns the serialized geometry object
     */
    serialize(selectedBlocks?: NodeGeometryBlock[]): any;
    /**
     * Disposes the ressources
     */
    dispose(): void;
    /**
     * Creates a new node geometry set to default basic configuration
     * @param name defines the name of the geometry
     * @returns a new NodeGeometry
     */
    static CreateDefault(name: string): NodeGeometry;
    /**
     * Creates a node geometry from parsed geometry data
     * @param source defines the JSON representation of the geometry
     * @returns a new node geometry
     */
    static Parse(source: any): NodeGeometry;
    /**
     * Creates a node geometry from a snippet saved by the node geometry editor
     * @param snippetId defines the snippet to load
     * @param nodeGeometry defines a node geometry to update (instead of creating a new one)
     * @param skipBuild defines whether to build the node geometry
     * @returns a promise that will resolve to the new node geometry
     */
    static ParseFromSnippetAsync(snippetId: string, nodeGeometry?: NodeGeometry, skipBuild?: boolean): Promise<NodeGeometry>;
}
