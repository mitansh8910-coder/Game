import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class World {

    constructor(scene){

        this.scene = scene;

        // ===== WORLD SETTINGS =====

        this.tileSize = 20;
        this.gridSize = 25; // 25x25 tiles

        this.tiles = [];

        // Materials

        this.roadMaterial = new THREE.MeshStandardMaterial({
            color:0x2e2e2e
        });

        this.sidewalkMaterial = new THREE.MeshStandardMaterial({
            color:0xb5b5b5
        });

        this.grassMaterial = new THREE.MeshStandardMaterial({
            color:0x4f9445
        });

        this.createSky();
        this.createLights();
        this.createGround();
        this.generateGrid();

    }

    //------------------------------------
    // SKY
    //------------------------------------

    createSky(){

        this.scene.background =
            new THREE.Color(0x87CEEB);

        this.scene.fog =
            new THREE.Fog(
                0x87CEEB,
                180,
                520
            );

    }

    //------------------------------------
    // LIGHTS
    //------------------------------------

    createLights(){

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                0.65
            );

        this.scene.add(ambient);

        const sun =
            new THREE.DirectionalLight(
                0xffffff,
                1.2
            );

        sun.position.set(
            150,
            250,
            100
        );

        sun.castShadow = true;

        this.scene.add(sun);

    }

    //------------------------------------
    // GROUND
    //------------------------------------

    createGround(){

        const ground =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    this.gridSize*this.tileSize,
                    this.gridSize*this.tileSize
                ),

                this.grassMaterial

            );

        ground.rotation.x = -Math.PI/2;

        ground.receiveShadow = true;

        this.scene.add(ground);

    }

    //------------------------------------
    // TILE GRID
    //------------------------------------

    generateGrid(){

        const half = this.gridSize/2;

        for(let x=0;x<this.gridSize;x++){

            for(let z=0;z<this.gridSize;z++){

                const worldX =
                    (x-half)*this.tileSize+
                    this.tileSize/2;

                const worldZ =
                    (z-half)*this.tileSize+
                    this.tileSize/2;

                // Every 5th row/column becomes a road

                const road =
                    x%5===0 ||
                    z%5===0;

                if(road){

                    this.createRoadTile(
                        worldX,
                        worldZ
                    );

                    this.tiles.push({
                        x:worldX,
                        z:worldZ,
                        type:"road"
                    });

                }
                else{

                    this.tiles.push({
                        x:worldX,
                        z:worldZ,
                        type:"empty"
                    });

                }

            }

        }

    }

    //------------------------------------
    // ROAD TILE
    //------------------------------------

    createRoadTile(x,z){

        const road =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    this.tileSize,
                    0.08,
                    this.tileSize
                ),

                this.roadMaterial

            );

        road.position.set(
            x,
            0.04,
            z
        );

        this.scene.add(road);

        // lane markings

        const markMaterial =
            new THREE.MeshBasicMaterial({
                color:0xffff66
            });

        const mark =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.4,
                    0.09,
                    this.tileSize*0.45
                ),

                markMaterial

            );

        mark.position.set(
            x,
            0.09,
            z
        );

        this.scene.add(mark);

    }

}
// ============================================
// BUILDINGS
// ============================================

populateCity(){

    let hospitalPlaced = false;
    let policePlaced = false;

    for(const tile of this.tiles){

        if(tile.type !== "empty") continue;

        const r = Math.random();

        if(!hospitalPlaced){

            this.createHospital(tile.x,tile.z);

            hospitalPlaced = true;

            continue;

        }

        if(!policePlaced){

            this.createPoliceStation(tile.x,tile.z);

            policePlaced = true;

            continue;

        }

        if(r < 0.35){

            this.createHouse(tile.x,tile.z);

        }
        else if(r < 0.70){

            this.createApartment(tile.x,tile.z);

        }
        else if(r < 0.88){

            this.createShop(tile.x,tile.z);

        }
        else{

            this.createPark(tile.x,tile.z);

        }

    }

}

// ============================================
// HOUSE
// ============================================

