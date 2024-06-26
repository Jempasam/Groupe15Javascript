import type { Nullable, DataArray, FloatArray } from "../types";
import type { AbstractEngine } from "../Engines/abstractEngine";
import { DataBuffer } from "./dataBuffer";
/**
 * Class used to store data that will be store in GPU memory
 */
export declare class Buffer {
    private _engine;
    private _buffer;
    /** @internal */
    _data: Nullable<DataArray>;
    private _updatable;
    private _instanced;
    private _divisor;
    private _isAlreadyOwned;
    private _isDisposed;
    private _label?;
    /**
     * Gets a boolean indicating if the Buffer is disposed
     */
    get isDisposed(): boolean;
    /**
     * Gets the byte stride.
     */
    readonly byteStride: number;
    /**
     * Constructor
     * @param engine the engine
     * @param data the data to use for this buffer
     * @param updatable whether the data is updatable
     * @param stride the stride (optional)
     * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
     * @param instanced whether the buffer is instanced (optional)
     * @param useBytes set to true if the stride in in bytes (optional)
     * @param divisor sets an optional divisor for instances (1 by default)
     * @param label defines the label of the buffer (for debug purpose)
     */
    constructor(engine: AbstractEngine, data: DataArray | DataBuffer, updatable: boolean, stride?: number, postponeInternalCreation?: boolean, instanced?: boolean, useBytes?: boolean, divisor?: number, label?: string);
    /**
     * Create a new VertexBuffer based on the current buffer
     * @param kind defines the vertex buffer kind (position, normal, etc.)
     * @param offset defines offset in the buffer (0 by default)
     * @param size defines the size in floats of attributes (position is 3 for instance)
     * @param stride defines the stride size in floats in the buffer (the offset to apply to reach next value when data is interleaved)
     * @param instanced defines if the vertex buffer contains indexed data
     * @param useBytes defines if the offset and stride are in bytes     *
     * @param divisor sets an optional divisor for instances (1 by default)
     * @returns the new vertex buffer
     */
    createVertexBuffer(kind: string, offset: number, size: number, stride?: number, instanced?: boolean, useBytes?: boolean, divisor?: number): VertexBuffer;
    /**
     * Gets a boolean indicating if the Buffer is updatable?
     * @returns true if the buffer is updatable
     */
    isUpdatable(): boolean;
    /**
     * Gets current buffer's data
     * @returns a DataArray or null
     */
    getData(): Nullable<DataArray>;
    /**
     * Gets underlying native buffer
     * @returns underlying native buffer
     */
    getBuffer(): Nullable<DataBuffer>;
    /**
     * Gets the stride in float32 units (i.e. byte stride / 4).
     * May not be an integer if the byte stride is not divisible by 4.
     * @returns the stride in float32 units
     * @deprecated Please use byteStride instead.
     */
    getStrideSize(): number;
    /**
     * Store data into the buffer. Creates the buffer if not used already.
     * If the buffer was already used, it will be updated only if it is updatable, otherwise it will do nothing.
     * @param data defines the data to store
     */
    create(data?: Nullable<DataArray>): void;
    /** @internal */
    _rebuild(): void;
    /**
     * Update current buffer data
     * @param data defines the data to store
     */
    update(data: DataArray): void;
    /**
     * Updates the data directly.
     * @param data the new data
     * @param offset the new offset
     * @param vertexCount the vertex count (optional)
     * @param useBytes set to true if the offset is in bytes
     */
    updateDirectly(data: DataArray, offset: number, vertexCount?: number, useBytes?: boolean): void;
    /** @internal */
    _increaseReferences(): void;
    /**
     * Release all resources
     */
    dispose(): void;
}
/**
 * Options to be used when creating a vertex buffer
 */
export interface IVertexBufferOptions {
    /**
     * whether the data is updatable (default: false)
     */
    updatable?: boolean;
    /**
     * whether to postpone creating the internal WebGL buffer (default: false)
     */
    postponeInternalCreation?: boolean;
    /**
     * the stride (will be automatically computed from the kind parameter if not specified)
     */
    stride?: number;
    /**
     * whether the buffer is instanced (default: false)
     */
    instanced?: boolean;
    /**
     * the offset of the data (default: 0)
     */
    offset?: number;
    /**
     * the number of components (will be automatically computed from the kind parameter if not specified)
     */
    size?: number;
    /**
     * the type of the component (will be deduce from the data parameter if not specified)
     */
    type?: number;
    /**
     * whether the data contains normalized data (default: false)
     */
    normalized?: boolean;
    /**
     * set to true if stride and offset are in bytes (default: false)
     */
    useBytes?: boolean;
    /**
     * defines the instance divisor to use (default: 1, only used if instanced is true)
     */
    divisor?: number;
    /**
     * defines if the buffer should be released when the vertex buffer is disposed (default: false)
     */
    takeBufferOwnership?: boolean;
    /**
     * label to use for this vertex buffer (debugging purpose)
     */
    label?: string;
}
/**
 * Specialized buffer used to store vertex data
 */
