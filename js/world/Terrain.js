import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Terrain{

    constructor(world){

        this.world=world;
        this.scene=world.scene;

    }

    create(){

        this.createSky();
        this.createFog();
        this.createLights();
        this.createGround();
        this.createGrass();
        this.createBoundary();

    }

    createSky(){

        this.scene.background=new THREE.Color(0x87ceeb);

    }

    createFog(){

        this.scene.fog=new THREE.Fog(
            0x87ceeb,
            180,
            900
        );

    }

    createLights(){

        const ambient=new THREE.AmbientLight(
            0xffffff,
            0.75
        );

        this.scene.add(ambient);

        const sun=new THREE.DirectionalLight(
            0xffffff,
            1.3
        );

        sun.position.set(
            250,
            350,
            180
        );

        sun.castShadow=true;

        sun.shadow.mapSize.width=4096;
        sun.shadow.mapSize.height=4096;

        sun.shadow.camera.left=-600;
        sun.shadow.camera.right=600;
        sun.shadow.camera.top=600;
        sun.shadow.camera.bottom=-600;

        this.scene.add(sun);

    }

    createGround(){

        const size=
            this.world.gridSize*
            this.world.tileSize;

        const ground=new THREE.Mesh(

            new THREE.PlaneGeometry(
                size,
                size,
                100,
                100
            ),

            new THREE.MeshStandardMaterial({

                color:0x4f9445

            })

        );

        ground.rotation.x=-Math.PI/2;

        ground.receiveShadow=true;

        this.scene.add(ground);

    }

    createGrass(){

        const material=
            new THREE.MeshStandardMaterial({

                color:0x4b8f3e

            });

        const geometry=
            new THREE.BoxGeometry(
                0.4,
                0.15,
                0.4
            );

        const half=
            this.world.gridSize*
            this.world.tileSize/2;

        for(let i=0;i<3500;i++){

            const grass=
                new THREE.Mesh(
                    geometry,
                    material
                );

            grass.position.set(

                Math.random()*half*2-half,

                0.07,

                Math.random()*half*2-half

            );

            grass.rotation.y=
                Math.random()*Math.PI*2;

            this.scene.add(grass);

        }

    }

    createBoundary(){

        const size=
            this.world.gridSize*
            this.world.tileSize;

        const wallMat=
            new THREE.MeshStandardMaterial({

                color:0x555555

            });

        const wallGeo=
            new THREE.BoxGeometry(
                size,
                40,
                2
            );

        const north=
            new THREE.Mesh(
                wallGeo,
                wallMat
            );

        north.position.set(
            0,
            20,
            -size/2
        );

        this.scene.add(north);

        const south=
            north.clone();

        south.position.z=size/2;

        this.scene.add(south);

        const sideGeo=
            new THREE.BoxGeometry(
                2,
                40,
                size
            );

        const west=
            new THREE.Mesh(
                sideGeo,
                wallMat
            );

        west.position.set(
            -size/2,
            20,
            0
        );

        this.scene.add(west);

        const east=
            west.clone();

        east.position.x=size/2;

        this.scene.add(east);

    }

}
