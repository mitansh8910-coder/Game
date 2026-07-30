import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class ZombieModel{

    constructor(type="walker"){

        this.type=type;
        this.mesh=new THREE.Group();

        this.build();

    }

    build(){

        const skins=[
            0x6d8b5a,
            0x7d8f63,
            0x8a9972,
            0x6f7d58,
            0x5f7562
        ];

        const shirts=[
            0x444444,
            0x553333,
            0x2d4d2d,
            0x555555,
            0x3a3a55
        ];

        const pants=[
            0x2f2f2f,
            0x4b4b4b,
            0x3b322d
        ];

        const skinMat=new THREE.MeshStandardMaterial({
            color:skins[Math.floor(Math.random()*skins.length)]
        });

        const shirtMat=new THREE.MeshStandardMaterial({
            color:shirts[Math.floor(Math.random()*shirts.length)]
        });

        const pantMat=new THREE.MeshStandardMaterial({
            color:pants[Math.floor(Math.random()*pants.length)]
        });

        const bloodMat=new THREE.MeshStandardMaterial({
            color:0x7a0000
        });

        let h=1;
        let w=1;

        if(this.type==="runner"){

            h=.9;
            w=.9;

        }

        if(this.type==="brute"){

            h=1.4;
            w=1.5;

        }

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                1.3*w,
                1.8*h,
                .8*w
            ),

            shirtMat

        );

        body.position.y=2.8*h;

        body.rotation.z=.12;

        this.mesh.add(body);

        const head=new THREE.Mesh(

            new THREE.BoxGeometry(
                .95*w,
                .95*h,
                .95*w
            ),

            skinMat

        );

        head.position.y=4.4*h;

        head.rotation.z=.08;

        this.mesh.add(head);

        const jaw=new THREE.Mesh(

            new THREE.BoxGeometry(
                .8,
                .18,
                .35
            ),

            bloodMat

        );

        jaw.position.set(
            0,
            4.05*h,
            .42
        );

        this.mesh.add(jaw);

        const eyeMat=new THREE.MeshBasicMaterial({

            color:0xff2222

        });

        [-.2,.2].forEach(x=>{

            const eye=new THREE.Mesh(

                new THREE.SphereGeometry(.08,8,8),

                eyeMat

            );

            eye.position.set(
                x,
                4.45*h,
                .48
            );

            this.mesh.add(eye);

        });

        [-.55,.55].forEach(x=>{

            const arm=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .28,
                    2.2*h,
                    .28
                ),

                shirtMat

            );

            arm.position.set(
                x,
                2.6*h,
                .15
            );

            arm.rotation.x=.6;

            this.mesh.add(arm);

            const hand=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .3,
                    .35,
                    .3
                ),

                bloodMat

            );

            hand.position.set(
                x,
                1.25*h,
                .65
            );

            this.mesh.add(hand);

        });

        [-.22,.22].forEach(x=>{

            const leg=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .38*w,
                    1.9*h,
                    .38*w
                ),

                pantMat

            );

            leg.position.set(
                x,
                1*h,
                0
            );

            this.mesh.add(leg);

            const foot=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .42,
                    .18,
                    .8
                ),

                new THREE.MeshStandardMaterial({
                    color:0x111111
                })

            );

            foot.position.set(
                x,
                .05,
                .18
            );

            this.mesh.add(foot);

        });

        if(Math.random()<.6){

            const rib=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .5,
                    .5,
                    .15
                ),

                new THREE.MeshStandardMaterial({
                    color:0xdddddd
                })

            );

            rib.position.set(
                -.35,
                2.9*h,
                .45
            );

            this.mesh.add(rib);

        }

        if(Math.random()<.5){

            const blood=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .35,
                    .8,
                    .05
                ),

                bloodMat

            );

            blood.position.set(
                .45,
                2.9*h,
                .42
            );

            this.mesh.add(blood);

        }

        if(Math.random()<.35){

            const bone=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .12,
                    .7,
                    .12
                ),

                new THREE.MeshStandardMaterial({
                    color:0xf4f4f4
                })

            );

            bone.position.set(
                -.58,
                1.9*h,
                .25
            );

            this.mesh.add(bone);

        }

        this.mesh.traverse(o=>{

            if(o.isMesh){

                o.castShadow=true;
                o.receiveShadow=true;

            }

        });

    }

}
