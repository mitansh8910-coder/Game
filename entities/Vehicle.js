import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";
import { CarModel } from "../models/CarModel.js";

export class Vehicle{

    constructor(scene,x=0,z=0,type="sedan"){

        this.scene=scene;

        this.type=type;

        this.model=new CarModel(type);

        this.mesh=this.model.mesh;

        this.mesh.position.set(x,0,z);

        scene.add(this.mesh);

        this.driver=null;

        this.health=300;

        this.maxHealth=300;

        this.fuel=100;

        this.maxFuel=100;

        this.speed=0;

        this.maxSpeed=30;

        this.acceleration=18;

        this.brakePower=24;

        this.turnSpeed=2;

        this.velocity=new THREE.Vector3();

        this.enterDistance=3;

        this.engineOn=false;

        this.headlights=[];

        this.createLights();

    }

    createLights(){

        const left=new THREE.SpotLight(0xffffff,2,40,Math.PI/8,.4);

        left.position.set(2.5,1.4,.7);

        left.target.position.set(15,1.2,.7);

        this.mesh.add(left);

        this.mesh.add(left.target);

        this.headlights.push(left);

        const right=new THREE.SpotLight(0xffffff,2,40,Math.PI/8,.4);

        right.position.set(2.5,1.4,-.7);

        right.target.position.set(15,1.2,-.7);

        this.mesh.add(right);

        this.mesh.add(right.target);

        this.headlights.push(right);

    }

    enter(player){

        if(this.driver)return false;

        this.driver=player;

        this.engineOn=true;

        return true;

    }

    exit(){

        if(!this.driver)return;

        this.driver.position.x=this.mesh.position.x+3;

        this.driver.position.z=this.mesh.position.z;

        this.driver=this.driver=null;

        this.engineOn=false;

    }

    update(dt,input={}){

        if(!this.driver)return;

        if(this.fuel<=0)return;

        if(input.forward)

            this.speed=Math.min(

                this.maxSpeed,

                this.speed+

                this.acceleration*dt

            );

        if(input.backward)

            this.speed=Math.max(

                -10,

                this.speed-

                this.brakePower*dt

            );

        if(!input.forward&&!input.backward){

            this.speed*=.985;

        }

        if(input.left)

            this.mesh.rotation.y+=this.turnSpeed*dt*(this.speed/10);

        if(input.right)

            this.mesh.rotation.y-=this.turnSpeed*dt*(this.speed/10);

        const dir=new THREE.Vector3(

            Math.sin(this.mesh.rotation.y),

            0,

            Math.cos(this.mesh.rotation.y)

        );

        this.velocity.copy(dir)

        .multiplyScalar(this.speed*dt);

        this.mesh.position.add(this.velocity);

        this.fuel=Math.max(

            0,

            this.fuel-

            Math.abs(this.speed)*dt*.01

        );

        for(const h of this.headlights){

            h.target.position.copy(

                dir.clone()

                .multiplyScalar(20)

                .add(h.position)

            );

        }

    }

    hitZombie(zombie){

        if(!zombie.alive)return;

        const d=this.mesh.position.distanceTo(

            zombie.mesh.position

        );

        if(d<2.2&&Math.abs(this.speed)>5){

            zombie.damage(

                Math.abs(this.speed)*4

            );

            this.health-=2;

        }

    }

    damage(amount){

        this.health-=amount;

        if(this.health<=0){

            this.destroy();

        }

    }

    repair(amount){

        this.health=Math.min(

            this.maxHealth,

            this.health+amount

        );

    }

    refuel(amount){

        this.fuel=Math.min(

            this.maxFuel,

            this.fuel+amount

        );

    }

    destroy(){

        this.scene.remove(this.mesh);

    }

}
