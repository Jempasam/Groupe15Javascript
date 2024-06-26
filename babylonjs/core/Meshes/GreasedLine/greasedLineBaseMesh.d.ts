import type { Scene } from "../../scene";
import type { IGreasedLineMaterial } from "../../Materials/GreasedLine/greasedLineMaterialInterfaces";
import { Mesh } from "../mesh";
import { Buffer } from "../../Buffers/buffer";
import type { Vector3 } from "../../Maths/math.vector";
import { VertexData } from "../mesh.vertexData";
import type { AbstractEngine } from "../../Engines/abstractEngine";
import type { FloatArray, IndicesArray } from "../../types";
/**
 * In POINTS_MODE_POINTS every array of points will become the center (backbone) of the ribbon. The ribbon will be expanded by `width / 2` to `+direction` and `-direction` as well.
 * In POINTS_MODE_PATHS every array of points specifies an edge. These will be used to build one ribbon.
 */
export declare enum GreasedLineRibbonPointsMode {
    POINTS_MODE_POINTS = 0,
    POINTS_MODE_PATHS = 1
}
/**
 * FACES_MODE_SINGLE_SIDED single sided with back face culling. Default value.
 * FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING single sided without back face culling. Sets backFaceCulling = false on the material so it affects all line ribbons added to the line ribbon instance.
 * FACES_MODE_DOUBLE_SIDED extra back faces are created. This doubles the amount of faces of the mesh.
 */
export declare enum GreasedLineRibbonFacesMode {
    FACES_MODE_SINGLE_SIDED = 0,
    FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING = 1,
    FACES_MODE_DOUBLE_SIDED = 2
}
/**
 * Only with POINTS_MODE_PATHS.
 * AUTO_DIRECTIONS_FROM_FIRST_SEGMENT sets the direction (slope) of the ribbon from the direction of the first line segment. Recommended.
 * AUTO_DIRECTIONS_FROM_ALL_SEGMENTS in this mode the direction (slope) will be calculated for each line segment according to the direction vector between each point of the line segments. Slow method.
 * AUTO_DIRECTIONS_ENHANCED in this mode the direction (slope) will be calculated for each line segment according to the direction vector between each point of the line segments using a more sophisitcaed algorithm. Slowest method.
 * AUTO_DIRECTIONS_FACE_TO in this mode the direction (slope) will be calculated for each line segment according to the direction vector between each point of the line segments and a direction (face-to) vector specified in direction. The resulting line will face to the direction of this face-to vector.
 * AUTO_DIRECTIONS_NONE you have to set the direction (slope) manually. Recommended.
 */
export declare enum GreasedLineRibbonAutoDirectionMode {
    AUTO_DIRECTIONS_FROM_FIRST_SEGMENT = 0,
    AUTO_DIRECTIONS_FROM_ALL_SEGMENTS = 1,
    AUTO_DIRECTIONS_ENHANCED = 2,
    AUTO_DIRECTIONS_FACE_TO = 3,
    AUTO_DIRECTIONS_NONE = 99
}
export type GreasedLineRibbonOptions = {
    /**
     * Defines how the points are processed.
     * In GreasedLineRibbonPointsMode.POINTS_MODE_POINTS every array of points will become the center of the ribbon. The ribbon will be expanded by width/2 to +direction and -direction as well.
     * In GreasedLineRibbonPointsMode.POINTS_MODE_PATHS every array of points is one path. These will be used to buuid one ribbon.
     */
    pointsMode?: GreasedLineRibbonPointsMode;
    /**
     * Normalized directions of the slopes of the non camera facing lines.
     */
    directions?: Vector3[] | Vector3;
    /**
     * Defines the calculation mode of the directions which the line will be thickened to.
     */
    directionsAutoMode?: GreasedLineRibbonAutoDirectionMode;
    /**
     * Width of the ribbon.
     */
    width?: number;
    /**
     * Controls how the faces are created.
     * GreasedLineRibbonFacesMode.FACES_MODE_SINGLE_SIDED = single sided with back face culling. Default value.
     * GreasedLineRibbonFacesMode.FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING = single sided without back face culling
     * GreasedLineRibbonFacesMode.FACES_MODE_DOUBLE_SIDED = extra back faces are created. This doubles the amount of faces of the mesh.
     */
    facesMode?: GreasedLineRibbonFacesMode;
    /**
     * If true, the path will be closed.
     */
    closePath?: boolean;
    /**
     * If true, normals will be computed when creating the vertex buffers.
     * This results to smooth shading of the mesh.
     */
    smoothShading?: boolean;
};
export type GreasedLinePoints = Vector3[] | Vector3[][] | Float32Array | Float32Array[] | number[][] | number[];
/**
 * Options for creating a GreasedLineMesh
 */
