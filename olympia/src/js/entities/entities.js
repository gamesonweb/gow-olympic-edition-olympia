class Entities {
    constructor(name, x,y,z,xSize,ySize,zSize, baseMesh) {
        // Code for entity constructor
        this.name = name;
        this.x = x;
        this.y = y;
        this.z = z;
        this.xSize = xSize;
        this.ySize = ySize;
        this.zSize = zSize;

        this.mesh = this.createMesh(baseMesh);

    }
    //créer le mesh de l'entité
    createMesh(baseMesh){
        this.mesh = baseMesh.createInstance(this.name);
        this.mesh.scaling.x = this.xSize;
        this.mesh.scaling.y = this.ySize;
        this.mesh.scaling.z = this.zSize;

        //update la hitbox
        this.mesh.refreshBoundingInfo();
        this.mesh.position = new BABYLON.Vector3(this.x, this.y, this.z);
        
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