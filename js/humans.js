import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class HumanManager {

    constructor(scene) {

        this.scene = scene;
        this.humans = [];

        this.spawnHumans(30);

    }

    spawnHumans(count) {

        for (let i = 0; i < count; i++) {

            const human = this.createHuman();

            human.position.set(
                (Math.random() - 0.5) * 250,
                0,
                (Math.random() - 0.5) * 250
            );

            human.userData = {

                health: 100,

                infected: false,

                direction: Math.random() * Math.PI * 2,

                speed: 0.015 + Math.random() * 0.02,

                timer: 60 + Math.random() * 180

            };

            this.scene.add(human);
            this.humans.push(human);

        }

    }

    createHuman() {

        const group = new THREE.Group();

        const shirtColors = [
            0x4287f5,
            0xe63946,
            0xf4a261,
            0x2a9d8f,
            0x9b5de5,
            0xf72585
        ];

        const skin = new THREE.MeshStandardMaterial({
            color: 0xf1c27d
        });

        const shirt = new THREE.MeshStandardMaterial({
            color: shirtColors[
                Math.floor(Math.random() * shirtColors.length)
            ]
        });

        const pants = new THREE.MeshStandardMaterial({
            color: 0x333333
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
            color: 0x000000
        });

        const eye1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.03,8,8),
            eyeMaterial
        );

        eye1.position.set(-0.1,2.25,0.31);
        group.add(eye1);

        const eye2 = eye1.clone();
        eye2.position.x = 0.1;
        group.add(eye2);

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8,1,0.45),
            shirt
        );

        body.position.y = 1.35;
        group.add(body);

        // Arms
        for(let i=-1;i<=1;i+=2){

            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(0.22,0.9,0.22),
                skin
            );

            arm.position.set(i*0.52,1.35,0);
            group.add(arm);

        }

        // Legs
        for(let i=-1;i<=1;i+=2){

            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.25,0.9,0.25),
                pants
            );

            leg.position.set(i*0.18,0.45,0);
            group.add(leg);

        }

        return group;

    }

    update(delta){

        this.humans.forEach(human=>{

            const data = human.userData;

            data.timer -= delta*60;

            if(data.timer<=0){

                data.timer = 60 + Math.random()*180;

                data.direction +=
                    (Math.random()-0.5)*2;

            }

            human.position.x +=
                Math.sin(data.direction)*data.speed;

            human.position.z +=
                Math.cos(data.direction)*data.speed;

            human.rotation.y = data.direction;

            // Keep inside map

            human.position.x =
                Math.max(
                    -480,
                    Math.min(480,human.position.x)
                );

            human.position.z =
                Math.max(
                    -480,
                    Math.min(480,human.position.z)
                );

        });

    }

}
