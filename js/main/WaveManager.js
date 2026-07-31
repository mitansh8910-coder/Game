import { Zombie } from "./entities/Zombie.js";

export class WaveManager{

    constructor(game){

        this.game=game;

        this.wave=1;

        this.maxWave=20;

        this.timeBetweenWaves=20;

        this.timer=this.timeBetweenWaves;

        this.waiting=false;

    }

    update(dt){

        if(this.wave>this.maxWave)return;

        if(this.game.zombies.length===0&&!this.waiting){

            this.waiting=true;

            this.timer=this.timeBetweenWaves;

            console.log("Wave "+this.wave+" cleared!");

        }

        if(this.waiting){

            this.timer-=dt;

            if(this.timer<=0){

                this.wave++;

                this.spawnWave();

                this.waiting=false;

            }

        }

    }

    spawnWave(){

        const spawn=this.game.world.spawnManager;

        let amount=15+this.wave*5;

        if(this.wave===1)amount=18;

        const walkers=Math.floor(amount*.65);
        const runners=Math.floor(amount*.25);
        const brutes=amount-walkers-runners;

        for(let i=0;i<walkers;i++){

            this.spawnZombie(

                spawn.getRandomZombieSpawn(),

                "walker"

            );

        }

        for(let i=0;i<runners;i++){

            this.spawnZombie(

                spawn.getRandomZombieSpawn(),

                "runner"

            );

        }

        for(let i=0;i<brutes;i++){

            this.spawnZombie(

                spawn.getRandomZombieSpawn(),

                "brute"

            );

        }

        console.log("Wave "+this.wave+" started!");

    }

    spawnZombie(position,type){

        const zombie=new Zombie(

            this.game.scene,

            position.x,

            position.z,

            type

        );

        this.game.zombies.push(zombie);

        this.game.zombieAI.push(

            new this.game.zombieAI[0].constructor(

                zombie

            )

        );

    }

    reset(){

        this.wave=1;

        this.waiting=false;

        this.timer=this.timeBetweenWaves;

    }

    getWave(){

        return this.wave;

    }

}
