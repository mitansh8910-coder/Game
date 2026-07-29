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
