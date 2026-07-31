import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class InputManager{

    constructor(game){

        this.game=game;

        this.keys={};

        this.mouseDown=false;

        this.setup();

    }

    setup(){

        window.addEventListener("keydown",e=>{

            this.keys[e.key.toLowerCase()]=true;

            switch(e.key.toLowerCase()){

                case "r":

                    if(this.game.player.weapon)

                        this.game.player.weapon.reload();

                    break;

                case "1":

                    if(this.game.player.weapon)

                        this.game.player.weapon.changeWeapon("pistol");

                    break;

                case "2":

                    if(this.game.player.weapon)

                        this.game.player.weapon.changeWeapon("rifle");

                    break;

                case "3":

                    if(this.game.player.weapon)

                        this.game.player.weapon.changeWeapon("shotgun");

                    break;

                case "e":

                    this.toggleVehicle();

                    break;

            }

        });

        window.addEventListener("keyup",e=>{

            this.keys[e.key.toLowerCase()]=false;

        });

        window.addEventListener("mousedown",e=>{

            if(e.button===0)

                this.mouseDown=true;

        });

        window.addEventListener("mouseup",e=>{

            if(e.button===0)

                this.mouseDown=false;

        });

    }

    update(){

        if(this.mouseDown){

            this.game.player.shoot();

        }

    }

    getVehicleInput(){

        return{

            forward:this.keys["w"],

            backward:this.keys["s"],

            left:this.keys["a"],

            right:this.keys["d"]

        };

    }

    toggleVehicle(){

        const player=this.game.player;

        if(player.inVehicle){

            player.exitVehicle();

            return;

        }

        let nearest=null;

        let dist=Infinity;

        for(const v of this.game.vehicles){

            const d=v.mesh.position.distanceTo(

                player.position

            );

            if(d<4&&d<dist){

                dist=d;

                nearest=v;

            }

        }

        if(nearest){

            player.enterVehicle(nearest);

        }

    }

    getMouseDirection(){

        const dir=new THREE.Vector3();

        this.game.camera.getWorldDirection(dir);

        return dir.normalize();

    }

}
