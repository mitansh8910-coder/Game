//==========================
// WORLD.JS PART 1 START
//==========================

import ...

export class World {

    constructor(...) {

        ...

    }

    createSky(){

        ...

    }

    ...

//==========================
// END OF PART 1
// DON'T CLOSE THE CLASS
//==========================
//==========================
// WORLD.JS PART 2
// PASTE DIRECTLY BELOW PART 1
//==========================

    createHouse(){

        ...

    }

    createApartment(){

        ...

    }

    ...

//==========================
// END OF PART 2
// DON'T CLOSE THE CLASS
//==========================
//==========================
// WORLD.JS PART 3
//==========================

    createCar(){

        ...

    }

    createStreetLight(){

        ...

    }

    ...

//==========================
// END OF PART 3
// DON'T CLOSE THE CLASS
//==========================
//==========================
// WORLD.JS PART 4
//==========================

    generateDistricts(){

        ...

    }

    ...

}

//==========================
// END OF WORLD.JS
//==========================
//==================================================
// WORLD.JS PART 2
// Buildings + District Generation
// PASTE BELOW PART 1
//==================================================

    populateCity() {

        this.districts = [];

        let hospitalPlaced = false;
        let policePlaced = false;

        for (const tile of this.tiles) {

            if (tile.type !== "empty") continue;

            const r = Math.random();

            if (!hospitalPlaced) {
                this.createHospital(tile.x, tile.z);
                hospitalPlaced = true;
                continue;
            }

            if (!policePlaced) {
                this.createPoliceStation(tile.x, tile.z);
                policePlaced = true;
                continue;
            }

            if (r < 0.25) {

                this.createHouse(tile.x, tile.z);

            } else if (r < 0.55) {

                this.createApartment(tile.x, tile.z);

            } else if (r < 0.75) {

                this.createOffice(tile.x, tile.z);

            } else if (r < 0.90) {

                this.createShop(tile.x, tile.z);

            } else {

                this.createPark(tile.x, tile.z);

            }

        }

    }

    //========================================
    // HOUSE
    //========================================

    createHouse(x, z) {

        const group = new THREE.Group();

        const wall = new THREE.Mesh(

            new THREE.BoxGeometry(12, 7, 12),

            new THREE.MeshStandardMaterial({
                color: 0xe6d0ae
            })

        );

        wall.position.y = 3.5;

        group.add(wall);

        const roof = new THREE.Mesh(

            new THREE.ConeGeometry(9,4,4),

            new THREE.MeshStandardMaterial({

                color:0x9d2b2b

            })

        );

        roof.rotation.y=Math.PI/4;

        roof.position.y=9;

        group.add(roof);

        const door=new THREE.Mesh(

            new THREE.BoxGeometry(
                2,
                3,
                0.25
            ),

            new THREE.MeshStandardMaterial({
                color:0x5b3514
            })

        );

        door.position.set(
            0,
            1.5,
            6.1
        );

        group.add(door);

        group.position.set(x,0,z);

        this.scene.add(group);

    }

    //========================================
    // APARTMENT
    //========================================

    createApartment(x,z){

        const height=18+Math.random()*16;

        const building=new THREE.Mesh(

            new THREE.BoxGeometry(
                14,
                height,
                14
            ),

            new THREE.MeshStandardMaterial({

                color:0xb8b8b8

            })

        );

        building.position.set(
            x,
            height/2,
            z
        );

        this.scene.add(building);

        for(let y=3;y<height-2;y+=3){

            for(let side=-1;side<=1;side+=2){

                for(let i=-4;i<=4;i+=4){

                    const windowMesh=new THREE.Mesh(

                        new THREE.BoxGeometry(
                            1,
                            1,
                            0.15
                        ),

                        new THREE.MeshStandardMaterial({

                            color:0x87cefa,

                            emissive:0x223355

                        })

                    );

                    windowMesh.position.set(

                        x+i,

                        y,

                        z+(7.05*side)

                    );

                    this.scene.add(windowMesh);

                }

            }

        }

    }

    //========================================
    // OFFICE
    //========================================

    createOffice(x,z){

        const height=26+Math.random()*14;

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                16,
                height,
                16
            ),

            new THREE.MeshStandardMaterial({

                color:0x666666

            })

        );

        body.position.set(
            x,
            height/2,
            z
        );

        this.scene.add(body);

    }

    //========================================
    // SHOP
    //========================================

    createShop(x,z){

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                14,
                6,
                14
            ),

            new THREE.MeshStandardMaterial({

                color:0xd7bf8c

            })

        );

        body.position.set(
            x,
            3,
            z
        );

        this.scene.add(body);

        const glass=new THREE.Mesh(

            new THREE.BoxGeometry(
                8,
                2.5,
                0.15
            ),

            new THREE.MeshStandardMaterial({

                color:0x55ccff,

                transparent:true,

                opacity:0.45

            })

        );

        glass.position.set(
            x,
            3,
            z+7.1
        );

        this.scene.add(glass);

    }

    //========================================
    // PARK
    //========================================

    createPark(x,z){

        for(let i=0;i<6;i++){

            const tx=x-6+Math.random()*12;

            const tz=z-6+Math.random()*12;

            const trunk=new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.4,
                    0.5,
                    3
                ),

                new THREE.MeshStandardMaterial({

                    color:0x6f4524

                })

            );

            trunk.position.set(
                tx,
                1.5,
                tz
            );

            this.scene.add(trunk);

            const leaves=new THREE.Mesh(

                new THREE.SphereGeometry(
                    2,
                    12,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:0x2f8d46

                })

            );

            leaves.position.set(
                tx,
                4,
                tz
            );

            this.scene.add(leaves);

        }

    }

    //========================================
    // HOSPITAL
    //========================================

    createHospital(x,z){

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                20,
                10,
                20
            ),

            new THREE.MeshStandardMaterial({

                color:0xf2f2f2

            })

        );

        body.position.set(
            x,
            5,
            z
        );

        this.scene.add(body);

    }

    //========================================
    // POLICE STATION
    //========================================

    createPoliceStation(x,z){

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                20,
                8,
                20
            ),

            new THREE.MeshStandardMaterial({

                color:0x58729d

            })

        );

        body.position.set(
            x,
            4,
            z
        );

        this.scene.add(body);

    }

