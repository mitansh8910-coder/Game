import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Roads{

    constructor(world){

        this.world=world;
        this.scene=world.scene;

        this.tileSize=world.tileSize;
        this.gridSize=world.gridSize;

        this.roadMaterial=new THREE.MeshStandardMaterial({
            color:0x303030
        });

        this.lineMaterial=new THREE.MeshStandardMaterial({
            color:0xffff55
        });

        this.sidewalkMaterial=new THREE.MeshStandardMaterial({
            color:0xbdbdbd
        });

    }

    generate(){

        const half=this.gridSize/2;

        for(let x=0;x<this.gridSize;x++){

            for(let z=0;z<this.gridSize;z++){

                const wx=(x-half)*this.tileSize+this.tileSize/2;
                const wz=(z-half)*this.tileSize+this.tileSize/2;

                if(x%5===0||z%5===0){

                    this.createRoad(wx,wz);

                    this.world.addTile({
                        x:wx,
                        z:wz,
                        type:"road"
                    });

                }else{

                    this.world.addTile({
                        x:wx,
                        z:wz,
                        type:"empty"
                    });

                }

            }

        }

    }

    createRoad(x,z){

        const road=new THREE.Mesh(

            new THREE.BoxGeometry(
                this.tileSize,
                0.05,
                this.tileSize
            ),

            this.roadMaterial

        );

        road.position.set(
            x,
            0.025,
            z
        );

        road.receiveShadow=true;

        this.world.addRoad(road);

        this.createLaneMarking(x,z);

        this.createSidewalk(x,z);

    }

    createLaneMarking(x,z){

        const mark=new THREE.Mesh(

            new THREE.BoxGeometry(
                0.35,
                0.06,
                this.tileSize*0.55
            ),

            this.lineMaterial

        );

        mark.position.set(
            x,
            0.06,
            z
        );

        this.scene.add(mark);

    }

    createSidewalk(x,z){

        const s=this.tileSize;

        const geo=new THREE.BoxGeometry(
            s,
            0.18,
            1
        );

        const north=new THREE.Mesh(
            geo,
            this.sidewalkMaterial
        );

        north.position.set(
            x,
            0.09,
            z+s/2-0.5
        );

        this.scene.add(north);

        const south=north.clone();

        south.position.z=z-s/2+0.5;

        this.scene.add(south);

        const geo2=new THREE.BoxGeometry(
            1,
            0.18,
            s
        );

        const east=new THREE.Mesh(
            geo2,
            this.sidewalkMaterial
        );

        east.position.set(
            x+s/2-0.5,
            0.09,
            z
        );

        this.scene.add(east);

        const west=east.clone();

        west.position.x=x-s/2+0.5;

        this.scene.add(west);

    }

}
