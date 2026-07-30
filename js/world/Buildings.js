import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Buildings{

    constructor(world){

        this.world=world;
        this.scene=world.scene;
        this.tileSize=world.tileSize;

        this.houseMat=new THREE.MeshStandardMaterial({color:0xe5d3b3});
        this.roofMat=new THREE.MeshStandardMaterial({color:0x8b2f2f});
        this.apartmentMat=new THREE.MeshStandardMaterial({color:0xbdbdbd});
        this.glassMat=new THREE.MeshStandardMaterial({color:0x88ccff,transparent:true,opacity:.5});
        this.shopMat=new THREE.MeshStandardMaterial({color:0xd7bf8d});
        this.factoryMat=new THREE.MeshStandardMaterial({color:0x777777});
        this.hospitalMat=new THREE.MeshStandardMaterial({color:0xf5f5f5});
        this.policeMat=new THREE.MeshStandardMaterial({color:0x5d77aa});

    }

    generate(){

        let hospital=false;
        let police=false;

        for(const t of this.world.tiles){

            if(t.type!="empty") continue;

            if(!hospital){

                this.createHospital(t.x,t.z);
                hospital=true;
                continue;

            }

            if(!police){

                this.createPoliceStation(t.x,t.z);
                police=true;
                continue;

            }

            const r=Math.random();

            if(r<.28) this.createHouse(t.x,t.z);
            else if(r<.56) this.createApartment(t.x,t.z);
            else if(r<.75) this.createShop(t.x,t.z);
            else if(r<.9) this.createFactory(t.x,t.z);
            else this.createPark(t.x,t.z);

        }

    }

    createHouse(x,z){

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(12,7,12),
            this.houseMat
        );

        body.position.y=3.5;
        body.castShadow=true;
        body.receiveShadow=true;

        g.add(body);

        const roof=new THREE.Mesh(
            new THREE.ConeGeometry(9,4,4),
            this.roofMat
        );

        roof.rotation.y=Math.PI/4;
        roof.position.y=9;

        g.add(roof);

        const door=new THREE.Mesh(
            new THREE.BoxGeometry(2,3,.2),
            new THREE.MeshStandardMaterial({color:0x5b3514})
        );

        door.position.set(0,1.5,6.1);

        g.add(door);

        for(let i=-3;i<=3;i+=6){

            const w=new THREE.Mesh(
                new THREE.BoxGeometry(1.5,1.5,.15),
                this.glassMat
            );

            w.position.set(i,4,6.08);

            g.add(w);

        }

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createApartment(x,z){

        const h=18+Math.random()*18;

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(15,h,15),
            this.apartmentMat
        );

        body.position.y=h/2;

        g.add(body);

        for(let y=3;y<h-2;y+=3){

            for(let i=-5;i<=5;i+=3){

                const w=new THREE.Mesh(
                    new THREE.BoxGeometry(1.2,1.2,.15),
                    this.glassMat
                );

                w.position.set(i,y,7.6);

                g.add(w);

                const b=w.clone();

                b.position.z=-7.6;

                g.add(b);

            }

        }

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createShop(x,z){

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(15,6,15),
            this.shopMat
        );

        body.position.y=3;

        g.add(body);

        const glass=new THREE.Mesh(
            new THREE.BoxGeometry(9,2.5,.15),
            this.glassMat
        );

        glass.position.set(0,3,7.6);

        g.add(glass);

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createFactory(x,z){

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(20,10,20),
            this.factoryMat
        );

        body.position.y=5;

        g.add(body);

        const chimney=new THREE.Mesh(
            new THREE.CylinderGeometry(1.2,1.5,10,12),
            this.factoryMat
        );

        chimney.position.set(6,15,6);

        g.add(chimney);

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createHospital(x,z){

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(22,10,22),
            this.hospitalMat
        );

        body.position.y=5;

        g.add(body);

        const h=new THREE.Mesh(
            new THREE.BoxGeometry(6,1,2),
            new THREE.MeshStandardMaterial({color:0xff0000})
        );

        h.position.set(0,9,11.2);

        g.add(h);

        const v=new THREE.Mesh(
            new THREE.BoxGeometry(2,4,1),
            new THREE.MeshStandardMaterial({color:0xffffff})
        );

        v.position.set(0,9,11.3);

        g.add(v);

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createPoliceStation(x,z){

        const g=new THREE.Group();

        const body=new THREE.Mesh(
            new THREE.BoxGeometry(20,8,20),
            this.policeMat
        );

        body.position.y=4;

        g.add(body);

        const sign=new THREE.Mesh(
            new THREE.BoxGeometry(7,1.2,.2),
            new THREE.MeshStandardMaterial({color:0xffffff})
        );

        sign.position.set(0,7.2,10.2);

        g.add(sign);

        g.position.set(x,0,z);

        this.scene.add(g);

        this.world.addBuilding(g);

    }

    createPark(x,z){

        for(let i=0;i<8;i++){

            const tx=x-6+Math.random()*12;
            const tz=z-6+Math.random()*12;

            const trunk=new THREE.Mesh(
                new THREE.CylinderGeometry(.4,.5,3,8),
                new THREE.MeshStandardMaterial({color:0x6b4423})
            );

            trunk.position.set(tx,1.5,tz);

            this.scene.add(trunk);

            const leaves=new THREE.Mesh(
                new THREE.SphereGeometry(2,10,10),
                new THREE.MeshStandardMaterial({color:0x2f8d46})
            );

            leaves.position.set(tx,4,tz);

            this.scene.add(leaves);

        }

    }

}