//==================================================
// END OF PART 2
// DO NOT CLOSE THE CLASS
//==================================================
//==================================================
// WORLD.JS PART 3
// Decorations, Vehicles & Street Furniture
//==================================================

    createDecorations(){

        for(const tile of this.tiles){

            if(tile.type !== "road") continue;

            if(Math.random()<0.45){

                this.createStreetLight(
                    tile.x+8,
                    tile.z+8
                );

            }

            if(Math.random()<0.20){

                this.createTrashBin(
                    tile.x-7,
                    tile.z+6
                );

            }

            if(Math.random()<0.12){

                this.createBench(
                    tile.x+6,
                    tile.z-7
                );

            }

            if(Math.random()<0.08){

                this.createCar(
                    tile.x,
                    tile.z
                );

            }

        }

    }

    //========================================
    // LOW POLY CAR
    //========================================

    createCar(x,z){

        const group=new THREE.Group();

        const body=new THREE.Mesh(

            new THREE.BoxGeometry(
                6,
                1.3,
                3
            ),

            new THREE.MeshStandardMaterial({

                color:[
                    0xff3333,
                    0x3377ff,
                    0xffffff,
                    0x222222,
                    0x33aa55
                ][Math.floor(Math.random()*5)]

            })

        );

        body.position.y=1;

        group.add(body);

        const cabin=new THREE.Mesh(

            new THREE.BoxGeometry(
                3,
                1.1,
                2.6
            ),

            new THREE.MeshStandardMaterial({

                color:0x88ccff,

                transparent:true,

                opacity:.65

            })

        );

        cabin.position.y=2;

        group.add(cabin);

        const wheelMaterial=
            new THREE.MeshStandardMaterial({
                color:0x111111
            });

        for(let i=-1;i<=1;i+=2){

            for(let j=-1;j<=1;j+=2){

                const wheel=new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        .45,
                        .45,
                        .5,
                        14
                    ),

                    wheelMaterial

                );

                wheel.rotation.z=Math.PI/2;

                wheel.position.set(
                    i*2,
                    .45,
                    j*1.4
                );

                group.add(wheel);

            }

        }

        group.position.set(x,0,z);

        group.rotation.y=Math.random()*Math.PI*2;

        this.scene.add(group);

    }

    //========================================
    // STREET LIGHT
    //========================================

    createStreetLight(x,z){

        const pole=new THREE.Mesh(

            new THREE.CylinderGeometry(
                .15,
                .2,
                7
            ),

            new THREE.MeshStandardMaterial({

                color:0x666666

            })

        );

        pole.position.set(
            x,
            3.5,
            z
        );

        this.scene.add(pole);

        const arm=new THREE.Mesh(

            new THREE.BoxGeometry(
                1.8,
                .15,
                .15
            ),

            new THREE.MeshStandardMaterial({

                color:0x777777

            })

        );

        arm.position.set(
            x+.75,
            6.8,
            z
        );

        this.scene.add(arm);

        const lamp=new THREE.Mesh(

            new THREE.BoxGeometry(
                .35,
                .25,
                .35
            ),

            new THREE.MeshStandardMaterial({

                color:0xffffaa,

                emissive:0x555511

            })

        );

        lamp.position.set(
            x+1.45,
            6.6,
            z
        );

        this.scene.add(lamp);

    }

    //========================================
    // BENCH
    //========================================

    createBench(x,z){

        const seat=new THREE.Mesh(

            new THREE.BoxGeometry(
                2,
                .2,
                .7
            ),

            new THREE.MeshStandardMaterial({

                color:0x8b5a2b

            })

        );

        seat.position.set(
            x,
            .8,
            z
        );

        this.scene.add(seat);

        for(let i=-1;i<=1;i+=2){

            const leg=new THREE.Mesh(

                new THREE.BoxGeometry(
                    .15,
                    .8,
                    .15
                ),

                new THREE.MeshStandardMaterial({

                    color:0x444444

                })

            );

            leg.position.set(
                x+i*.8,
                .4,
                z
            );

            this.scene.add(leg);

        }

    }

    //========================================
    // TRASH BIN
    //========================================

    createTrashBin(x,z){

        const bin=new THREE.Mesh(

            new THREE.CylinderGeometry(
                .45,
                .55,
                1,
                10
            ),

            new THREE.MeshStandardMaterial({

                color:0x228822

            })

        );

        bin.position.set(
            x,
            .5,
            z
        );

        this.scene.add(bin);

    }

    //========================================
    // FLOWERS
    //========================================

    createFlowers(x,z){

        for(let i=0;i<15;i++){

            const flower=new THREE.Mesh(

                new THREE.SphereGeometry(
                    .08,
                    6,
                    6
                ),

                new THREE.MeshBasicMaterial({

                    color:[
                        0xff44aa,
                        0xffff55,
                        0xffffff,
                        0xaa55ff
                    ][Math.floor(Math.random()*4)]

                })

            );

            flower.position.set(

                x-3+Math.random()*6,

                .08,

                z-3+Math.random()*6

            );

            this.scene.add(flower);

        }

    }

