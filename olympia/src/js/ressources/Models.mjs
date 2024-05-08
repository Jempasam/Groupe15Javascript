
async function model(scene,name){
    const model=(await BABYLON.SceneLoader.ImportMeshAsync("", "../../olympia/assets/",  `${name}.glb`, scene)).meshes[0]
    console.log(model)
    model.position.x=99999
    return model
}

export async function loadModels(scene){
    const panda=await model(scene,"Panda");
    const block=await model(scene,"block");
    const pillar=await model(scene,"Pillar");
    const bridge=await model(scene,"Bridge");
    const stone=await model(scene,"Stone");
    return {
        CUBE: function(scene){
            const mesh = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
            mesh.material = new BABYLON.StandardMaterial("box", scene);
            mesh.material.diffuseColor = BABYLON.Color3.White();
            return mesh
        },
        PANDA: function(scene){ return panda.clone() },
        BLOCK: function(scene){ return block.clone() },
        PILLAR: function(scene){ return pillar.clone() },
        BRIDGE: function(scene){ return bridge.clone() },
        STONE: function(scene){ return stone.clone() },
    }
}