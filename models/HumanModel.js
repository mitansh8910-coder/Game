import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class HumanModel{

    constructor(){

        this.mesh=new THREE.Group();

        this.build();

    }

    build(){

        const skin=[
            0xffd8b1,
            0xf1c27d,
            0xe0ac69,
            0xc68642,
            0x8d5524
        ];

        const shirts=[
            0x2e86de,
            0xe74c3c,
            0x27ae60,
            0x8e44ad,
            0xf39c12,
            0x16a085,
            0x34495e
        ];

        const pants=[
            0x2c3e50,
            0x555555,
            0x1b4f72,
            0x4d5656
        ];

        const s=skin[Math.floor(Math.random()*skin.length)];
        const c=shirts[Math.floor(Math.random()*shirts.length)];
        const p=pants[Math.floor(Math.random()*pants.length)];

        const skinMat=new THREE.MeshStandardMaterial({color:s});
        const shirtMat=new THREE.MeshStandardMaterial({color:c});
        const pantMat=new THREE.MeshStandardMaterial({color:p});
        const shoeMat=new THREE.MeshStandardMaterial({color:0x222222});
        const hairMat=new THREE.MeshStandardMaterial({
            color:[
                0x111111,
                0x3b2a20,
                0x8b5a2b,
                0xd4af37
            ][Math.floor(Math.random()*4)]
        });

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(1.2,1.8,.7),
            shirtMat
        );
        body.position.y=2.8;
        this.mesh.add(body);

        const neck=new THREE.Mesh(
            new THREE.BoxGeometry(.22,.18,.22),
            skinMat
        );
        neck.position.y=3.8;
        this.mesh.add(neck);

        const head=new THREE.Mesh(
            new THREE.BoxGeometry(.9,.9,.9),
            skinMat
        );
        head.position.y=4.45;
        this.mesh.add(head);

        const hair=new THREE.Mesh(
            new THREE.BoxGeometry(.95,.25,.95),
            hairMat
        );
        hair.position.y=4.98;
        this.mesh.add(hair);

        const eyeMat=new THREE.MeshBasicMaterial({color:0xffffff});
        const pupilMat=new THREE.MeshBasicMaterial({color:0x111111});

        [-0.18,0.18].forEach(x=>{

            const eye=new THREE.Mesh(
                new THREE.BoxGeometry(.12,.12,.05),
                eyeMat
            );

            eye.position.set(x,4.5,.46);

            this.mesh.add(eye);

            const pupil=new THREE.Mesh(
                new THREE.BoxGeometry(.05,.05,.03),
                pupilMat
            );

            pupil.position.set(x,4.5,.49);

            this.mesh.add(pupil);

        });

        [-0.45,0.45].forEach(x=>{

            const arm=new THREE.Mesh(
                new THREE.BoxGeometry(.3,1.6,.3),
                shirtMat
            );

            arm.position.set(x,2.8,0);

            this.mesh.add(arm);

            const hand=new THREE.Mesh(
                new THREE.BoxGeometry(.28,.28,.28),
                skinMat
            );

            hand.position.set(x,1.85,0);

            this.mesh.add(hand);

        });

        [-0.25,0.25].forEach(x=>{

            const leg=new THREE.Mesh(
                new THREE.BoxGeometry(.35,1.8,.35),
                pantMat
            );

            leg.position.set(x,1,0);

            this.mesh.add(leg);

            const shoe=new THREE.Mesh(
                new THREE.BoxGeometry(.4,.2,.7),
                shoeMat
            );

            shoe.position.set(x,.02,.1);

            this.mesh.add(shoe);

        });

        if(Math.random()<0.35){

            const cap=new THREE.Mesh(
                new THREE.CylinderGeometry(.46,.46,.18,16),
                new THREE.MeshStandardMaterial({
                    color:[
                        0x222222,
                        0xcc0000,
                        0x0044aa,
                        0x228822
                    ][Math.floor(Math.random()*4)]
                })
            );

            cap.position.y=5.02;

            this.mesh.add(cap);

        }

        if(Math.random()<0.4){

            const bag=new THREE.Mesh(
                new THREE.BoxGeometry(.55,.8,.25),
                new THREE.MeshStandardMaterial({
                    color:0x4b3621
                })
            );

            bag.position.set(0,2.7,-.45);

            this.mesh.add(bag);

        }

        this.mesh.traverse(o=>{

            if(o.isMesh){

                o.castShadow=true;
                o.receiveShadow=true;

            }

        });

    }

}
