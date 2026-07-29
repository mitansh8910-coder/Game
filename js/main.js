import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

// ---------------- Scene ----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// ---------------- Camera ----------------
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// ---------------- Renderer ----------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game").appendChild(renderer.domElement);

// ---------------- Lights ----------------
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(50, 100, 50);
scene.add(sun);

// ---------------- Ground ----------------
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 300),
    new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ---------------- Test Cube ----------------
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0xff3333 })
);
cube.position.set(0, 1, 0);
scene.add(cube);

// ---------------- Player ----------------
const player = {
    x: 0,
    y: 2,
    z: 12,
    rotation: 0,
    speed: 0.18
};

camera.position.set(player.x, player.y, player.z);

// ---------------- Keyboard ----------------
const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

// ---------------- Resize ----------------
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------------- Update ----------------
function updatePlayer() {

    // Rotate
    if (keys["arrowleft"]) player.rotation += 0.03;
    if (keys["arrowright"]) player.rotation -= 0.03;

    camera.rotation.y = player.rotation;

    const dx = Math.sin(player.rotation);
    const dz = Math.cos(player.rotation);

    // Move
    if (keys["w"]) {
        player.x -= dx * player.speed;
        player.z -= dz * player.speed;
    }

    if (keys["s"]) {
        player.x += dx * player.speed;
        player.z += dz * player.speed;
    }

    if (keys["a"]) {
        player.x -= dz * player.speed;
        player.z += dx * player.speed;
    }

    if (keys["d"]) {
        player.x += dz * player.speed;
        player.z -= dx * player.speed;
    }

    camera.position.set(player.x, player.y, player.z);
}

// ---------------- Loop ----------------
function animate() {

    requestAnimationFrame(animate);

    cube.rotation.y += 0.01;

    updatePlayer();

    camera.lookAt(
        player.x - Math.sin(player.rotation),
        player.y,
        player.z - Math.cos(player.rotation)
    );

    renderer.render(scene, camera);
}

animate();
