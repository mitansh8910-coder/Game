import { Terrain } from "./Terrain.js";
import { Roads } from "./Roads.js";
import { Buildings } from "./Buildings.js";
import { Decorations } from "./Decorations.js";
import { Districts } from "./Districts.js";
import { SpawnManager } from "./SpawnManager.js";
import { Collision } from "./Collision.js";

export class World{

    constructor(scene){

        this.scene=scene;

        this.tileSize=20;
        this.gridSize=100;

        this.tiles=[];
        this.buildings=[];
        this.roads=[];
        this.colliders=[];

        this.terrain=new Terrain(this);
        this.roadsSystem=new Roads(this);
        this.districts=new Districts(this);
        this.buildingSystem=new Buildings(this);
        this.decorations=new Decorations(this);
        this.spawnManager=new SpawnManager(this);
        this.collision=new Collision(this);

    }

    generate(){

        this.terrain.create();

        this.roadsSystem.generate();

        this.districts.generate();

        this.buildingSystem.generate();

        this.decorations.generate();

        this.spawnManager.generate();

        this.collision.build();

    }

    addTile(tile){

        this.tiles.push(tile);

    }

    addRoad(mesh){

        this.roads.push(mesh);

        this.scene.add(mesh);

    }

    addBuilding(mesh){

        this.buildings.push(mesh);

        this.scene.add(mesh);

    }

    addCollider(box){

        this.colliders.push(box);

    }

    getTile(x,z){

        for(const t of this.tiles){

            if(t.x===x&&t.z===z){

                return t;

            }

        }

        return null;

    }

    worldToGrid(x,z){

        return{

            x:Math.floor(x/this.tileSize),

            z:Math.floor(z/this.tileSize)

        };

    }

    gridToWorld(x,z){

        return{

            x:x*this.tileSize,

            z:z*this.tileSize

        };

    }

    getRandomRoad(){

        return this.roads[
            Math.floor(
                Math.random()*this.roads.length
            )
        ];

    }

    getRandomBuilding(){

        return this.buildings[
            Math.floor(
                Math.random()*this.buildings.length
            )
        ];

    }

    update(dt){

        this.spawnManager.update(dt);

        this.decorations.update(dt);

    }

}
