import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class CarModel{

    constructor(type="sedan"){

        this.type=type;
        this.mesh=new THREE.Group();

        this.build();

    }

    build(){

        const colors=[
            0xff3333,
            0x3377ff,
            0xffffff,
            0x222222,
            0xffcc00,
            0x2ecc71,
            0x8e44ad
        ];

        const bodyMat=new THREE.MeshStandardMaterial({
            color:colors[Math.floor(Math.random()*colors.length)]
        });

        const glassMat=new THREE.MeshStandardMaterial({
            color:0x88ccff,
            transparent:true,
            opacity:.5
        });

        const tireMat=new THREE.MeshStandardMaterial({
            color:0x111111
        });

        const rimMat=new THREE.MeshStandardMaterial({
            color:0xcccccc
        });

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(4.8,1,2.2),
            bodyMat
        );

        body.position.y=1;

        this.mesh.add(body);

        const cabin=new THREE.Mesh(
            new THREE.BoxGeometry(2.6,.9,1.9),
            glassMat
        );

        cabin.position.set(0,1.85,0);

        this.mesh.add(cabin);

        const hood=new THREE.Mesh(
            new THREE.BoxGeometry(1.3,.4,2),
            bodyMat
        );

        hood.position.set(1.75,1.3,0);

        this.mesh.add(hood);

        const trunk=new THREE.Mesh(
            new THREE.BoxGeometry(1,.35,2),
            bodyMat
        );

        trunk.position.set(-1.8,1.25,0);

        this.mesh.add(trunk);

        for(let x of[-1.6,1.6]){

            for(let z of[-1.05,1.05]){

                const tire=new THREE.Mesh(
                    new THREE.CylinderGeometry(.45,.45,.45,16),
                    tireMat
                );

                tire.rotation.z=Math.PI/2;
                tire.position.set(x,.45,z);

                this.mesh.add(tire);

                const rim=new THREE.Mesh(
                    new THREE.CylinderGeometry(.22,.22,.47,12),
                    rimMat
                );

                rim.rotation.z=Math.PI/2;
                rim.position.set(x,.45,z);

                this.mesh.add(rim);

            }

        }

        const lightMat=new THREE.MeshBasicMaterial({
            color:0xffffaa
        });

        const tailMat=new THREE.MeshBasicMaterial({
            color:0xff2222
        });

        [-.5,.5].forEach(z=>{

            const head=new THREE.Mesh(
                new THREE.BoxGeometry(.12,.18,.25),
                lightMat
            );

            head.position.set(2.45,1.1,z);

            this.mesh.add(head);

            const tail=new THREE.Mesh(
                new THREE.BoxGeometry(.12,.18,.25),
                tailMat
            );

            tail.position.set(-2.45,1.1,z);

            this.mesh.add(tail);

        });

        if(this.type==="police"){

            body.material=new THREE.MeshStandardMaterial({
                color:0xffffff
            });

            const stripe=new THREE.Mesh(
                new THREE.BoxGeometry(4.9,.2,.15),
                new THREE.MeshStandardMaterial({
                    color:0x0033cc
                })
            );

            stripe.position.set(0,1.2,1.08);

            this.mesh.add(stripe);

            const stripe2=stripe.clone();

            stripe2.position.z=-1.08;

            this.mesh.add(stripe2);

            const bar=new THREE.Mesh(
                new THREE.BoxGeometry(.9,.18,.35),
                new THREE.MeshStandardMaterial({
                    color:0x333333
                })
            );

            bar.position.set(0,2.4,0);

            this.mesh.add(bar);

            const red=new THREE.PointLight(0xff0000,.6,8);

            red.position.set(-.2,2.45,0);

            this.mesh.add(red);

            const blue=new THREE.PointLight(0x0000ff,.6,8);

            blue.position.set(.2,2.45,0);

            this.mesh.add(blue);

        }

        if(this.type==="van"){

            cabin.scale.y=1.5;
            cabin.position.y=2.1;

        }

        if(this.type==="suv"){

            body.scale.y=1.2;
            cabin.position.y=2;

        }

        this.mesh.traverse(o=>{

            if(o.isMesh){

                o.castShadow=true;
                o.receiveShadow=true;

            }

        });

    }

}
