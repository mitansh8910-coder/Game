import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Decorations{

    constructor(world){

        this.world=world;
        this.scene=world.scene;

    }

    generate(){

        for(const t of this.world.tiles){

            if(t.type!="road") continue;

            if(Math.random()<0.35) this.createStreetLight(t.x+8,t.z+8);

            if(Math.random()<0.12) this.createBench(t.x-7,t.z+6);

            if(Math.random()<0.10) this.createTrashBin(t.x+7,t.z-6);

            if(Math.random()<0.08) this.createCar(t.x,t.z);

            if(Math.random()<0.10) this.createTree(t.x-8,t.z-8);

            if(Math.random()<0.05) this.createTrafficLight(t.x,t.z);

            if(Math.random()<0.07) this.createFireHydrant(t.x+6,t.z);

        }

    }

    createTree(x,z){

        const g=new THREE.Group();

        const trunk=new THREE.Mesh(

            new THREE.CylinderGeometry(.4,.5,3,8),

            new THREE.MeshStandardMaterial({

                color:0x6b4423

            })

        );

        trunk.position.y=1.5;

        g.add(trunk);

        const leaves=new THREE.Mesh(

            new THREE.SphereGeometry(2,12,12),

            new THREE.MeshStandardMaterial({

                color:[
                    0x2f8d46,
                    0x3fa34d,
                    0x26783a
                ][Math.floor(Math.random()*3)]

            })

        );

        leaves.position.y=4;

        g.add(leaves);

        g.position.set(x,0,z);

        this.scene.add(g);

    }

    createStreetLight(x,z){

        const g=new THREE.Group();

        const pole=new THREE.Mesh(

            new THREE.CylinderGeometry(.15,.18,7,8),

            new THREE.MeshStandardMaterial({

                color:0x666666

            })

        );

        pole.position.y=3.5;

        g.add(pole);

        const arm=new THREE.Mesh(

            new THREE.BoxGeometry(1.5,.15,.15),

            new THREE.MeshStandardMaterial({

                color:0x777777

            })

        );

        arm.position.set(.7,6.8,0);

        g.add(arm);

        const lamp=new THREE.Mesh(

            new THREE.BoxGeometry(.35,.25,.35),

            new THREE.MeshStandardMaterial({

                color:0xffffaa,

                emissive:0x555511

            })

        );

        lamp.position.set(1.35,6.6,0);

        g.add(lamp);

        const light=new THREE.PointLight(

            0xfff5aa,

            .6,

            18

        );

        light.position.set(1.35,6.2,0);

        g.add(light);

        g.position.set(x,0,z);

        this.scene.add(g);

    }

    createBench(x,z){

        const g=new THREE.Group();

        const seat=new THREE.Mesh(

            new THREE.BoxGeometry(2,.2,.7),

            new THREE.MeshStandardMaterial({

                color:0x8b5a2b

            })

        );

        seat.position.y=.8;

        g.add(seat);

        const back=new THREE.Mesh(

            new THREE.BoxGeometry(2,.8,.15),

            new THREE.MeshStandardMaterial({

                color:0x8b5a2b

            })

        );

        back.position.set(0,1.2,-.3);

        g.add(back);

        g.position.set(x,0,z);

        this.scene.add(g);

    }

    createTrashBin(x,z){

        const bin=new THREE.Mesh(

            new THREE.CylinderGeometry(.4,.5,1,10),

            new THREE.MeshStandardMaterial({

                color:0x228822

            })

        );

        bin.position.set(x,.5,z);

        this.scene.add(bin);

    }

    createCar(x,z){

        const g=new THREE.Group();

        const colors=[
            0xff3333,
            0x3377ff,
            0xffffff,
            0x222222,
            0x33aa55,
            0xffcc00
        ];

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(6,1.3,3),

            new THREE.MeshStandardMaterial({

                color:colors[Math.floor(Math.random()*colors.length)]

            })

        );

        body.position.y=1;

        g.add(body);

        const cabin=new THREE.Mesh(

            new THREE.BoxGeometry(3,1.1,2.5),

            new THREE.MeshStandardMaterial({

                color:0x88ccff,

                transparent:true,

                opacity:.5

            })

        );

        cabin.position.y=2;

        g.add(cabin);

        const wheelMat=new THREE.MeshStandardMaterial({

            color:0x111111

        });

        for(let i=-1;i<=1;i+=2){

            for(let j=-1;j<=1;j+=2){

                const w=new THREE.Mesh(

                    new THREE.CylinderGeometry(.45,.45,.5,12),

                    wheelMat

                );

                w.rotation.z=Math.PI/2;

                w.position.set(i*2,.45,j*1.4);

                g.add(w);

            }

        }

        g.position.set(x,0,z);

        g.rotation.y=Math.random()*Math.PI*2;

        this.scene.add(g);

    }

    createTrafficLight(x,z){

        const g=new THREE.Group();

        const pole=new THREE.Mesh(

            new THREE.CylinderGeometry(.12,.15,5,8),

            new THREE.MeshStandardMaterial({

                color:0x444444

            })

        );

        pole.position.y=2.5;

        g.add(pole);

        const box=new THREE.Mesh(

            new THREE.BoxGeometry(.45,1,.45),

            new THREE.MeshStandardMaterial({

                color:0x222222

            })

        );

        box.position.set(.45,4.3,0);

        g.add(box);

        ["red","yellow","green"].forEach((c,i)=>{

            const m=new THREE.Mesh(

                new THREE.SphereGeometry(.08,8,8),

                new THREE.MeshBasicMaterial({

                    color:c

                })

            );

            m.position.set(.68,4.55-i*.3,.23);

            g.add(m);

        });

        g.position.set(x,0,z);

        this.scene.add(g);

    }

    createFireHydrant(x,z){

        const g=new THREE.Mesh(

            new THREE.CylinderGeometry(.2,.25,.8,10),

            new THREE.MeshStandardMaterial({

                color:0xcc2222

            })

        );

        g.position.set(x,.4,z);

        this.scene.add(g);

    }

    update(dt){

    }

}
