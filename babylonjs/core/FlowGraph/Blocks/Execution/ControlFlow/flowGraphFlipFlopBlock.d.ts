import type { FlowGraphContext } from "../../../flowGraphContext.js";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection.js";
import { FlowGraphExecutionBlock } from "../../../flowGraphExecutionBlock.js";
import type { FlowGraphSignalConnection } from "../../../flowGraphSignalConnection.js";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock";
/**
 * @experimental
 * This block flip flops between two outputs.
 */
export declare class FlowGraphFlipFlopBlock extends FlowGraphExecutionBlock {
    /**
     * Output connection: The signal to execute when the variable is on.
     */
    readonly onOn: FlowGraphSignalConnection;
    /**
     * Output connection: The signal to execute when the variable is off.
     */
    readonly onOff: FlowGraphSignalConnection;
    /**
     * Output connection: If the variable is on.
     */
    readonly isOn: FlowGraphDataConnection<boolean>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _execute(context: FlowGraphContext, _callingSignal: FlowGraphSignalConnection): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
}
