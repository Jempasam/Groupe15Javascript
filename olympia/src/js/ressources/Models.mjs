import { AbstractMesh, Color3, Color4, Mesh, Scene, SceneLoader } from "../../../../babylonjs/core/index.js"
import "../../../../babylonjs/loaders/index.js"


/**
 * @returns {Promise<(scene:Scene)=>AbstractMesh>}
 */
async function model(scene,name,dir=""){
    if(dir.length>0)dir+="/"
    //const model=(await SceneLoader.ImportMeshAsync("", "../../olympia/assets/"+dir,  `${name}.glb`, scene)).meshes[0]
    const assets=await SceneLoader.LoadAssetContainerAsync("../../olympia/assets/"+dir, `${name}.glb`, scene)
    //model.position.x=99999
    return function(scene){
        const node=assets.instantiateModelsToScene(()=>name,false,{doNotInstantiate: false})
        node.animationGroups.forEach(ag=>ag.start(true))
        return node.rootNodes[0]
    }
    //return function(scene){ return assets.meshes[0].clone(name,null) }
}

/**
 * 
 * @param {Scene} scene 
 * @returns 
 */
export async function loadModels(scene){

    return {
        CUBE: function(scene){
            const mesh = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
            mesh.material = new BABYLON.StandardMaterial("box", scene);
            mesh.material.diffuseColor = BABYLON.Color3.White();
            return mesh
        },
        PANDA: await model(scene,"Panda"),
        BLOCK: await model(scene,"block"),
        PILLAR: await model(scene,"Pillar"),
        BRIDGE: await model(scene,"Bridge"),
        STONE: await model(scene,"Stone"),
        ARTIFACT: await model(scene,"Artifact"),
        SPHINX: await model(scene,"sphinx"),
        HOLE: await model(scene,"hole"),

        PARTICLE_CLOUD: await model(scene,"cloud","particle"),
        PARTICLE_FIRE: await model(scene,"fire","particle"),
        PARTICLE_ROCK: await model(scene,"rock","particle"),
        PARTICLE_WATER: await model(scene,"water","particle"),
        PARTICLE_WIND: await model(scene,"wind","particle"),
        PARTICLE_BATS: await model(scene,"bats","particle"),
        PARTICLE_VORTEX: await model(scene,"vortex","particle"),
        PARTICLE_SMOKE: await model(scene,"smoke","particle"),
        PARTICLE_SLASH: await model(scene,"slash","particle"),
        PARTICLE_FLAME: await model(scene,"flame","particle"),

        _nothing: scene.createDefaultEnvironment({createSkybox:false,createGround:false,toneMappingEnabled:false})
    }
}

/** @typedef {Awaited<ReturnType<loadModels>>} ModelLibrary*/