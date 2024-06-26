import { Material } from "../Materials/material.js";
import { Tags } from "../Misc/tags.js";
import { RegisterClass } from "../Misc/typeStore.js";
/**
 * A multi-material is used to apply different materials to different parts of the same object without the need of
 * separate meshes. This can be use to improve performances.
 * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/multiMaterials
 */
export class MultiMaterial extends Material {
    /**
     * Gets or Sets the list of Materials used within the multi material.
     * They need to be ordered according to the submeshes order in the associated mesh
     */
    get subMaterials() {
        return this._subMaterials;
    }
    set subMaterials(value) {
        this._subMaterials = value;
        this._hookArray(value);
    }
    /**
     * Function used to align with Node.getChildren()
     * @returns the list of Materials used within the multi material
     */
    getChildren() {
        return this.subMaterials;
    }
    /**
     * Instantiates a new Multi Material
     * A multi-material is used to apply different materials to different parts of the same object without the need of
     * separate meshes. This can be use to improve performances.
     * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/multiMaterials
     * @param name Define the name in the scene
     * @param scene Define the scene the material belongs to
     */
    constructor(name, scene) {
        super(name, scene, true);
        /** @internal */
        this._waitingSubMaterialsUniqueIds = [];
        this.getScene().addMultiMaterial(this);
        this.subMaterials = [];
        this._storeEffectOnSubMeshes = true; // multimaterial is considered like a push material
    }
    _hookArray(array) {
        const oldPush = array.push;
        array.push = (...items) => {
            const result = oldPush.apply(array, items);
            this._markAllSubMeshesAsTexturesDirty();
            return result;
        };
        const oldSplice = array.splice;
        array.splice = (index, deleteCount) => {
            const deleted = oldSplice.apply(array, [index, deleteCount]);
            this._markAllSubMeshesAsTexturesDirty();
            return deleted;
        };
    }
    /**
     * Get one of the submaterial by its index in the submaterials array
     * @param index The index to look the sub material at
     * @returns The Material if the index has been defined
     */
    getSubMaterial(index) {
        if (index < 0 || index >= this.subMaterials.length) {
            return this.getScene().defaultMaterial;
        }
        return this.subMaterials[index];
    }
    /**
     * Get the list of active textures for the whole sub materials list.
     * @returns All the textures that will be used during the rendering
     */
    getActiveTextures() {
        return super.getActiveTextures().concat(...this.subMaterials.map((subMaterial) => {
            if (subMaterial) {
                return subMaterial.getActiveTextures();
            }
            else {
                return [];
            }
        }));
    }
    /**
     * Specifies if any sub-materials of this multi-material use a given texture.
     * @param texture Defines the texture to check against this multi-material's sub-materials.
     * @returns A boolean specifying if any sub-material of this multi-material uses the texture.
     */
    hasTexture(texture) {
        if (super.hasTexture(texture)) {
            return true;
        }
        for (let i = 0; i < this.subMaterials.length; i++) {
            if (this.subMaterials[i]?.hasTexture(texture)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets the current class name of the material e.g. "MultiMaterial"
     * Mainly use in serialization.
     * @returns the class name
     */
    getClassName() {
        return "MultiMaterial";
    }
    /**
     * Checks if the material is ready to render the requested sub mesh
     * @param mesh Define the mesh the submesh belongs to
     * @param subMesh Define the sub mesh to look readiness for
     * @param useInstances Define whether or not the material is used with instances
     * @returns true if ready, otherwise false
     */
    isReadyForSubMesh(mesh, subMesh, useInstances) {
        for (let index = 0; index < this.subMaterials.length; index++) {
            const subMaterial = this.subMaterials[index];
            if (subMaterial) {
                if (subMaterial._storeEffectOnSubMeshes) {
                    if (!subMaterial.isReadyForSubMesh(mesh, subMesh, useInstances)) {
                        return false;
                    }
                    continue;
                }
                if (!subMaterial.isReady(mesh)) {
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Clones the current material and its related sub materials
     * @param name Define the name of the newly cloned material
     * @param cloneChildren Define if submaterial will be cloned or shared with the parent instance
     * @returns the cloned material
     */
    clone(name, cloneChildren) {
        const newMultiMaterial = new MultiMaterial(name, this.getScene());
        for (let index = 0; index < this.subMaterials.length; index++) {
            let subMaterial = null;
            const current = this.subMaterials[index];
            if (cloneChildren && current) {
                subMaterial = current.clone(name + "-" + current.name);
            }
            else {
                subMaterial = this.subMaterials[index];
            }
            newMultiMaterial.subMaterials.push(subMaterial);
        }
        return newMultiMaterial;
    }
    /**
     * Serializes the materials into a JSON representation.
     * @returns the JSON representation
     */
    serialize() {
        const serializationObject = {};
        serializationObject.name = this.name;
        serializationObject.id = this.id;
        serializationObject.uniqueId = this.uniqueId;
        if (Tags) {
            serializationObject.tags = Tags.GetTags(this);
        }
        serializationObject.materialsUniqueIds = [];
        serializationObject.materials = [];
        for (let matIndex = 0; matIndex < this.subMaterials.length; matIndex++) {
            const subMat = this.subMaterials[matIndex];
            if (subMat) {
                serializationObject.materialsUniqueIds.push(subMat.uniqueId);
                serializationObject.materials.push(subMat.id);
            }
            else {
                serializationObject.materialsUniqueIds.push(null);
                serializationObject.materials.push(null);
            }
        }
        return serializationObject;
    }
    /**
     * Dispose the material and release its associated resources
     * @param forceDisposeEffect Define if we want to force disposing the associated effect (if false the shader is not released and could be reuse later on)
     * @param forceDisposeTextures Define if we want to force disposing the associated textures (if false, they will not be disposed and can still be use elsewhere in the app)
     * @param forceDisposeChildren Define if we want to force disposing the associated submaterials (if false, they will not be disposed and can still be use elsewhere in the app)
     */
    dispose(forceDisposeEffect, forceDisposeTextures, forceDisposeChildren) {
        const scene = this.getScene();
        if (!scene) {
            return;
        }
        if (forceDisposeChildren) {
            for (let index = 0; index < this.subMaterials.length; index++) {
                const subMaterial = this.subMaterials[index];
                if (subMaterial) {
                    subMaterial.dispose(forceDisposeEffect, forceDisposeTextures);
                }
            }
        }
        const index = scene.multiMaterials.indexOf(this);
        if (index >= 0) {
            scene.multiMaterials.splice(index, 1);
        }
        super.dispose(forceDisposeEffect, forceDisposeTextures);
    }
    /**
     * Creates a MultiMaterial from parsed MultiMaterial data.
     * @param parsedMultiMaterial defines parsed MultiMaterial data.
     * @param scene defines the hosting scene
     * @returns a new MultiMaterial
     */
    static ParseMultiMaterial(parsedMultiMaterial, scene) {
        const multiMaterial = new MultiMaterial(parsedMultiMaterial.name, scene);
        multiMaterial.id = parsedMultiMaterial.id;
        multiMaterial._loadedUniqueId = parsedMultiMaterial.uniqueId;
        if (Tags) {
            Tags.AddTagsTo(multiMaterial, parsedMultiMaterial.tags);
        }
        if (parsedMultiMaterial.materialsUniqueIds) {
            multiMaterial._waitingSubMaterialsUniqueIds = parsedMultiMaterial.materialsUniqueIds;
        }
        else {
            parsedMultiMaterial.materials.forEach((subMatId) => multiMaterial.subMaterials.push(scene.getLastMaterialById(subMatId)));
        }
        return multiMaterial;
    }
}
RegisterClass("BABYLON.MultiMaterial", MultiMaterial);
//# sourceMappingURL=multiMaterial.js.map