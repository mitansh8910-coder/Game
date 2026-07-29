import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";
import { Player } from "./player.js";

// ==========================
// Scene
// ==========================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// ==========================
// Camera
// ==========================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// ==========================
// Renderer
// ==========================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById("game").appendChild(renderer.domElement);

// ==========================
// Lights
// ==========================

// Ambient light
scene.add(
    new THREE.AmbientLight(0xffffff, 0.6)
);

// Sun
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(40, 60, 30);
scene.add(sun);

// ==========================
// Ground
// ==========================

const ground = new THREE.Mesh(

    new THREE.PlaneGeometry(500, 500),

    new THREE.MeshStandardMaterial({
        color: 0x3e8f3e
    })

);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

// ==========================
// Test Cube
// ==========================

const cube = new THREE.Mesh(

    new THREE.BoxGeometry(2, 2, 2),

    new THREE.MeshStandardMaterial({
        color: 0xff4444
    })

);

cube.position.set(0, 1, 0);

scene.add(cube);

// ==========================
// Grid (temporary)
// ==========================

const grid = new THREE.GridHelper(
    500,
    100,
    0x222222,
    0x555555
);

scene.add(grid);

// ==========================
// Player
// ==========================

const player = new Player(camera);

// ==========================
// Resize
// ==========================

window.addEventListener("resize", () => {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ==========================
// Animation Loop
// ==========================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    player.update(delta);

    cube.rotation.y += delta;

    renderer.render(scene, camera);

}

animate();
