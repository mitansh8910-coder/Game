export class WaveManager {

    constructor(zombieManager) {

        this.zombieManager = zombieManager;

        this.wave = 1;

        this.startWave();

    }

    getZombieCount() {

        return 18 + (this.wave - 1) * 8;

    }

    startWave() {

        const count = this.getZombieCount();

        console.log(
            `Wave ${this.wave} started with ${count} zombies`
        );

        this.zombieManager.spawnWave(count);

    }

    update() {

        if (this.zombieManager.zombies.length === 0) {

            this.wave++;

            console.log(
                `Wave ${this.wave}`
            );

            this.startWave();

        }

    }

    reset() {

        this.wave = 1;

    }

}