export interface GreasedLineMeshOptions {
    /**
     * Points of the line.
     */
    points: GreasedLinePoints;
    /**
     * Each line segment (from point to point) can have it's width multiplier. Final width = widths[segmentIdx] * width.
     * Defaults to empty array.
     */
    widths?: number[];
    /**
     * If instance is specified, lines are added to the specified instance.
     * Defaults to undefined.
     */
    instance?: GreasedLineBaseMesh;
    /**
     * You can manually set the color pointers so you can control which segment/part
     * will use which color from the colors material option
     */
    colorPointers?: number[];
    /**
     * UVs for the mesh
     */
    uvs?: FloatArray;
    /**
     * If true, offsets and widths are updatable.
     * Defaults to false.
     */
    updatable?: boolean;
    /**
     * Use when @see instance is specified.
     * If true, the line will be rendered only after calling instance.updateLazy(). If false, line will be rerendered after every call to @see CreateGreasedLine
     * Defaults to false.
     */
    lazy?: boolean;
    /**
     * The options for the ribbon which will be used as a line.
     * If this option is set the line switches automatically to a non camera facing mode.
     */
    ribbonOptions?: GreasedLineRibbonOptions;
}
/**
 * GreasedLineBaseMesh
 */
export declare abstract class GreasedLineBaseMesh extends Mesh {
    readonly name: string;
    protected _options: GreasedLineMeshOptions;
    protected _vertexPositions: FloatArray;
    protected _indices: IndicesArray;
    protected _uvs: FloatArray;
    protected _points: number[][];
    protected _offsets: number[];
    protected _colorPointers: number[];
    protected _widths: number[];
    protected _offsetsBuffer?: Buffer;
    protected _widthsBuffer?: Buffer;
    protected _colorPointersBuffer?: Buffer;
    protected _lazy: boolean;
    protected _updatable: boolean;
    protected _engine: AbstractEngine;
    constructor(name: string, scene: Scene, _options: GreasedLineMeshOptions);
    /**
     * "GreasedLineMesh"
     * @returns "GreasedLineMesh"
     */
    getClassName(): string;
    protected abstract _setPoints(points: number[][], options?: GreasedLineMeshOptions): void;
    protected abstract _updateColorPointers(): void;
    protected abstract _updateWidths(): void;
    protected _updateWidthsWithValue(defaulValue: number): void;
    /**
     * Updated a lazy line. Rerenders the line and updates boundinfo as well.
     */
    updateLazy(): void;
    /**
     * Adds new points to the line. It doesn't rerenders the line if in lazy mode.
     * @param points points table
     * @param options optional options
     */
    addPoints(points: number[][], options?: GreasedLineMeshOptions): void;
    /**
     * Dispose the line and it's resources
     * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
     * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
     */
    dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void;
    /**
     * @returns true if the mesh was created in lazy mode
     */
    isLazy(): boolean;
    /**
     * Returns the UVs
     */
    get uvs(): FloatArray;
    /**
     * Sets the UVs
     * @param uvs the UVs
     */
    set uvs(uvs: FloatArray);
    /**
     * Returns the points offsets
     * Return the points offsets
     */
    get offsets(): number[];
    /**
     * Sets point offests
     * @param offsets offset table [x,y,z, x,y,z, ....]
     */
    set offsets(offsets: number[]);
    /**
     * Gets widths at each line point like [widthLower, widthUpper, widthLower, widthUpper, ...]
     */
    get widths(): number[];
    /**
     * Sets widths at each line point
     * @param widths width table [widthLower, widthUpper, widthLower, widthUpper ...]
     */
    set widths(widths: number[]);
    /**
     * Gets the color pointer. Each vertex need a color pointer. These color pointers points to the colors in the color table @see colors
     */
    get colorPointers(): number[];
    /**
     * Sets the color pointer
     * @param colorPointers array of color pointer in the colors array. One pointer for every vertex is needed.
     */
    set colorPointers(colorPointers: number[]);
    /**
     * Gets the pluginMaterial associated with line
     */
    get greasedLineMaterial(): IGreasedLineMaterial | undefined;
    /**
     * Return copy the points.
     */
    get points(): number[][];
    /**
     * Sets line points and rerenders the line.
     * @param points points table
     * @param options optional options
     */
    setPoints(points: number[][], options?: GreasedLineMeshOptions): void;
    protected _initGreasedLine(): void;
    protected _createLineOptions(): GreasedLineMeshOptions;
    /**
     * Serializes this GreasedLineMesh
     * @param serializationObject object to write serialization to
     */
    serialize(serializationObject: any): void;
    protected _createVertexBuffers(computeNormals?: boolean): VertexData;
    protected _createOffsetsBuffer(offsets: number[]): void;
}
