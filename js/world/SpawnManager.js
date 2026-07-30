export class SpawnManager{

    constructor(world){

        this.world=world;

        this.humanSpawns=[];
        this.zombieSpawns=[];

        this.wave=1;
        this.waveTimer=0;
        this.waveDelay=30;

        this.baseZombies=18;
        this.waveIncrease=8;

    }

    generate(){

        for(const t of this.world.tiles){

            if(t.type!=="road") continue;

            if(Math.random()<0.08){

                this.humanSpawns.push({
                    x:t.x,
                    z:t.z
                });

            }

            if(Math.random()<0.08){

                this.zombieSpawns.push({
                    x:t.x,
                    z:t.z
                });

            }

        }

    }

    getRandomHumanSpawn(){

        if(this.humanSpawns.length===0){

            return{
                x:0,
                z:0
            };

        }

        return this.humanSpawns[
            Math.floor(
                Math.random()*
                this.humanSpawns.length
            )
        ];

    }

    getRandomZombieSpawn(){

        if(this.zombieSpawns.length===0){

            return{
                x:100,
                z:100
            };

        }

        return this.zombieSpawns[
            Math.floor(
                Math.random()*
                this.zombieSpawns.length
            )
        ];

    }

    getZombieCount(){

        return this.baseZombies+

        (this.wave-1)*

        this.waveIncrease;

    }

    nextWave(){

        this.wave++;

        this.waveTimer=0;

        return this.getZombieCount();

    }

    reset(){

        this.wave=1;

        this.waveTimer=0;

    }

    update(dt){

        this.waveTimer+=dt;

        if(this.waveTimer>=this.waveDelay){

            this.nextWave();

        }

    }

    getWave(){

        return this.wave;

    }

    getSafeHumanSpawn(player){

        let best=this.getRandomHumanSpawn();

        let bestDistance=-1;

        for(const s of this.humanSpawns){

            const dx=s.x-player.position.x;

            const dz=s.z-player.position.z;

            const d=Math.sqrt(dx*dx+dz*dz);

            if(d>bestDistance){

                best=s;

                bestDistance=d;

            }

        }

        return best;

    }

    getNearestZombieSpawn(x,z){

        let nearest=null;

        let dist=Infinity;

        for(const s of this.zombieSpawns){

            const dx=s.x-x;

            const dz=s.z-z;

            const d=dx*dx+dz*dz;

            if(d<dist){

                dist=d;

                nearest=s;

            }

        }

        return nearest;

    }

}
