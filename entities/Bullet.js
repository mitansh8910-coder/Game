import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Bullet{

    constructor(scene,pos,dir,owner="human",damage=25,speed=90){

        this.scene=scene;

        this.owner=owner;

        this.damage=damage;

        this.speed=speed;

        this.life=3;

        this.alive=true;

        this.direction=dir.clone().normalize();

        this.mesh=new THREE.Mesh(

            new THREE.SphereGeometry(.08,8,8),

            new THREE.MeshBasicMaterial({

                color:owner==="human"
                    ?0xffff55
                    :0xff4444

            })

        );

        this.mesh.position.copy(pos);

        scene.add(this.mesh);

        this.trail=[];

    }

    update(dt,humans,zombies){

        if(!this.alive)return;

        this.life-=dt;

        if(this.life<=0){

            this.destroy();

            return;

        }

        this.mesh.position.add(

            this.direction.clone()

            .multiplyScalar(

                this.speed*dt

            )

        );

        this.updateTrail();

        if(this.owner==="human"){

            for(const z of zombies){

                if(!z.alive)continue;

                const d=this.mesh.position.distanceTo(

                    z.mesh.position

                );

                if(d<.8){

                    let dmg=this.damage;

                    if(this.mesh.position.y>

                       z.mesh.position.y+3.8){

                        dmg*=2;

                    }

                    z.damage(dmg);

                    this.destroy();

                    return;

                }

            }

        }

        else{

            for(const h of humans){

                if(!h.alive)continue;

                const d=this.mesh.position.distanceTo(

                    h.mesh.position

                );

                if(d<.8){

                    h.damage(this.damage);

                    this.destroy();

                    return;

                }

            }

        }

    }

    updateTrail(){

        const p=new THREE.Mesh(

            new THREE.SphereGeometry(.03,6,6),

            new THREE.MeshBasicMaterial({

                color:0xffffff,

                transparent:true,

                opacity:.35

            })

        );

        p.position.copy(this.mesh.position);

        this.scene.add(p);

        this.trail.push({

            mesh:p,

            life:.25

        });

        for(let i=this.trail.length-1;i>=0;i--){

            this.trail[i].life-=0.016;

            this.trail[i].mesh.material.opacity=

                Math.max(0,this.trail[i].life*4);

            if(this.trail[i].life<=0){

                this.scene.remove(

                    this.trail[i].mesh

                );

                this.trail.splice(i,1);

            }

        }

    }

    destroy(){

        this.alive=false;

        this.scene.remove(this.mesh);

        for(const t of this.trail){

            this.scene.remove(t.mesh);

        }

        this.trail=[];

    }

}
