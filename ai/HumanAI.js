import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class HumanAI{

    constructor(human){

        this.human=human;

        this.state="wander";

        this.targetZombie=null;

        this.wanderTimer=0;

        this.sightRange=40;

        this.attackRange=20;

        this.fleeRange=6;

    }

    update(dt,humans,zombies){

        if(!this.human.alive)return;

        this.wanderTimer-=dt;

        this.findTarget(zombies);

        if(this.targetZombie){

            const d=this.distance(

                this.human.mesh.position,

                this.targetZombie.mesh.position

            );

            if(d<this.fleeRange){

                this.flee(dt);

            }

            else if(d<this.attackRange){

                this.attack();

            }

            else{

                this.chase(dt);

            }

        }

        else{

            this.wander(dt);

        }

    }

    findTarget(zombies){

        let nearest=null;

        let dist=Infinity;

        for(const z of zombies){

            if(!z.alive)continue;

            const d=this.distance(

                this.human.mesh.position,

                z.mesh.position

            );

            if(d<this.sightRange&&d<dist){

                dist=d;

                nearest=z;

            }

        }

        this.targetZombie=nearest;

    }

    wander(dt){

        if(this.wanderTimer<=0){

            this.wanderTimer=2+Math.random()*3;

            this.human.direction=Math.random()*Math.PI*2;

        }

        this.human.update(dt);

    }

    chase(dt){

        this.human.moveTo(

            this.targetZombie.mesh.position.x,

            this.targetZombie.mesh.position.z

        );

        this.human.update(dt);

    }

    flee(dt){

        const dx=this.human.mesh.position.x-

                 this.targetZombie.mesh.position.x;

        const dz=this.human.mesh.position.z-

                 this.targetZombie.mesh.position.z;

        this.human.direction=Math.atan2(dx,dz);

        this.human.update(dt);

    }

    attack(){

        if(!this.human.weapon)return;

        this.human.weapon.fire(

            this.human.mesh.position.clone().add(

                new THREE.Vector3(0,3,0)

            ),

            new THREE.Vector3(

                this.targetZombie.mesh.position.x-

                this.human.mesh.position.x,

                .1,

                this.targetZombie.mesh.position.z-

                this.human.mesh.position.z

            ).normalize()

        );

    }

    distance(a,b){

        return Math.sqrt(

            (a.x-b.x)*(a.x-b.x)+

            (a.z-b.z)*(a.z-b.z)

        );

    }

}
