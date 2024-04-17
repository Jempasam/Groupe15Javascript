
async function model(scene,name){
    const model=(await BABYLON.SceneLoader.ImportMeshAsync("", "../../olympia/assets/",  `${name}.glb`, scene)).meshes[0]
    console.log(model)
    model.position.x=99999
    return model
}

export async function loadModels(scene){
    const panda=await model(scene,"Panda");
    return {
        CUBE: function(scene){
            const mesh = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
            mesh.material = new BABYLON.StandardMaterial("box", scene);
            mesh.material.diffuseColor = BABYLON.Color3.White();
            return mesh
        },
        PANDA: function(scene){
            const mesh = panda.clone()
            return mesh
        }
    }
}