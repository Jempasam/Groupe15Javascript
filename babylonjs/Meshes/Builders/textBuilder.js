import { Path2 } from "../../Maths/math.path.js";
import { Vector3 } from "../../Maths/math.vector.js";
import { Mesh } from "../mesh.js";
import { TransformNode } from "../transformNode.js";
import { ExtrudePolygon } from "./polygonBuilder.js";
// Shape functions
class ShapePath {
    /** Create the ShapePath used to support glyphs
     * @param resolution defines the resolution used to determine the number of points per curve (default is 4)
     */
    constructor(resolution) {
        this._paths = [];
        this._tempPaths = [];
        this._holes = [];
        this._resolution = resolution;
    }
    /** Move the virtual cursor to a coordinate
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     */
    moveTo(x, y) {
        this._currentPath = new Path2(x, y);
        this._tempPaths.push(this._currentPath);
    }
    /** Draw a line from the virtual cursor to a given coordinate
     * @param x defines the x coordinate
     * @param y defines the y coordinate
     */
    lineTo(x, y) {
        this._currentPath.addLineTo(x, y);
    }
    /** Create a quadratic curve from the virtual cursor to a given coordinate
     * @param cpx defines the x coordinate of the control point
     * @param cpy defines the y coordinate of the control point
     * @param x defines the x coordinate of the end point
     * @param y defines the y coordinate of the end point
     */
    quadraticCurveTo(cpx, cpy, x, y) {
        this._currentPath.addQuadraticCurveTo(cpx, cpy, x, y, this._resolution);
    }
    /**
     * Create a bezier curve from the virtual cursor to a given coordinate
     * @param cpx1 defines the x coordinate of the first control point
     * @param cpy1 defines the y coordinate of the first control point
     * @param cpx2 defines the x coordinate of the second control point
     * @param cpy2 defines the y coordinate of the second control point
     * @param x defines the x coordinate of the end point
     * @param y defines the y coordinate of the end point
     */
    bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y) {
        this._currentPath.addBezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y, this._resolution);
    }
    /** Extract holes based on CW / CCW */
    extractHoles() {
        for (const path of this._tempPaths) {
            if (path.area() > 0) {
                this._holes.push(path);
            }
            else {
                this._paths.push(path);
            }
        }
        if (!this._paths.length && this._holes.length) {
            const temp = this._holes;
            this._holes = this._paths;
            this._paths = temp;
        }
        this._tempPaths.length = 0;
    }
    /** Gets the list of paths */
    get paths() {
        return this._paths;
    }
    /** Gets the list of holes */
    get holes() {
        return this._holes;
    }
}
// Utility functions
function CreateShapePath(char, scale, offsetX, offsetY, resolution, fontData) {
    const glyph = fontData.glyphs[char] || fontData.glyphs["?"];
    if (!glyph) {
        // return if there is no glyph data
        return null;
    }
    const shapePath = new ShapePath(resolution);
    if (glyph.o) {
        const outline = glyph.o.split(" ");
        for (let i = 0, l = outline.length; i < l;) {
            const action = outline[i++];
            switch (action) {
                case "m": {
                    // moveTo
                    const x = parseInt(outline[i++]) * scale + offsetX;
                    const y = parseInt(outline[i++]) * scale + offsetY;
                    shapePath.moveTo(x, y);
                    break;
                }
                case "l": {
                    // lineTo
                    const x = parseInt(outline[i++]) * scale + offsetX;
                    const y = parseInt(outline[i++]) * scale + offsetY;
                    shapePath.lineTo(x, y);
                    break;
                }
                case "q": {
                    // quadraticCurveTo
                    const cpx = parseInt(outline[i++]) * scale + offsetX;
                    const cpy = parseInt(outline[i++]) * scale + offsetY;
                    const cpx1 = parseInt(outline[i++]) * scale + offsetX;
                    const cpy1 = parseInt(outline[i++]) * scale + offsetY;
                    shapePath.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
                    break;
                }
                case "b": {
                    // bezierCurveTo
                    const cpx = parseInt(outline[i++]) * scale + offsetX;
                    const cpy = parseInt(outline[i++]) * scale + offsetY;
                    const cpx1 = parseInt(outline[i++]) * scale + offsetX;
                    const cpy1 = parseInt(outline[i++]) * scale + offsetY;
                    const cpx2 = parseInt(outline[i++]) * scale + offsetX;
                    const cpy2 = parseInt(outline[i++]) * scale + offsetY;
                    shapePath.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
                    break;
                }
            }
        }
    }
    // Extract holes (based on clockwise data)
    shapePath.extractHoles();
    return { offsetX: glyph.ha * scale, shapePath: shapePath };
}
/**
 * Creates shape paths from a text and font
 * @param text the text
 * @param size size of the font
 * @param resolution resolution of the font
 * @param fontData defines the font data (can be generated with http://gero3.github.io/facetype.js/)
 * @returns array of ShapePath objects
 */
