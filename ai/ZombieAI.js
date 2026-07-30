import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class ZombieAI{

    constructor(zombie){

        this.zombie=zombie;

        this.state="wander";

        this.target=null;

        this.hearingRange=80;

        this.sightRange=50;

        this.attackRange=1.6;

        this.wanderTimer=0;

        this.lastGunshot=null;

    }

    update(dt,humans,zombies){

        if(!this.zombie.alive)return;

        this.findNearestHuman(humans);

        if(this.target){

            this.state="hunt";

            this.hunt(dt);

        }else{

            this.state="wander";

            this.wander(dt);

        }

        this.followHorde(zombies);

    }

    findNearestHuman(humans){

        let best=null;

        let dist=Infinity;

        for(const h of humans){

            if(!h.alive)continue;

            if(h.infected)continue;

            const d=this.zombie.mesh.position.distanceTo(

                h.mesh.position

            );

            if(d<this.sightRange&&d<dist){

                dist=d;

                best=h;

            }

        }

        this.target=best;

    }

    hunt(dt){

        const p=this.target.mesh.position;

        const z=this.zombie.mesh.position;

        const dir=new THREE.Vector3(

            p.x-z.x,

            0,

            p.z-z.z

        );

        const d=dir.length();

        if(d>0){

            dir.normalize();

            this.zombie.mesh.position.add(

                dir.multiplyScalar(

                    this.zombie.speed*dt

                )

            );

            this.zombie.mesh.lookAt(

                p.x,

                z.y,

                p.z

            );

        }

        if(d<this.attackRange){

            this.zombie.attack(this.target);

        }

    }

    wander(dt){

        this.wanderTimer-=dt;

        if(this.wanderTimer<=0){

            this.wanderTimer=2+Math.random()*4;

            this.direction=Math.random()*Math.PI*2;

        }

        this.zombie.mesh.position.x+=

            Math.sin(this.direction)*

            this.zombie.speed*.35*dt;

        this.zombie.mesh.position.z+=

            Math.cos(this.direction)*

            this.zombie.speed*.35*dt;

    }

    hearGunshot(position){

        if(

            this.zombie.mesh.position.distanceTo(

                position

            )<this.hearingRange

        ){

            this.lastGunshot=position.clone();

        }

    }

    followHorde(zombies){

        let cx=0;

        let cz=0;

        let count=0;

        for(const z of zombies){

            if(z===this.zombie)continue;

            if(!z.alive)continue;

            const d=this.zombie.mesh.position.distanceTo(

                z.mesh.position

            );

            if(d<8){

                cx+=z.mesh.position.x;

                cz+=z.mesh.position.z;

                count++;

            }

        }

        if(count>0){

            cx/=count;

            cz/=count;

            this.zombie.mesh.position.x+=

                (cx-this.zombie.mesh.position.x)*0.003;

            this.zombie.mesh.position.z+=

                (cz-this.zombie.mesh.position.z)*0.003;

        }

    }

}
