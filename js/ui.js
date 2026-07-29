export class UI {

    constructor() {

        this.health = 100;
        this.wave = 1;
        this.humans = 30;
        this.zombies = 18;
        this.score = 0;
        this.weapon = "Rifle";
        this.ammo = "∞";

        this.createHUD();

    }

    createHUD() {

        this.hud = document.createElement("div");
        this.hud.id = "hud";

        document.body.appendChild(this.hud);

        this.update();

    }

    update() {

        this.hud.innerHTML = `

            <h2>🧟 Infection: Last Stand</h2>

            <hr>

            <p>❤️ Health : ${this.health}</p>

            <p>🔫 Weapon : ${this.weapon}</p>

            <p>💥 Ammo : ${this.ammo}</p>

            <p>🌊 Wave : ${this.wave}</p>

            <p>🧟 Zombies : ${this.zombies}</p>

            <p>👨 Humans : ${this.humans}</p>

            <p>⭐ Score : ${this.score}</p>

        `;

    }

    setHealth(value){

        this.health = Math.max(0,Math.floor(value));

        this.update();

    }

    setWave(value){

        this.wave = value;

        this.update();

    }

    setHumans(value){

        this.humans = value;

        this.update();

    }

    setZombies(value){

        this.zombies = value;

        this.update();

    }

    addScore(points){

        this.score += points;

        this.update();

    }

    setWeapon(name){

        this.weapon = name;

        this.update();

    }

    setAmmo(value){

        this.ammo = value;

        this.update();

    }

}
