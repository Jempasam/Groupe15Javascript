import { AbstractMesh, Color3, Color4, Mesh, MeshBuilder, Scene, SceneLoader, StandardMaterial } from "../../../../babylonjs/core/index.js"
import "../../../../babylonjs/loaders/index.js"


/**
 * @returns {Promise<(scene:Scene)=>AbstractMesh>}
 */
async function model(scene,name,dir=""){
    if(dir.length>0)dir+="/"
    //const model=(await SceneLoader.ImportMeshAsync("", "../../olympia/assets/"+dir,  `${name}.glb`, scene)).meshes[0]
    const assets=await SceneLoader.LoadAssetContainerAsync(import.meta.resolve("../../../assets/"+dir), `${name}.glb`, scene)
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
            const mesh = MeshBuilder.CreateBox("box", {size: 1}, scene);
            mesh.material = new StandardMaterial("box", scene);
            mesh.material.diffuseColor = Color3.White();
            return mesh
        },

        PANDA: await model(scene,"panda","animal"),
        KANGAROO: await model(scene,"kangaroo","animal"),
        BAD_KANGAROO: await model(scene,"bad_kangaroo","animal"),
        BIRD: await model(scene,"bird","animal"),
        BONNET: await model(scene,"bonnet","animal"),
        SPHINX: await model(scene,"sphinx","animal"),
        DEMON: await model(scene,"demon","animal"),


        BLOCK: await model(scene,"block"),
        BARRIL: await model(scene,"barril"),
        TRAMPOLINE: await model(scene,"trampoline"),
        PILLAR: await model(scene,"Pillar"),
        BRIDGE: await model(scene,"Bridge"),
        STONE: await model(scene,"stone"),
        ROCK: await model(scene,"rock"),
        STONE_WALL: await model(scene,"stonewall"),
        WOOD: await model(scene,"wood"),
        MAGMA: await model(scene,"magma"),
        HOLE: await model(scene,"hole"),
        BUILDING: await model(scene,"building"),
        PANNIER: await model(scene,"pannier"),

        CACTUS: await model(scene,"cactus","decoration"),
        CACTUS2: await model(scene,"cactus2","decoration"),
        CACTUS3: await model(scene,"cactus3","decoration"),
        
        ARTIFACT: await model(scene,"Artifact"),
        BOMB: await model(scene,"bomb"),
        BASKETBALL: await model(scene,"basketball"),

        LAVA: await model(scene,"lava"),
        MUD: await model(scene,"mud"),
        ICE: await model(scene,"ice"),

        QUESTION_MARK: await model(scene,"questionmark"),
        EXCLAMATION_MARK: await model(scene,"exclamationmark"),
        HEART: await model(scene,"heart"),

        EXPLOSION: await model(scene,"explosion","particle"),
        SPHERE_EXPLOSION: await model(scene,"sphere_explosion","particle"),
        SPHERE_EXPLOSION2: await model(scene,"sphere_explosion2","particle"),
        SPHERE_EXPLOSION3: await model(scene,"sphere_explosion3","particle"),

        PARTICLE_CLOUD: await model(scene,"cloud","particle"),
        PARTICLE_FIRE: await model(scene,"fire","particle"),
        PARTICLE_ROCK: await model(scene,"rock","particle"),
        PARTICLE_WATER: await model(scene,"water","particle"),
        PARTICLE_WIND: await model(scene,"wind","particle"),
        PARTICLE_BATS: await model(scene,"bats","particle"),
        PARTICLE_VORTEX: await model(scene,"vortex","particle"),
        PARTICLE_SMOKE: await model(scene,"smoke","particle"),
        PARTICLE_SLASH: await model(scene,"slash","particle"),
        PARTICLE_PINGPONG: await model(scene,"pingpong","particle"),
        PARTICLE_FLAME: await model(scene,"flame","particle"),
        PARTICLE_BLOOD: await model(scene,"blood","particle"),
        PARTICLE_WOOD: await model(scene,"wood","particle"),

        _nothing: scene.createDefaultEnvironment({createSkybox:false,createGround:false,toneMappingEnabled:false})
    }
}

/** @typedef {Awaited<ReturnType<loadModels>>} ModelLibrary*/