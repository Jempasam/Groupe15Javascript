import type { FlowGraphContext } from "../../flowGraphContext";
import type { RichType } from "../../flowGraphRichTypes";
import type { IFlowGraphBlockConfiguration } from "../../flowGraphBlock";
import { FlowGraphCachedOperationBlock } from "./flowGraphCachedOperationBlock";
/**
 * @experimental
 * Block that outputs a value of type ResultT, resulting of an operation with no inputs.
 */
export declare class FlowGraphConstantOperationBlock<ResultT> extends FlowGraphCachedOperationBlock<ResultT> {
    private _operation;
    private _className;
    constructor(richType: RichType<ResultT>, _operation: () => ResultT, _className: string, config?: IFlowGraphBlockConfiguration);
    /**
     * the operation performed by this block
     * @param _context the graph context
     * @returns the result of the operation
     */
    _doOperation(_context: FlowGraphContext): ResultT;
    /**
     * Gets the class name of this block
     * @returns the class name
     */
    getClassName(): string;
}
