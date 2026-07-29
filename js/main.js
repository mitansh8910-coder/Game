import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

import { Player } from "./player.js";
import { World } from "./world.js";

// ======================================
// Scene
// ======================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ======================================
// Camera
// ======================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

// ======================================
// Renderer
// ======================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("game").appendChild(renderer.domElement);

// ======================================
// World
// ======================================

const world = new World(scene);

// ======================================
// Player
// ======================================

const player = new Player(camera);

// ======================================
// Resize
// ======================================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ======================================
// Animation
// ======================================

const clock = new THREE.Clock();

function animate(){

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    player.update(delta);

    renderer.render(scene,camera);

}

animate();
