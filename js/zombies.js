import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class ZombieManager {

    constructor(scene) {

        this.scene = scene;
        this.zombies = [];

        this.spawnWave(18);

    }

    spawnWave(count) {

        for (let i = 0; i < count; i++) {

            const zombie = this.createZombie();

            zombie.position.set(
                (Math.random() - 0.5) * 400,
                0,
                (Math.random() - 0.5) * 400
            );

            zombie.userData = {

                health: 100,

                speed: 0.02 + Math.random() * 0.015,

                direction: Math.random() * Math.PI * 2,

                timer: 40 + Math.random() * 100,

                target: null,

                infected: true,

                attackDamage: 10

            };

            this.scene.add(zombie);
            this.zombies.push(zombie);

        }

    }

    createZombie() {

        const group = new THREE.Group();

        const skin = new THREE.MeshStandardMaterial({
            color: 0x4caf50
        });

        const shirt = new THREE.MeshStandardMaterial({
            color: 0x5b2c6f
        });

        const pants = new THREE.MeshStandardMaterial({
            color: 0x2d3436
        });

        // Head
        const head = new THREE.Mesh(

            new THREE.SphereGeometry(0.35,16,16),

            skin

        );

        head.position.y = 2.2;

        group.add(head);

        // Eyes

        const eyeMaterial = new THREE.MeshBasicMaterial({
            color:0xff0000
        });

        const eye1 = new THREE.Mesh(

            new THREE.SphereGeometry(0.04,8,8),

            eyeMaterial

        );

        eye1.position.set(-0.1,2.25,0.31);

        group.add(eye1);

        const eye2 = eye1.clone();

        eye2.position.x = 0.1;

        group.add(eye2);

        // Body

        const body = new THREE.Mesh(

            new THREE.BoxGeometry(
                0.8,
                1,
                0.45
            ),

            shirt

        );

        body.position.y = 1.35;

        group.add(body);

        // Arms

        for(let i=-1;i<=1;i+=2){

            const arm = new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.22,
                    0.9,
                    0.22
                ),

                skin

            );

            arm.position.set(
                i*0.52,
                1.35,
                0
            );

            arm.rotation.x=-0.7;

            group.add(arm);

        }

        // Legs

        for(let i=-1;i<=1;i+=2){

            const leg = new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.25,
                    0.9,
                    0.25
                ),

                pants

            );

            leg.position.set(
                i*0.18,
                0.45,
                0
            );

            group.add(leg);

        }

        return group;

    }

    update(delta){

        this.zombies.forEach(zombie=>{

            const data = zombie.userData;

            data.timer -= delta * 60;

            if(data.timer<=0){

                data.timer = 40 + Math.random()*100;

                data.direction +=
                    (Math.random()-0.5)*2;

            }

            zombie.position.x +=
                Math.sin(data.direction)
                * data.speed;

            zombie.position.z +=
                Math.cos(data.direction)
                * data.speed;

            zombie.rotation.y =
                data.direction;

            zombie.position.x =
                Math.max(
                    -480,
                    Math.min(480,zombie.position.x)
                );

            zombie.position.z =
                Math.max(
                    -480,
                    Math.min(480,zombie.position.z)
                );

        });

    }

}