export declare class VertexBuffer {
    private static _Counter;
    /** @internal */
    _buffer: Buffer;
    /** @internal */
    _validOffsetRange: boolean;
    private _kind;
    private _size;
    /** @internal */
    _ownsBuffer: boolean;
    private _instanced;
    private _instanceDivisor;
    /** @internal */
    _isDisposed: boolean;
    /** @internal */
    _label?: string;
    /**
     * The byte type.
     */
    static readonly BYTE: number;
    /**
     * The unsigned byte type.
     */
    static readonly UNSIGNED_BYTE: number;
    /**
     * The short type.
     */
    static readonly SHORT: number;
    /**
     * The unsigned short type.
     */
    static readonly UNSIGNED_SHORT: number;
    /**
     * The integer type.
     */
    static readonly INT: number;
    /**
     * The unsigned integer type.
     */
    static readonly UNSIGNED_INT: number;
    /**
     * The float type.
     */
    static readonly FLOAT: number;
    /**
     * Gets a boolean indicating if the Buffer is disposed
     */
    get isDisposed(): boolean;
    /**
     * Gets or sets the instance divisor when in instanced mode
     */
    get instanceDivisor(): number;
    set instanceDivisor(value: number);
    /**
     * Gets the byte stride.
     */
    readonly byteStride: number;
    /**
     * Gets the byte offset.
     */
    readonly byteOffset: number;
    /**
     * Gets whether integer data values should be normalized into a certain range when being casted to a float.
     */
    readonly normalized: boolean;
    /**
     * Gets the data type of each component in the array.
     */
    readonly type: number;
    /**
     * Gets the unique id of this vertex buffer
     */
    readonly uniqueId: number;
    /**
     * Gets a hash code representing the format (type, normalized, size, instanced, stride) of this buffer
     * All buffers with the same format will have the same hash code
     */
    readonly hashCode: number;
    /**
     * Gets the engine associated with the buffer
     */
    readonly engine: AbstractEngine;
    /**
     * Gets the max possible amount of vertices stored within the current vertex buffer.
     * We do not have the end offset or count so this will be too big for concatenated vertex buffers.
     * @internal
     */
    get _maxVerticesCount(): number;
    /**
     * Constructor
     * @param engine the engine
     * @param data the data to use for this vertex buffer
     * @param kind the vertex buffer kind
     * @param updatable whether the data is updatable
     * @param postponeInternalCreation whether to postpone creating the internal WebGL buffer (optional)
     * @param stride the stride (optional)
     * @param instanced whether the buffer is instanced (optional)
     * @param offset the offset of the data (optional)
     * @param size the number of components (optional)
     * @param type the type of the component (optional)
     * @param normalized whether the data contains normalized data (optional)
     * @param useBytes set to true if stride and offset are in bytes (optional)
     * @param divisor defines the instance divisor to use (1 by default)
     * @param takeBufferOwnership defines if the buffer should be released when the vertex buffer is disposed
     */
    constructor(engine: AbstractEngine, data: DataArray | Buffer | DataBuffer, kind: string, updatable: boolean, postponeInternalCreation?: boolean, stride?: number, instanced?: boolean, offset?: number, size?: number, type?: number, normalized?: boolean, useBytes?: boolean, divisor?: number, takeBufferOwnership?: boolean);
    /**
     * Constructor
     * @param engine the engine
     * @param data the data to use for this vertex buffer
     * @param kind the vertex buffer kind
     * @param options defines the rest of the options used to create the buffer
     */
    constructor(engine: AbstractEngine, data: DataArray | Buffer | DataBuffer, kind: string, options?: IVertexBufferOptions);
    private _computeHashCode;
    /** @internal */
    _rebuild(): void;
    /**
     * Returns the kind of the VertexBuffer (string)
     * @returns a string
     */
    getKind(): string;
    /**
     * Gets a boolean indicating if the VertexBuffer is updatable?
     * @returns true if the buffer is updatable
     */
    isUpdatable(): boolean;
    /**
     * Gets current buffer's data
     * @returns a DataArray or null
     */
    getData(): Nullable<DataArray>;
    /**
     * Gets current buffer's data as a float array. Float data is constructed if the vertex buffer data cannot be returned directly.
     * @param totalVertices number of vertices in the buffer to take into account
     * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
     * @returns a float array containing vertex data
     */
    getFloatData(totalVertices: number, forceCopy?: boolean): Nullable<FloatArray>;
    /**
     * Gets underlying native buffer
     * @returns underlying native buffer
     */
    getBuffer(): Nullable<DataBuffer>;
    /**
     * Gets the Buffer instance that wraps the native GPU buffer
     * @returns the wrapper buffer
     */
    getWrapperBuffer(): Buffer;
    /**
     * Gets the stride in float32 units (i.e. byte stride / 4).
     * May not be an integer if the byte stride is not divisible by 4.
     * @returns the stride in float32 units
     * @deprecated Please use byteStride instead.
     */
    getStrideSize(): number;
    /**
     * Returns the offset as a multiple of the type byte length.
     * @returns the offset in bytes
     * @deprecated Please use byteOffset instead.
     */
    getOffset(): number;
    /**
     * Returns the number of components or the byte size per vertex attribute
     * @param sizeInBytes If true, returns the size in bytes or else the size in number of components of the vertex attribute (default: false)
     * @returns the number of components
     */
    getSize(sizeInBytes?: boolean): number;
    /**
     * Gets a boolean indicating is the internal buffer of the VertexBuffer is instanced
     * @returns true if this buffer is instanced
     */
    getIsInstanced(): boolean;
    /**
     * Returns the instancing divisor, zero for non-instanced (integer).
     * @returns a number
     */
    getInstanceDivisor(): number;
    /**
     * Store data into the buffer. If the buffer was already used it will be either recreated or updated depending on isUpdatable property
     * @param data defines the data to store
     */
    create(data?: DataArray): void;
    /**
     * Updates the underlying buffer according to the passed numeric array or Float32Array.
     * This function will create a new buffer if the current one is not updatable
     * @param data defines the data to store
     */
    update(data: DataArray): void;
    /**
     * Updates directly the underlying WebGLBuffer according to the passed numeric array or Float32Array.
     * Returns the directly updated WebGLBuffer.
     * @param data the new data
     * @param offset the new offset
     * @param useBytes set to true if the offset is in bytes
     */
    updateDirectly(data: DataArray, offset: number, useBytes?: boolean): void;
    /**
     * Disposes the VertexBuffer and the underlying WebGLBuffer.
     */
    dispose(): void;
    /**
     * Enumerates each value of this vertex buffer as numbers.
     * @param count the number of values to enumerate
     * @param callback the callback function called for each value
     */
    forEach(count: number, callback: (value: number, index: number) => void): void;
    /**
     * Positions
     */
    static readonly PositionKind: string;
    /**
     * Normals
     */
    static readonly NormalKind: string;
    /**
     * Tangents
     */
    static readonly TangentKind: string;
    /**
     * Texture coordinates
     */
    static readonly UVKind: string;
    /**
     * Texture coordinates 2
     */
    static readonly UV2Kind: string;
    /**
     * Texture coordinates 3
     */
    static readonly UV3Kind: string;
    /**
     * Texture coordinates 4
     */
    static readonly UV4Kind: string;
    /**
     * Texture coordinates 5
     */
    static readonly UV5Kind: string;
    /**
     * Texture coordinates 6
     */
    static readonly UV6Kind: string;
    /**
     * Colors
     */
    static readonly ColorKind: string;
    /**
     * Instance Colors
     */
    static readonly ColorInstanceKind: string;
    /**
     * Matrix indices (for bones)
     */
    static readonly MatricesIndicesKind: string;
    /**
     * Matrix weights (for bones)
     */
    static readonly MatricesWeightsKind: string;
    /**
     * Additional matrix indices (for bones)
     */
    static readonly MatricesIndicesExtraKind: string;
    /**
     * Additional matrix weights (for bones)
     */
    static readonly MatricesWeightsExtraKind: string;
    /**
     * Deduces the stride given a kind.
     * @param kind The kind string to deduce
     * @returns The deduced stride
     */
    static DeduceStride(kind: string): number;
    /**
     * Gets the vertex buffer type of the given data array.
     * @param data the data array
     * @returns the vertex buffer type
     */
    static GetDataType(data: DataArray): number;
    /**
     * Gets the byte length of the given type.
     * @param type the type
     * @returns the number of bytes
     */
    static GetTypeByteLength(type: number): number;
    /**
     * Enumerates each value of the given parameters as numbers.
     * @param data the data to enumerate
     * @param byteOffset the byte offset of the data
     * @param byteStride the byte stride of the data
     * @param componentCount the number of components per element
     * @param componentType the type of the component
     * @param count the number of values to enumerate
     * @param normalized whether the data is normalized
     * @param callback the callback function called for each value
     */
    static ForEach(data: DataArray, byteOffset: number, byteStride: number, componentCount: number, componentType: number, count: number, normalized: boolean, callback: (value: number, index: number) => void): void;
    private static _GetFloatValue;
    /**
     * Gets the given data array as a float array. Float data is constructed if the data array cannot be returned directly.
     * @param data the input data array
     * @param size the number of components
     * @param type the component type
     * @param byteOffset the byte offset of the data
     * @param byteStride the byte stride of the data
     * @param normalized whether the data is normalized
     * @param totalVertices number of vertices in the buffer to take into account
     * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
     * @returns a float array containing vertex data
     */
    static GetFloatData(data: DataArray, size: number, type: number, byteOffset: number, byteStride: number, normalized: boolean, totalVertices: number, forceCopy?: boolean): FloatArray;
}
