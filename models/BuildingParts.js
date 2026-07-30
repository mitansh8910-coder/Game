import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class BuildingParts{

    static wall(w,h,d,c=0xd9d9d9){

        const m=new THREE.Mesh(

            new THREE.BoxGeometry(w,h,d),

            new THREE.MeshStandardMaterial({

                color:c

            })

        );

        m.castShadow=true;
        m.receiveShadow=true;

        return m;

    }

    static roof(w,d,h=3,c=0x8b2f2f){

        const r=new THREE.Mesh(

            new THREE.ConeGeometry(

                Math.max(w,d)*.75,

                h,

                4

            ),

            new THREE.MeshStandardMaterial({

                color:c

            })

        );

        r.rotation.y=Math.PI/4;

        r.castShadow=true;

        return r;

    }

    static door(c=0x5b3514){

        const d=new THREE.Mesh(

            new THREE.BoxGeometry(
                1.6,
                3,
                .15
            ),

            new THREE.MeshStandardMaterial({

                color:c

            })

        );

        d.position.y=1.5;

        return d;

    }

    static window(w=1.2,h=1.2){

        return new THREE.Mesh(

            new THREE.BoxGeometry(
                w,
                h,
                .08
            ),

            new THREE.MeshStandardMaterial({

                color:0x88ccff,

                transparent:true,

                opacity:.45,

                metalness:.4,

                roughness:.15

            })

        );

    }

    static balcony(w=3,d=1){

        const g=new THREE.Group();

        const floor=new THREE.Mesh(

            new THREE.BoxGeometry(
                w,
                .18,
                d
            ),

            new THREE.MeshStandardMaterial({

                color:0xb0b0b0

            })

        );

        g.add(floor);

        const railMat=new THREE.MeshStandardMaterial({

            color:0x444444

        });

        const top=new THREE.Mesh(

            new THREE.BoxGeometry(
                w,
                .08,
                .08
            ),

            railMat

        );

        top.position.set(
            0,
            .9,
            d/2-.05
        );

        g.add(top);

        for(let x=-w/2+.2;x<=w/2-.2;x+=.4){

            const bar=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .05,
                    .8,
                    .05
                ),

                railMat

            );

            bar.position.set(
                x,
                .4,
                d/2-.05
            );

            g.add(bar);

        }

        return g;

    }

    static chimney(){

        const c=new THREE.Mesh(

            new THREE.BoxGeometry(
                .8,
                2.2,
                .8
            ),

            new THREE.MeshStandardMaterial({

                color:0x7d7d7d

            })

        );

        c.castShadow=true;

        return c;

    }

    static column(h=4){

        return new THREE.Mesh(

            new THREE.CylinderGeometry(
                .22,
                .22,
                h,
                12
            ),

            new THREE.MeshStandardMaterial({

                color:0xe0e0e0

            })

        );

    }

    static stairs(steps=6){

        const g=new THREE.Group();

        const mat=new THREE.MeshStandardMaterial({

            color:0x9a9a9a

        });

        for(let i=0;i<steps;i++){

            const s=new THREE.Mesh(

                new THREE.BoxGeometry(
                    2,
                    .2,
                    .5
                ),

                mat

            );

            s.position.set(
                0,
                .1+i*.2,
                -i*.25
            );

            g.add(s);

        }

        return g;

    }

    static lampPost(){

        const g=new THREE.Group();

        const pole=new THREE.Mesh(

            new THREE.CylinderGeometry(
                .1,
                .12,
                5,
                8
            ),

            new THREE.MeshStandardMaterial({

                color:0x555555

            })

        );

        pole.position.y=2.5;

        g.add(pole);

        const arm=new THREE.Mesh(

            new THREE.BoxGeometry(
                .8,
                .08,
                .08
            ),

            new THREE.MeshStandardMaterial({

                color:0x666666

            })

        );

        arm.position.set(
            .35,
            4.8,
            0
        );

        g.add(arm);

        const lamp=new THREE.Mesh(

            new THREE.BoxGeometry(
                .25,
                .25,
                .25
            ),

            new THREE.MeshStandardMaterial({

                color:0xffffcc,

                emissive:0x444411

            })

        );

        lamp.position.set(
            .72,
            4.65,
            0
        );

        g.add(lamp);

        return g;

    }

}
