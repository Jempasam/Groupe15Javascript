import { NodeMaterialBlock } from "../nodeMaterialBlock";
import type { NodeMaterialBuildState } from "../nodeMaterialBuildState";
import type { NodeMaterialConnectionPoint } from "../nodeMaterialBlockConnectionPoint";
/**
 * Block used to normalize lerp between 2 values
 */
export declare class NLerpBlock extends NodeMaterialBlock {
    /**
     * Creates a new NLerpBlock
     * @param name defines the block name
     */
    constructor(name: string);
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName(): string;
    /**
     * Gets the left operand input component
     */
    get left(): NodeMaterialConnectionPoint;
    /**
     * Gets the right operand input component
     */
    get right(): NodeMaterialConnectionPoint;
    /**
     * Gets the gradient operand input component
     */
    get gradient(): NodeMaterialConnectionPoint;
    /**
     * Gets the output component
     */
    get output(): NodeMaterialConnectionPoint;
    protected _buildBlock(state: NodeMaterialBuildState): this;
}
