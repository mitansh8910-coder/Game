import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class TreeModel{

    constructor(type="random"){

        this.type=type;
        this.mesh=new THREE.Group();

        this.build();

    }

    build(){

        if(this.type==="random"){

            const t=[
                "oak",
                "pine",
                "dead",
                "bush"
            ];

            this.type=t[
                Math.floor(Math.random()*t.length)
            ];

        }

        switch(this.type){

            case "oak":
                this.createOak();
                break;

            case "pine":
                this.createPine();
                break;

            case "dead":
                this.createDead();
                break;

            case "bush":
                this.createBush();
                break;

        }

        const s=.8+Math.random()*.8;

        this.mesh.scale.set(s,s,s);

        this.mesh.rotation.y=Math.random()*Math.PI*2;

        this.mesh.traverse(o=>{

            if(o.isMesh){

                o.castShadow=true;
                o.receiveShadow=true;

            }

        });

    }

    createOak(){

        const trunk=new THREE.Mesh(

            new THREE.CylinderGeometry(.45,.6,4,10),

            new THREE.MeshStandardMaterial({

                color:0x6b4423

            })

        );

        trunk.position.y=2;

        this.mesh.add(trunk);

        const colors=[
            0x2e8b57,
            0x3fa34d,
            0x26783a
        ];

        for(let i=0;i<6;i++){

            const leaf=new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.6,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:colors[
                        Math.floor(Math.random()*colors.length)
                    ]

                })

            );

            leaf.position.set(

                (Math.random()-.5)*2,

                4.5+Math.random(),

                (Math.random()-.5)*2

            );

            this.mesh.add(leaf);

        }

    }

    createPine(){

        const trunk=new THREE.Mesh(

            new THREE.CylinderGeometry(.3,.4,5,8),

            new THREE.MeshStandardMaterial({

                color:0x5d3a1a

            })

        );

        trunk.position.y=2.5;

        this.mesh.add(trunk);

        for(let i=0;i<4;i++){

            const cone=new THREE.Mesh(

                new THREE.ConeGeometry(
                    2.2-i*.35,
                    2.2,
                    8
                ),

                new THREE.MeshStandardMaterial({

                    color:0x2d7f2d

                })

            );

            cone.position.y=3.5+i*.8;

            this.mesh.add(cone);

        }

    }

    createDead(){

        const mat=new THREE.MeshStandardMaterial({

            color:0x5b4636

        });

        const trunk=new THREE.Mesh(

            new THREE.CylinderGeometry(.25,.4,5,8),

            mat

        );

        trunk.position.y=2.5;

        this.mesh.add(trunk);

        for(let i=0;i<5;i++){

            const branch=new THREE.Mesh(

                new THREE.CylinderGeometry(.06,.1,2,6),

                mat

            );

            branch.position.y=3+i*.35;

            branch.rotation.z=(Math.random()-.5)*1.8;

            branch.rotation.x=(Math.random()-.5)*1.2;

            this.mesh.add(branch);

        }

    }

    createBush(){

        const mat=new THREE.MeshStandardMaterial({

            color:0x2f8d46

        });

        for(let i=0;i<5;i++){

            const s=new THREE.Mesh(

                new THREE.SphereGeometry(
                    .8+Math.random()*.5,
                    10,
                    10
                ),

                mat

            );

            s.position.set(

                (Math.random()-.5)*1.4,

                .5+Math.random()*.5,

                (Math.random()-.5)*1.4

            );

            this.mesh.add(s);

        }

    }

}
