import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";
import { ZombieModel } from "../models/ZombieModel.js";

export class Zombie{

    constructor(scene,x=0,z=0,type="walker"){

        this.scene=scene;

        this.type=type;

        this.model=new ZombieModel(type);

        this.mesh=this.model.mesh;

        this.mesh.position.set(x,0,z);

        scene.add(this.mesh);

        this.alive=true;

        this.health=100;

        this.maxHealth=100;

        this.damage=10;

        this.attackRange=1.6;

        this.attackCooldown=0;

        this.walkTime=0;

        this.target=null;

        this.velocity=new THREE.Vector3();

        switch(type){

            case "runner":
                this.speed=4;
                this.damage=8;
                this.health=80;
                break;

            case "brute":
                this.speed=1.5;
                this.damage=22;
                this.health=220;
                break;

            default:
                this.speed=2.3;

        }

    }

    update(dt){

        if(!this.alive)return;

        this.walkTime+=dt;

        this.attackCooldown=Math.max(0,this.attackCooldown-dt);

        if(this.target&&this.target.alive){

            const dx=this.target.mesh.position.x-this.mesh.position.x;

            const dz=this.target.mesh.position.z-this.mesh.position.z;

            const d=Math.sqrt(dx*dx+dz*dz);

            if(d>0){

                this.mesh.position.x+=dx/d*this.speed*dt;

                this.mesh.position.z+=dz/d*this.speed*dt;

                this.mesh.rotation.y=Math.atan2(dx,dz);

            }

            if(d<this.attackRange){

                this.attack(this.target);

            }

        }

        this.animate();

    }

    animate(){

        const t=this.walkTime*7;

        if(this.mesh.children.length<8)return;

        this.mesh.children[6].rotation.x=Math.sin(t)*0.9;
        this.mesh.children[7].rotation.x=-Math.sin(t)*0.9;

        this.mesh.children[4].rotation.x=Math.sin(t)*0.7+.7;
        this.mesh.children[5].rotation.x=-Math.sin(t)*0.7+.7;

    }

    findTarget(humans){

        let nearest=null;

        let dist=Infinity;

        for(const h of humans){

            if(!h.alive)continue;

            if(h.infected)continue;

            const dx=h.mesh.position.x-this.mesh.position.x;

            const dz=h.mesh.position.z-this.mesh.position.z;

            const d=dx*dx+dz*dz;

            if(d<dist){

                dist=d;

                nearest=h;

            }

        }

        this.target=nearest;

    }

    attack(human){

        if(this.attackCooldown>0)return;

        this.attackCooldown=.8;

        human.damage(this.damage);

        if(Math.random()<0.35){

            human.infect();

        }

    }

    damage(amount){

        if(!this.alive)return;

        this.health-=amount;

        if(this.health<=0){

            this.health=0;

            this.alive=false;

            this.mesh.rotation.z=Math.PI/2;

        }

    }

    getPosition(){

        return this.mesh.position;

    }

}