createHouse(x,z){

    const group = new THREE.Group();

    const wall = new THREE.Mesh(

        new THREE.BoxGeometry(12,7,12),

        new THREE.MeshStandardMaterial({
            color:0xe8d7b9
        })

    );

    wall.position.y=3.5;

    group.add(wall);

    const roof = new THREE.Mesh(

        new THREE.ConeGeometry(9,4,4),

        new THREE.MeshStandardMaterial({
            color:0x8b2f2f
        })

    );

    roof.rotation.y=Math.PI/4;
    roof.position.y=9;

    group.add(roof);

    const door = new THREE.Mesh(

        new THREE.BoxGeometry(2,3,0.3),

        new THREE.MeshStandardMaterial({
            color:0x5c3b21
        })

    );

    door.position.set(0,1.5,6.16);

    group.add(door);

    group.position.set(x,0,z);

    this.scene.add(group);

}

// ============================================
// APARTMENT
// ============================================

createApartment(x,z){

    const height = 18 + Math.random()*12;

    const building = new THREE.Mesh(

        new THREE.BoxGeometry(14,height,14),

        new THREE.MeshStandardMaterial({

            color:0xbdbdbd

        })

    );

    building.position.set(
        x,
        height/2,
        z
    );

    this.scene.add(building);

    // windows

    for(let y=3;y<height-2;y+=3){

        for(let i=-4;i<=4;i+=4){

            const w = new THREE.Mesh(

                new THREE.BoxGeometry(
                    1,
                    1,
                    0.2
                ),

                new THREE.MeshStandardMaterial({
                    color:0x88ccff,
                    emissive:0x223344
                })

            );

            w.position.set(
                x+i,
                y,
                z+7.1
            );

            this.scene.add(w);

        }

    }

}

// ============================================
// SHOP
// ============================================

createShop(x,z){

    const body = new THREE.Mesh(

        new THREE.BoxGeometry(14,6,14),

        new THREE.MeshStandardMaterial({
            color:0xd7c79d
        })

    );

    body.position.set(x,3,z);

    this.scene.add(body);

    const glass = new THREE.Mesh(

        new THREE.BoxGeometry(
            8,
            2.5,
            0.15
        ),

        new THREE.MeshStandardMaterial({

            color:0x66ccff,

            transparent:true,

            opacity:0.55

        })

    );

    glass.position.set(
        x,
        3,
        z+7.08
    );

    this.scene.add(glass);

}

// ============================================
// PARK
// ============================================

createPark(x,z){

    for(let i=0;i<4;i++){

        const tx =
            x-5+Math.random()*10;

        const tz =
            z-5+Math.random()*10;

        const trunk = new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.4,
                0.5,
                3
            ),

            new THREE.MeshStandardMaterial({
                color:0x6b4423
            })

        );

        trunk.position.set(
            tx,
            1.5,
            tz
        );

        this.scene.add(trunk);

        const leaves = new THREE.Mesh(

            new THREE.SphereGeometry(
                1.8,
                10,
                10
            ),

            new THREE.MeshStandardMaterial({
                color:0x2e8b57
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

// ============================================
// HOSPITAL
// ============================================

createHospital(x,z){

    const building = new THREE.Mesh(

        new THREE.BoxGeometry(
            18,
            10,
            18
        ),

        new THREE.MeshStandardMaterial({
            color:0xf2f2f2
        })

    );

    building.position.set(
        x,
        5,
        z
    );

    this.scene.add(building);

    const cross = new THREE.Mesh(

        new THREE.BoxGeometry(
            5,
            1,
            1
        ),

        new THREE.MeshStandardMaterial({
            color:0xff0000
        })

    );

    cross.position.set(
        x,
        10,
        z+9.2
    );

    this.scene.add(cross);

    const cross2 = cross.clone();

    cross2.rotation.z=Math.PI/2;

    this.scene.add(cross2);

}

// ============================================
// POLICE STATION
// ============================================

createPoliceStation(x,z){

    const building = new THREE.Mesh(

        new THREE.BoxGeometry(
            18,
            8,
            18
        ),

        new THREE.MeshStandardMaterial({
            color:0x556b8d
        })

    );

    building.position.set(
        x,
        4,
        z
    );

    this.scene.add(building);

}
