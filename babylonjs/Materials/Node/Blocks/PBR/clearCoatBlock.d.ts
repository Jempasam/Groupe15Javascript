import { NodeMaterialBlock } from "../../nodeMaterialBlock";
import { type NodeMaterialBuildState } from "../../nodeMaterialBuildState";
import type { NodeMaterialConnectionPoint } from "../../nodeMaterialBlockConnectionPoint";
import type { NodeMaterial, NodeMaterialDefines } from "../../nodeMaterial";
import type { AbstractMesh } from "../../../../Meshes/abstractMesh";
import type { ReflectionBlock } from "./reflectionBlock";
import type { Scene } from "../../../../scene";
import type { Nullable } from "../../../../types";
import type { Mesh } from "../../../../Meshes/mesh";
import type { Effect } from "../../../effect";
/**
 * Block used to implement the clear coat module of the PBR material
 */
export declare class ClearCoatBlock extends NodeMaterialBlock {
    private _scene;
    private _tangentCorrectionFactorName;
    /**
     * Create a new ClearCoatBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Defines if the F0 value should be remapped to account for the interface change in the material.
     */
    remapF0OnInterfaceChange: boolean;
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state: NodeMaterialBuildState): void;
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the intensity input component
     */
    get intensity(): NodeMaterialConnectionPoint;
    /**
     * Gets the roughness input component
     */
    get roughness(): NodeMaterialConnectionPoint;
    /**
     * Gets the ior input component
     */
    get indexOfRefraction(): NodeMaterialConnectionPoint;
    /**
     * Gets the bump texture input component
     */
    get normalMapColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the uv input component
     */
    get uv(): NodeMaterialConnectionPoint;
    /**
     * Gets the tint color input component
     */
    get tintColor(): NodeMaterialConnectionPoint;
    /**
     * Gets the tint "at distance" input component
     */
    get tintAtDistance(): NodeMaterialConnectionPoint;
    /**
     * Gets the tint thickness input component
     */
    get tintThickness(): NodeMaterialConnectionPoint;
    /**
     * Gets the world tangent input component
     */
    get worldTangent(): NodeMaterialConnectionPoint;
    /**
     * Gets the world normal input component
     */
    get worldNormal(): NodeMaterialConnectionPoint;
    /**
     * Gets the TBN input component
     */
    get TBN(): NodeMaterialConnectionPoint;
    /**
     * Gets the clear coat object output component
     */
    get clearcoat(): NodeMaterialConnectionPoint;
    autoConfigure(): void;
    prepareDefines(mesh: AbstractMesh, nodeMaterial: NodeMaterial, defines: NodeMaterialDefines): void;
    bind(effect: Effect, nodeMaterial: NodeMaterial, mesh?: Mesh): void;
    private _generateTBNSpace;
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param ccBlock instance of a ClearCoatBlock or null if the code must be generated without an active clear coat module
     * @param reflectionBlock instance of a ReflectionBlock null if the code must be generated without an active reflection module
     * @param worldPosVarName name of the variable holding the world position
     * @param generateTBNSpace if true, the code needed to create the TBN coordinate space is generated
     * @param vTBNAvailable indicate that the vTBN variable is already existing because it has already been generated by another block (PerturbNormal or Anisotropy)
     * @param worldNormalVarName name of the variable holding the world normal
     * @returns the shader code
     */
    static GetCode(state: NodeMaterialBuildState, ccBlock: Nullable<ClearCoatBlock>, reflectionBlock: Nullable<ReflectionBlock>, worldPosVarName: string, generateTBNSpace: boolean, vTBNAvailable: boolean, worldNormalVarName: string): string;
    protected _buildBlock(state: NodeMaterialBuildState): this;
    protected _dumpPropertiesCode(): string;
    serialize(): any;
    _deserialize(serializationObject: any, scene: Scene, rootUrl: string): void;
}
