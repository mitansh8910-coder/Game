import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Pathfinding{

    constructor(world){

        this.world=world;

        this.obstacles=[];

        this.grid=[];

    }

    build(){

        this.obstacles=[];

        if(!this.world.buildings)return;

        for(const b of this.world.buildings){

            this.obstacles.push(

                new THREE.Box3().setFromObject(b)

            );

        }

    }

    isBlocked(position,radius=.5){

        const sphere=new THREE.Sphere(

            new THREE.Vector3(

                position.x,

                position.y||1,

                position.z

            ),

            radius

        );

        for(const box of this.obstacles){

            if(box.intersectsSphere(sphere))

                return true;

        }

        return false;

    }

    move(current,target,step){

        const dir=new THREE.Vector3(

            target.x-current.x,

            0,

            target.z-current.z

        );

        if(dir.lengthSq()<0.0001)

            return current;

        dir.normalize();

        let next={

            x:current.x+dir.x*step,

            y:current.y,

            z:current.z+dir.z*step

        };

        if(!this.isBlocked(next))

            return next;

        const angles=[

            Math.PI/4,
            -Math.PI/4,
            Math.PI/2,
            -Math.PI/2,
            Math.PI

        ];

        for(const a of angles){

            const d=dir.clone();

            d.applyAxisAngle(

                new THREE.Vector3(0,1,0),

                a

            );

            next={

                x:current.x+d.x*step,

                y:current.y,

                z:current.z+d.z*step

            };

            if(!this.isBlocked(next))

                return next;

        }

        return current;

    }

    followRoad(position){

        let best=null;

        let dist=Infinity;

        if(!this.world.tiles)

            return position;

        for(const t of this.world.tiles){

            if(t.type!=="road")

                continue;

            const dx=t.x-position.x;

            const dz=t.z-position.z;

            const d=dx*dx+dz*dz;

            if(d<dist){

                dist=d;

                best=t;

            }

        }

        if(best){

            return{

                x:best.x,

                y:position.y,

                z:best.z

            };

        }

        return position;

    }

    randomPoint(radius=30){

        return{

            x:(Math.random()-.5)*radius*2,

            y:0,

            z:(Math.random()-.5)*radius*2

        };

    }

    lineOfSight(start,end){

        const dir=new THREE.Vector3(

            end.x-start.x,

            0,

            end.z-start.z

        );

        const len=dir.length();

        dir.normalize();

        for(let d=0;d<len;d+=1){

            const p={

                x:start.x+dir.x*d,

                y:1,

                z:start.z+dir.z*d

            };

            if(this.isBlocked(p))

                return false;

        }

        return true;

    }

}
