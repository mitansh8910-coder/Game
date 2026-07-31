import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class GameLoop{

    constructor(game){

        this.game=game;

        this.scene=game.scene;
        this.camera=game.camera;
        this.renderer=game.renderer;

        this.clock=game.clock;

        this.running=false;

    }

    start(){

        this.running=true;

        this.animate();

    }

    stop(){

        this.running=false;

    }

    animate=()=>{

        if(!this.running)return;

        requestAnimationFrame(this.animate);

        const dt=this.clock.getDelta();

        this.update(dt);

        this.renderer.render(

            this.scene,

            this.camera

        );

    }

    update(dt){

        this.updatePlayer(dt);

        this.updateHumans(dt);

        this.updateZombies(dt);

        this.updateVehicles(dt);

        this.updateWeapons(dt);

        this.updateAI(dt);

        this.updateWave(dt);

        this.cleanup();

    }

    updatePlayer(dt){

        this.game.player.update(dt);

    }

    updateHumans(dt){

        for(const h of this.game.humans){

            h.update(dt);

        }

    }

    updateZombies(dt){

        for(const z of this.game.zombies){

            z.update(dt);

        }

    }

    updateVehicles(dt){

        const input=this.game.input.getVehicleInput();

        for(const v of this.game.vehicles){

            v.update(dt,input);

        }

    }

    updateWeapons(dt){

        for(const h of this.game.humans){

            if(h.weapon){

                h.weapon.update(

                    dt,

                    this.game.humans,

                    this.game.zombies

                );

            }

        }

        if(this.game.player.weapon){

            this.game.player.weapon.update(

                dt,

                this.game.humans,

                this.game.zombies

            );

        }

    }
      updateAI(dt){

        for(let i=0;i<this.game.humanAI.length;i++){

            this.game.humanAI[i].update(

                dt,

                this.game.humans,

                this.game.zombies

            );

        }

        for(let i=0;i<this.game.zombieAI.length;i++){

            this.game.zombieAI[i].update(

                dt,

                this.game.humans,

                this.game.zombies

            );

        }

    }

    updateWave(dt){

        if(this.game.waveManager){

            this.game.waveManager.update(dt);

        }

    }

    cleanup(){

        for(let i=this.game.humans.length-1;i>=0;i--){

            const h=this.game.humans[i];

            if(!h.alive){

                if(h.infected){

                    const z=this.createZombieFromHuman(h);

                    this.game.zombies.push(z);

                }

                this.scene.remove(h.mesh);

                this.game.humans.splice(i,1);

                this.game.humanAI.splice(i,1);

            }

        }

        for(let i=this.game.zombies.length-1;i>=0;i--){

            const z=this.game.zombies[i];

            if(!z.alive){

                this.scene.remove(z.mesh);

                this.game.zombies.splice(i,1);

                this.game.zombieAI.splice(i,1);

            }

        }

        if(this.game.player.health<=0){

            this.stop();

            console.log("GAME OVER");

        }

        if(

            this.game.zombies.length===0 &&

            this.game.waveManager.wave>

            this.game.waveManager.maxWave

        ){

            this.stop();

            console.log("YOU WIN");

        }

    }

    createZombieFromHuman(human){

        const ZombieClass=this.game.zombies.length>0

            ?this.game.zombies[0].constructor

            :null;

        if(!ZombieClass)return null;

        const zombie=new ZombieClass(

            this.scene,

            human.mesh.position.x,

            human.mesh.position.z,

            "walker"

        );

        this.game.zombieAI.push(

            new this.game.zombieAI[0].constructor(

                zombie

            )

        );

        return zombie;

    }

}