export function CreateTextShapePaths(text, size, resolution, fontData) {
    const chars = Array.from(text);
    const scale = size / fontData.resolution;
    const line_height = (fontData.boundingBox.yMax - fontData.boundingBox.yMin + fontData.underlineThickness) * scale;
    const shapePaths = [];
    let offsetX = 0, offsetY = 0;
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === "\n") {
            offsetX = 0;
            offsetY -= line_height;
        }
        else {
            const ret = CreateShapePath(char, scale, offsetX, offsetY, resolution, fontData);
            if (ret) {
                offsetX += ret.offsetX;
                shapePaths.push(ret.shapePath);
            }
        }
    }
    return shapePaths;
}
/**
 * Create a text mesh
 * @param name defines the name of the mesh
 * @param text defines the text to use to build the mesh
 * @param fontData defines the font data (can be generated with http://gero3.github.io/facetype.js/)
 * @param options defines options used to create the mesh
 * @param scene defines the hosting scene
 * @param earcutInjection can be used to inject your own earcut reference
 * @returns a new Mesh
 * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/text
 */
export function CreateText(name, text, fontData, options = {
    size: 50,
    resolution: 8,
    depth: 1.0,
}, scene = null, earcutInjection = earcut) {
    // First we need to generate the paths
    const shapePaths = CreateTextShapePaths(text, options.size || 50, options.resolution || 8, fontData);
    // And extrude them
    const meshes = [];
    let letterIndex = 0;
    for (const shapePath of shapePaths) {
        if (!shapePath.paths.length) {
            continue;
        }
        const holes = shapePath.holes.slice(); // Copy it as we will update the copy
        for (const path of shapePath.paths) {
            const holeVectors = [];
            const shapeVectors = [];
            const points = path.getPoints();
            for (const point of points) {
                shapeVectors.push(new Vector3(point.x, 0, point.y)); // ExtrudePolygon expects data on the xz plane
            }
            // Holes
            const localHolesCopy = holes.slice();
            for (const hole of localHolesCopy) {
                const points = hole.getPoints();
                let found = false;
                for (const point of points) {
                    if (path.isPointInside(point)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    continue;
                }
                const holePoints = [];
                for (const point of points) {
                    holePoints.push(new Vector3(point.x, 0, point.y)); // ExtrudePolygon expects data on the xz plane
                }
                holeVectors.push(holePoints);
                // Remove the hole as it was already used
                holes.splice(holes.indexOf(hole), 1);
            }
            // There is at least a hole but it was unaffected
            if (!holeVectors.length && holes.length) {
                for (const hole of holes) {
                    const points = hole.getPoints();
                    const holePoints = [];
                    for (const point of points) {
                        holePoints.push(new Vector3(point.x, 0, point.y)); // ExtrudePolygon expects data on the xz plane
                    }
                    holeVectors.push(holePoints);
                }
            }
            // Extrusion!
            const mesh = ExtrudePolygon(name, {
                shape: shapeVectors,
                holes: holeVectors.length ? holeVectors : undefined,
                depth: options.depth || 1.0,
                faceUV: options.faceUV || options.perLetterFaceUV?.(letterIndex),
                faceColors: options.faceColors || options.perLetterFaceColors?.(letterIndex),
                sideOrientation: Mesh._GetDefaultSideOrientation(options.sideOrientation || Mesh.DOUBLESIDE),
            }, scene, earcutInjection);
            meshes.push(mesh);
            letterIndex++;
        }
    }
    // Then we can merge everyone into one single mesh
    const newMesh = Mesh.MergeMeshes(meshes, true, true);
    if (newMesh) {
        // Move pivot to desired center / bottom / center position
        const bbox = newMesh.getBoundingInfo().boundingBox;
        newMesh.position.x += -(bbox.minimumWorld.x + bbox.maximumWorld.x) / 2; // Mid X
        newMesh.position.y += -(bbox.minimumWorld.y + bbox.maximumWorld.y) / 2; // Mid Z as it will rotate
        newMesh.position.z += -(bbox.minimumWorld.z + bbox.maximumWorld.z) / 2 + bbox.extendSize.z; // Bottom Y as it will rotate
        newMesh.name = name;
        // Rotate 90° Up
        const pivot = new TransformNode("pivot", scene);
        pivot.rotation.x = -Math.PI / 2;
        newMesh.parent = pivot;
        newMesh.bakeCurrentTransformIntoVertices();
        // Remove the pivot
        newMesh.parent = null;
        pivot.dispose();
    }
    return newMesh;
}
//# sourceMappingURL=textBuilder.js.map