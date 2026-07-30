import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Collision{

    constructor(world){

        this.world=world;

        this.boxes=[];

    }

    build(){

        this.boxes=[];

        for(const b of this.world.buildings){

            const box=new THREE.Box3().setFromObject(b);

            this.boxes.push(box);

        }

    }

    add(object){

        const box=new THREE.Box3().setFromObject(object);

        this.boxes.push(box);

    }

    remove(object){

        this.boxes=this.boxes.filter(

            b=>!b.equals(

                new THREE.Box3().setFromObject(object)

            )

        );

    }

    check(position,radius=1){

        const sphere=new THREE.Sphere(

            new THREE.Vector3(

                position.x,

                position.y||1,

                position.z

            ),

            radius

        );

        for(const box of this.boxes){

            if(box.intersectsSphere(sphere)){

                return true;

            }

        }

        return false;

    }

    move(position,dx,dz,radius=1){

        const next={

            x:position.x+dx,

            y:position.y||1,

            z:position.z+dz

        };

        if(this.check(next,radius)){

            return position;

        }

        return next;

    }

    raycast(origin,direction,length=100){

        const ray=new THREE.Ray(

            new THREE.Vector3(

                origin.x,

                origin.y,

                origin.z

            ),

            new THREE.Vector3(

                direction.x,

                direction.y,

                direction.z

            ).normalize()

        );

        let nearest=null;

        let distance=Infinity;

        for(const box of this.boxes){

            const hit=new THREE.Vector3();

            if(ray.intersectBox(box,hit)){

                const d=hit.distanceTo(

                    new THREE.Vector3(

                        origin.x,

                        origin.y,

                        origin.z

                    )

                );

                if(d<distance&&d<=length){

                    distance=d;

                    nearest=hit.clone();

                }

            }

        }

        return nearest;

    }

    getBoxes(){

        return this.boxes;

    }

    clear(){

        this.boxes=[];

    }

}
