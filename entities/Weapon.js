import { Bullet } from "./Bullet.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

export class Weapon{

    constructor(scene,owner,type="pistol"){

        this.scene=scene;
        this.owner=owner;
        this.type=type;

        this.bullets=[];

        this.setup(type);

        this.cooldown=0;
        this.reloadTimer=0;
        this.reloading=false;

    }

    setup(type){

        switch(type){

            case "rifle":

                this.damage=20;
                this.fireRate=0.1;
                this.magazineSize=30;
                this.reloadTime=2.2;
                this.speed=120;
                this.spread=.01;

                break;

            case "shotgun":

                this.damage=14;
                this.fireRate=.8;
                this.magazineSize=8;
                this.reloadTime=3;
                this.speed=90;
                this.spread=.12;
                this.pellets=8;

                break;

            default:

                this.damage=28;
                this.fireRate=.35;
                this.magazineSize=15;
                this.reloadTime=1.5;
                this.speed=95;
                this.spread=.02;

        }

        this.ammo=this.magazineSize;

    }

    update(dt,humans,zombies){

        this.cooldown=Math.max(0,this.cooldown-dt);

        if(this.reloading){

            this.reloadTimer-=dt;

            if(this.reloadTimer<=0){

                this.reloading=false;

                this.ammo=this.magazineSize;

            }

        }

        for(let i=this.bullets.length-1;i>=0;i--){

            const b=this.bullets[i];

            b.update(dt,humans,zombies);

            if(!b.alive){

                this.bullets.splice(i,1);

            }

        }

    }

    fire(origin,direction){

        if(this.reloading)return false;

        if(this.cooldown>0)return false;

        if(this.ammo<=0){

            this.reload();

            return false;

        }

        this.cooldown=this.fireRate;

        this.ammo--;

        if(this.type==="shotgun"){

            for(let i=0;i<this.pellets;i++){

                const dir=direction.clone();

                dir.x+=(Math.random()-.5)*this.spread;
                dir.y+=(Math.random()-.5)*this.spread;
                dir.z+=(Math.random()-.5)*this.spread;

                this.spawnBullet(origin,dir);

            }

        }else{

            const dir=direction.clone();

            dir.x+=(Math.random()-.5)*this.spread;
            dir.y+=(Math.random()-.5)*this.spread;
            dir.z+=(Math.random()-.5)*this.spread;

            this.spawnBullet(origin,dir);

        }

        return true;

    }

    spawnBullet(origin,direction){

        const b=new Bullet(

            this.scene,

            origin.clone(),

            direction.clone(),

            this.owner,

            this.damage,

            this.speed

        );

        this.bullets.push(b);

    }

    reload(){

        if(this.reloading)return;

        if(this.ammo===this.magazineSize)return;

        this.reloading=true;

        this.reloadTimer=this.reloadTime;

    }

    changeWeapon(type){

        this.type=type;

        this.setup(type);

    }

    getAmmo(){

        return this.ammo;

    }

    getMagazineSize(){

        return this.magazineSize;

    }

    isReloading(){

        return this.reloading;

    }

}
