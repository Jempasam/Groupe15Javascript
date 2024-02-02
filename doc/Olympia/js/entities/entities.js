class Entities {
    constructor(name, x,y,z,xSize,ySize,zSize,color,scene) {
        // Code for entity constructor
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
        this.xSize = xSize;
        this.ySize = ySize;
        this.zSize = zSize;
        this.color = color;

        this.mesh = this.createMesh(scene);

    }

    //créer le mesh de l'entité
    createMesh(scene){
        this.mesh = BABYLON.MeshBuilder.CreateBox(this.name, {height: 1, width: 1, depth: 1}, scene);
        this.mesh.scaling.x = this.xSize;
        this.mesh.scaling.y = this.ySize;
        this.mesh.scaling.z = this.zSize;
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        this.mesh.material = new BABYLON.StandardMaterial("entityMaterial", scene);
        this.mesh.material.diffuseColor = this.color;
        this.mesh.checkCollisions = true;
        console.log(this.mesh.name+" mesh créé");
        this.x = this.mesh.position.x;
        this.y = this.mesh.position.y;
        this.z = this.mesh.position.z;

        return this.mesh;

        
    }

    move(){

    }
}

export default Entities;