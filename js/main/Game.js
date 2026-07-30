import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

import { Player } from "./player.js";
import { GameLoop } from "./GameLoop.js";
import { InputManager } from "./InputManager.js";
import { WaveManager } from "./WaveManager.js";

import { World } from "./world/World.js";
import { Human } from "./entities/Human.js";
import { Zombie } from "./entities/Zombie.js";
import { Vehicle } from "./entities/Vehicle.js";

import { HumanAI } from "./ai/HumanAI.js";
import { ZombieAI } from "./ai/ZombieAI.js";
import { Pathfinding } from "./ai/Pathfinding.js";

export class Game{

    constructor(scene,camera,renderer){

        this.scene=scene;
        this.camera=camera;
        this.renderer=renderer;

        this.clock=new THREE.Clock();

        this.world=null;

        this.player=null;

        this.humans=[];
        this.zombies=[];
        this.vehicles=[];

        this.humanAI=[];
        this.zombieAI=[];

        this.pathfinding=null;

        this.loop=null;
        this.input=null;
        this.waveManager=null;

    }

    start(){

        this.createLights();

        this.createWorld();

        this.createPlayer();

        this.createVehicles();

        this.createHumans();

        this.createZombies();

        this.pathfinding=new Pathfinding(this.world);

        this.pathfinding.build();

        this.input=new InputManager(this);

        this.waveManager=new WaveManager(this);

        this.loop=new GameLoop(this);

        this.loop.start();

    }

    createLights(){

        const ambient=new THREE.AmbientLight(
            0xffffff,
            0.7
        );

        this.scene.add(ambient);

        const sun=new THREE.DirectionalLight(
            0xffffff,
            2
        );

        sun.position.set(
            150,
            250,
            100
        );

        sun.castShadow=true;

        sun.shadow.mapSize.width=4096;
        sun.shadow.mapSize.height=4096;

        this.scene.add(sun);

    }

    createWorld(){

        this.world=new World(this.scene);

    }

    createPlayer(){

        this.player=new Player(this.camera);

    }

    createHumans(){

        const spawn=this.world.spawnManager;

        for(let i=0;i<50;i++){

            const p=spawn.getRandomHumanSpawn();

            const h=new Human(
                this.scene,
                p.x,
                p.z
            );

            this.humans.push(h);

            this.humanAI.push(
                new HumanAI(h)
            );

        }

    }

    createZombies(){

        const spawn=this.world.spawnManager;

        const types=[
            "walker",
            "runner",
            "brute"
        ];

        for(let i=0;i<18;i++){

            const p=spawn.getRandomZombieSpawn();

            const t=types[
                Math.floor(
                    Math.random()*types.length
                )
            ];

            const z=new Zombie(
                this.scene,
                p.x,
                p.z,
                t
            );

            this.zombies.push(z);

            this.zombieAI.push(
                new ZombieAI(z)
            );

        }

    }

    createVehicles(){

        for(let i=0;i<12;i++){

            const x=(Math.random()-.5)*350;

            const z=(Math.random()-.5)*350;

            const car=new Vehicle(
                this.scene,
                x,
                z,
                Math.random()<0.15
                ?"police"
                :"sedan"
            );

            this.vehicles.push(car);

        }

    }

}
