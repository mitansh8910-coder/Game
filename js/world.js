import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class World {

    constructor(scene) {

        this.scene = scene;

        this.createGround();
        this.createLights();
        this.createRoads();
        this.createBuildings();
        this.createTrees();

    }

    createGround() {

        const ground = new THREE.Mesh(

            new THREE.PlaneGeometry(1000,1000),

            new THREE.MeshStandardMaterial({
                color:0x4c9a42
            })

        );

        ground.rotation.x = -Math.PI/2;
        ground.receiveShadow = true;

        this.scene.add(ground);

    }

    createLights(){

        const ambient = new THREE.AmbientLight(
            0xffffff,
            0.55
        );

        this.scene.add(ambient);

        const sun = new THREE.DirectionalLight(
            0xffffff,
            1.3
        );

        sun.position.set(100,200,100);

        sun.castShadow = true;

        this.scene.add(sun);

    }

    createRoads(){

        const roadMaterial = new THREE.MeshStandardMaterial({
            color:0x333333
        });

        for(let i=-400;i<=400;i+=120){

            const road1 = new THREE.Mesh(

                new THREE.BoxGeometry(
                    1000,
                    0.05,
                    18
                ),

                roadMaterial

            );

            road1.position.z=i;

            this.scene.add(road1);

            const road2 = new THREE.Mesh(

                new THREE.BoxGeometry(
                    18,
                    0.05,
                    1000
                ),

                roadMaterial

            );

            road2.position.x=i;

            this.scene.add(road2);

        }

    }

    createBuildings(){

        const colors=[
            0x888888,
            0x666666,
            0x999999,
            0x777777
        ];

        for(let i=0;i<120;i++){

            const w=10+Math.random()*18;
            const h=10+Math.random()*45;
            const d=10+Math.random()*18;

            const building=new THREE.Mesh(

                new THREE.BoxGeometry(
                    w,
                    h,
                    d
                ),

                new THREE.MeshStandardMaterial({
                    color:colors[
                        Math.floor(Math.random()*colors.length)
                    ]
                })

            );

            building.position.set(

                (Math.random()-0.5)*900,

                h/2,

                (Math.random()-0.5)*900

            );

            this.scene.add(building);

        }

    }

    createTrees(){

        for(let i=0;i<250;i++){

            const trunk=new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.5,
                    0.7,
                    4
                ),

                new THREE.MeshStandardMaterial({
                    color:0x6b4423
                })

            );

            trunk.position.set(

                (Math.random()-0.5)*950,

                2,

                (Math.random()-0.5)*950

            );

            this.scene.add(trunk);

            const leaves=new THREE.Mesh(

                new THREE.SphereGeometry(
                    2.5,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({
                    color:0x228b22
                })

            );

            leaves.position.copy(trunk.position);
            leaves.position.y=5;

            this.scene.add(leaves);

        }

    }

}