//==================================================
// END OF PART 3
// DO NOT CLOSE THE CLASS
//==================================================
//==================================================
// WORLD.JS PART 4
// Districts, Spawn Points & Collision Data
//==================================================

    generateDistricts(){

        this.districtMap=[];

        const size=this.gridSize*this.tileSize;

        this.districtMap.push({
            name:"Residential",
            minX:-size/2,
            maxX:0,
            minZ:-size/2,
            maxZ:0
        });

        this.districtMap.push({
            name:"Commercial",
            minX:0,
            maxX:size/2,
            minZ:-size/2,
            maxZ:0
        });

        this.districtMap.push({
            name:"Industrial",
            minX:-size/2,
            maxX:0,
            minZ:0,
            maxZ:size/2
        });

        this.districtMap.push({
            name:"Downtown",
            minX:0,
            maxX:size/2,
            minZ:0,
            maxZ:size/2
        });

    }

    //---------------------------------------
    // Spawn Points
    //---------------------------------------

    createSpawnPoints(){

        this.humanSpawns=[];
        this.zombieSpawns=[];

        for(const tile of this.tiles){

            if(tile.type==="road"){

                if(Math.random()<0.08){

                    this.humanSpawns.push({
                        x:tile.x,
                        z:tile.z
                    });

                }

                if(Math.random()<0.08){

                    this.zombieSpawns.push({
                        x:tile.x,
                        z:tile.z
                    });

                }

            }

        }

    }

    //---------------------------------------
    // Collision Boxes
    //---------------------------------------

    buildCollisionMap(){

        this.colliders=[];

        this.scene.traverse(obj=>{

            if(obj.isMesh){

                obj.geometry.computeBoundingBox();

                const box=new THREE.Box3().setFromObject(obj);

                this.colliders.push(box);

            }

        });

    }

    //---------------------------------------
    // Query Helpers
    //---------------------------------------

    getRandomHumanSpawn(){

        if(this.humanSpawns.length===0){

            return {x:0,z:0};

        }

        return this.humanSpawns[
            Math.floor(
                Math.random()*this.humanSpawns.length
            )
        ];

    }

    getRandomZombieSpawn(){

        if(this.zombieSpawns.length===0){

            return {x:40,z:40};

        }

        return this.zombieSpawns[
            Math.floor(
                Math.random()*this.zombieSpawns.length
            )
        ];

    }

    //---------------------------------------
    // Future Update Loop
    //---------------------------------------

    update(delta){

        // Reserved for:
        // Day/Night Cycle
        // Weather
        // Animated lights
        // Traffic
        // Ambient effects

    }

}
//==================================================
// END OF WORLD.JS
//==================================================
