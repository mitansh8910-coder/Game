import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class BulletManager {

    constructor(scene, camera, zombies) {

        this.scene = scene;
        this.camera = camera;
        this.zombies = zombies;

        this.bullets = [];

        this.speed = 3;
        this.damage = 40;

        this.canShoot = true;

        window.addEventListener("mousedown", () => {

            if (this.canShoot) {

                this.shoot();

                this.canShoot = false;

                setTimeout(() => {
                    this.canShoot = true;
                }, 120);

            }

        });

    }

    shoot() {

        const bullet = new THREE.Mesh(

            new THREE.SphereGeometry(0.08,8,8),

            new THREE.MeshBasicMaterial({
                color:0xffff00
            })

        );

        bullet.position.copy(this.camera.position);

        const direction = new THREE.Vector3();

        this.camera.getWorldDirection(direction);

        bullet.userData = {

            velocity: direction.clone(),

            life: 200

        };

        this.scene.add(bullet);

        this.bullets.push(bullet);

    }

    update() {

        for(let i=this.bullets.length-1;i>=0;i--){

            const bullet=this.bullets[i];

            bullet.position.add(

                bullet.userData.velocity.clone()

                .multiplyScalar(this.speed)

            );

            bullet.userData.life--;

            if(bullet.userData.life<=0){

                this.scene.remove(bullet);

                this.bullets.splice(i,1);

                continue;

            }

            for(let j=this.zombies.zombies.length-1;j>=0;j--){

                const zombie=this.zombies.zombies[j];

                if(

                    bullet.position.distanceTo(

                        zombie.position

                    )<1

                ){

                    zombie.userData.health-=this.damage;

                    this.scene.remove(bullet);

                    this.bullets.splice(i,1);

                    if(zombie.userData.health<=0){

                        this.scene.remove(zombie);

                        this.zombies.zombies.splice(j,1);

                    }

                    break;

                }

            }

        }

    }

}
