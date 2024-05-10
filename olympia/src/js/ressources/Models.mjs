
async function model(scene,name,dir=""){
    if(dir.length>0)dir+="/"
    const model=(await BABYLON.SceneLoader.ImportMeshAsync("", "../../olympia/assets/"+dir,  `${name}.glb`, scene)).meshes[0]
    console.log(model)
    model.position.x=99999
    return function(scene){ return model.clone() }
}

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

        PARTICLE_CLOUD: await model(scene,"cloud","particle"),
        PARTICLE_FIRE: await model(scene,"fire","particle"),
        PARTICLE_ROCK: await model(scene,"rock","particle"),
        PARTICLE_WATER: await model(scene,"water","particle"),
        PARTICLE_WIND: await model(scene,"wind","particle"),
        PARTICLE_BATS: await model(scene,"bats","particle"),
        PARTICLE_VORTEX: await model(scene,"vortex","particle"),
    }
}

/** @typedef {Awaited<ReturnType<loadModels>>} ModelLibrary*/