import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Player{

    constructor(camera){

        this.camera=camera;

        this.position=new THREE.Vector3(0,2,15);

        this.velocity=new THREE.Vector3();

        this.direction=new THREE.Vector3();

        this.speed=6;

        this.sprintSpeed=10;

        this.jumpForce=7;

        this.gravity=18;

        this.verticalVelocity=0;

        this.onGround=true;

        this.height=2;

        this.health=100;

        this.maxHealth=100;

        this.alive=true;

        this.inVehicle=false;

        this.vehicle=null;

        this.weapon=null;

        this.keys={};

        this.yaw=0;

        this.pitch=0;

        this.pointerLocked=false;

        this.setupControls();

    }

    setupControls(){

        window.addEventListener("keydown",e=>{

            this.keys[e.key.toLowerCase()]=true;

        });

        window.addEventListener("keyup",e=>{

            this.keys[e.key.toLowerCase()]=false;

        });

        document.body.addEventListener("click",()=>{

            document.body.requestPointerLock();

        });

        document.addEventListener("pointerlockchange",()=>{

            this.pointerLocked=document.pointerLockElement===document.body;

        });

        document.addEventListener("mousemove",e=>{

            if(!this.pointerLocked)return;

            this.yaw-=e.movementX*0.0025;

            this.pitch-=e.movementY*0.0025;

            const limit=Math.PI/2-0.05;

            this.pitch=Math.max(-limit,Math.min(limit,this.pitch));

        });

    }

    update(dt){

        if(!this.alive)return;

        if(this.inVehicle)return;

        const moveSpeed=this.keys["shift"]
            ?this.sprintSpeed
            :this.speed;

        this.direction.set(0,0,0);

        const forward=new THREE.Vector3(

            Math.sin(this.yaw),

            0,

            Math.cos(this.yaw)

        );

        const right=new THREE.Vector3(

            Math.cos(this.yaw),

            0,

            -Math.sin(this.yaw)

        );

        if(this.keys["w"])

            this.direction.add(forward);

        if(this.keys["s"])

            this.direction.sub(forward);

        if(this.keys["d"])

            this.direction.add(right);

        if(this.keys["a"])

            this.direction.sub(right);

        if(this.direction.length()>0){

            this.direction.normalize();

        }

        this.velocity.x=this.direction.x*moveSpeed;

        this.velocity.z=this.direction.z*moveSpeed;

        if(this.keys[" "]&&this.onGround){

            this.verticalVelocity=this.jumpForce;

            this.onGround=false;

        }

        this.verticalVelocity-=this.gravity*dt;

        this.position.x+=this.velocity.x*dt;

        this.position.z+=this.velocity.z*dt;

        this.position.y+=this.verticalVelocity*dt;

        if(this.position.y<2){

            this.position.y=2;

            this.verticalVelocity=0;

            this.onGround=true;

        }

        this.camera.position.copy(this.position);

        this.camera.rotation.order="YXZ";

        this.camera.rotation.y=this.yaw;

        this.camera.rotation.x=this.pitch;

    }

    damage(amount){

        if(!this.alive)return;

        this.health-=amount;

        if(this.health<=0){

            this.health=0;

            this.alive=false;

        }

    }

    heal(amount){

        this.health=Math.min(

            this.maxHealth,

            this.health+amount

        );

    }

    enterVehicle(vehicle){

        if(this.inVehicle)return;

        this.vehicle=vehicle;

        this.inVehicle=true;

        vehicle.enter(this);

    }

    exitVehicle(){

        if(!this.vehicle)return;

        this.vehicle.exit();

        this.vehicle=null;

        this.inVehicle=false;

    }

    giveWeapon(weapon){

        this.weapon=weapon;

    }

    shoot(){

        if(!this.weapon)return;

        const dir=new THREE.Vector3(

            Math.sin(this.yaw),

            -Math.sin(this.pitch),

            Math.cos(this.yaw)

        ).normalize();

        const origin=this.camera.position.clone();

        origin.y-=0.2;

        this.weapon.fire(origin,dir);

    }

}
