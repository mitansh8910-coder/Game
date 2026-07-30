import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";
import { HumanModel } from "../models/HumanModel.js";

export class Human{

    constructor(scene,x=0,z=0){

        this.scene=scene;

        this.model=new HumanModel();

        this.mesh=this.model.mesh;

        this.mesh.position.set(x,0,z);

        scene.add(this.mesh);

        this.health=100;

        this.maxHealth=100;

        this.alive=true;

        this.infected=false;

        this.speed=2+Math.random();

        this.target=null;

        this.velocity=new THREE.Vector3();

        this.direction=Math.random()*Math.PI*2;

        this.walkTime=0;

        this.attackCooldown=0;

        this.weapon="pistol";

    }

    update(dt){

        if(!this.alive)return;

        this.walkTime+=dt;

        this.attackCooldown=Math.max(0,this.attackCooldown-dt);

        if(!this.target){

            this.direction+=(Math.random()-.5)*dt;

        }

        this.velocity.x=Math.sin(this.direction)*this.speed*dt;

        this.velocity.z=Math.cos(this.direction)*this.speed*dt;

        this.mesh.position.add(this.velocity);

        this.mesh.rotation.y=this.direction;

        this.animate();

    }

    animate(){

        const t=this.walkTime*8;

        if(this.mesh.children.length<8)return;

        this.mesh.children[6].rotation.x=Math.sin(t)*0.6;
        this.mesh.children[7].rotation.x=-Math.sin(t)*0.6;
        this.mesh.children[4].rotation.x=-Math.sin(t)*0.5;
        this.mesh.children[5].rotation.x=Math.sin(t)*0.5;

    }

    moveTo(x,z){

        const dx=x-this.mesh.position.x;

        const dz=z-this.mesh.position.z;

        this.direction=Math.atan2(dx,dz);

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

    heal(amount){

        this.health=Math.min(

            this.maxHealth,

            this.health+amount

        );

    }

    infect(){

        this.infected=true;

    }

    shoot(){

        if(this.attackCooldown>0)return false;

        this.attackCooldown=.3;

        return true;

    }

    getPosition(){

        return this.mesh.position;

    }

}
