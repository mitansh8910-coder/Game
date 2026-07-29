import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

import { Player } from "./player.js";
import { World } from "./world.js";
import { HumanManager } from "./humans.js";
import { ZombieManager } from "./zombies.js";
import { BulletManager } from "./bullets.js";
import { WaveManager } from "./waves.js";
import { UI } from "./ui.js";

// =====================================
// Scene
// =====================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// =====================================
// Camera
// =====================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

// =====================================
// Renderer
// =====================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("game").appendChild(renderer.domElement);

// =====================================
// World
// =====================================

const world = new World(scene);

// =====================================
// Player
// =====================================

const player = new Player(camera);

// =====================================
// Humans
// =====================================

const humans = new HumanManager(scene);

// =====================================
// Zombies
// =====================================

const zombies = new ZombieManager(scene);

// =====================================
// Bullets
// =====================================

const bullets = new BulletManager(
    scene,
    camera,
    zombies
);

// =====================================
// Waves
// =====================================

const waves = new WaveManager(
    zombies
);

// =====================================
// UI
// =====================================

const ui = new UI();

// =====================================
// Resize
// =====================================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// =====================================
// Clock
// =====================================

const clock = new THREE.Clock();

// =====================================
// Game Loop
// =====================================

function animate(){

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    player.update(delta);

    humans.update(delta);

    zombies.update(delta);

    bullets.update(delta);

    waves.update();

    ui.setWave(waves.wave);
    ui.setHumans(humans.humans.length);
    ui.setZombies(zombies.zombies.length);

    renderer.render(scene,camera);

}

animate();
