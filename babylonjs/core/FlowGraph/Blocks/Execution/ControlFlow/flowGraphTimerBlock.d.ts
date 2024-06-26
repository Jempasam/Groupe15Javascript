import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection";
import type { FlowGraphContext } from "../../../flowGraphContext";
import { FlowGraphAsyncExecutionBlock } from "../../../flowGraphAsyncExecutionBlock";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock";
/**
 * @experimental
 * Block that provides two different output flows. One is started immediately once the block is executed,
 * and the other is executed after a set time. The timer for this block runs based on the scene's render loop.
 */
export declare class FlowGraphTimerBlock extends FlowGraphAsyncExecutionBlock {
    /**
     * Input connection: The timeout of the timer.
     */
    readonly timeout: FlowGraphDataConnection<number>;
    constructor(config?: IFlowGraphBlockConfiguration);
    _preparePendingTasks(context: FlowGraphContext): void;
    /**
     * @internal
     */
    _execute(context: FlowGraphContext): void;
    private _onEnded;
    _cancelPendingTasks(context: FlowGraphContext): void;
    /**
     * @returns class name of the block.
     */
    getClassName(): string;
    /**
     * the class name of the block.
     */
    static ClassName: string;
}
