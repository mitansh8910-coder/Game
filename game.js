/* ============================================================
INFECTION: LAST STAND 3D
Three.js browser game
============================================================ */

"use strict";

// ============================================================
// GLOBALS
// ============================================================

let scene;
let camera;
let renderer;
let clock;

let gameStarted = false;
let gameOver = false;

let currentTeam = "human";
let currentCharacter = null;

let currentWave = 1;
const TOTAL_WAVES = 5;

const waveZombieCounts = [
18,
26,
34,
42,
50
];

let waveActive = false;
let waveStarting = false;

let bullets = [];

let humans = [];
let zombies = [];
let buildings = [];
let cars = [];

let keys = {};

let mouse = {
x: 0,
y: 0,
down: false
};

let pointerLocked = false;

let cameraYaw = 0;
let cameraPitch = 0.35;

let worldTime = 0;

// ============================================================
// GAME SETTINGS
// ============================================================

const WORLD_SIZE = 4000;

const HUMAN_DAMAGE = 45;

const ZOMBIE_DAMAGE = 10;

const ZOMBIE_ATTACK_DISTANCE = 2.2;

const ZOMBIE_ATTACK_COOLDOWN = 1.1;

const BULLET_SPEED = 55;

const PLAYER_HEIGHT = 1.7;

const SPRINT_MULTIPLIER = 1.7;

const MAX_SPRINT = 100;

const SPRINT_DRAIN = 30;

const SPRINT_RECHARGE = 20;

const INFECTION_REQUIRED = 5;

// ============================================================
// CHARACTER DATA
// ============================================================

const survivorData = [

```
{
    name: "Alex",
    health: 280,
    speed: 7,
    damage: 45,
    fireRate: 0.45,
    shirt: 0x326fa8,
    pants: 0x222a35,
    skin: 0xc78c68,
    hair: 0x21150e
},

{
    name: "Mia",
    health: 220,
    speed: 8.5,
    damage: 30,
    fireRate: 0.30,
    shirt: 0xa94f75,
    pants: 0x292929,
    skin: 0xe8b58c,
    hair: 0x55301d
},

{
    name: "Jack",
    health: 350,
    speed: 5.8,
    damage: 70,
    fireRate: 0.65,
    shirt: 0x555b62,
    pants: 0x202020,
    skin: 0xb87555,
    hair: 0x111111
},

{
    name: "Emma",
    health: 260,
    speed: 7.2,
    damage: 45,
    fireRate: 0.42,
    shirt: 0x668d55,
    pants: 0x252b25,
    skin: 0xe8b58e,
    hair: 0xd19b50
},

{
    name: "Liam",
    health: 270,
    speed: 7.7,
    damage: 35,
    fireRate: 0.35,
    shirt: 0xa66742,
    pants: 0x22252a,
    skin: 0xc58b67,
    hair: 0x3b2418
},

{
    name: "Noah",
    health: 400,
    speed: 5.2,
    damage: 85,
    fireRate: 0.8,
    shirt: 0x4d536c,
    pants: 0x202020,
    skin: 0x885c43,
    hair: 0x17120f
},

{
    name: "Sophia",
    health: 210,
    speed: 9,
    damage: 25,
    fireRate: 0.25,
    shirt: 0xbd5d52,
    pants: 0x272727,
    skin: 0xe8b38a,
    hair: 0x352116
},

{
    name: "Ryan",
    health: 300,
    speed: 6.7,
    damage: 50,
    fireRate: 0.5,
    shirt: 0x4e8d7c,
    pants: 0x22272a,
    skin: 0xc48761,
    hair: 0x20140e
},

{
    name: "Olivia",
    health: 250,
    speed: 7.5,
    damage: 40,
    fireRate: 0.38,
    shirt: 0x765ca8,
    pants: 0x292329,
    skin: 0xe7b98f,
    hair: 0x70431e
},

{
    name: "Daniel",
    health: 330,
    speed: 6.2,
    damage: 65,
    fireRate: 0.7,
    shirt: 0x47715f,
    pants: 0x222222,
    skin: 0xa66e51,
    hair: 0x21160f
}
```

];

// ============================================================
// INIT
// ============================================================

function init() {

```
scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x101820
    );


scene.fog =
    new THREE.Fog(
        0x101820,
        80,
        550
    );


camera =
    new THREE.PerspectiveCamera(
        70,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );


camera.position.set(
    0,
    6,
    10
);


renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.shadowMap.enabled = true;


document
    .getElementById(
        "game-container"
    )
    .appendChild(
        renderer.domElement
    );


clock =
    new THREE.Clock();


setupLighting();

createWorld();

createCharacters();

setupInput();

window.addEventListener(
    "resize",
    onResize
);


updateLoading(
    100,
    "Ready!"
);


setTimeout(
    hideLoading,
    500
);


animate();
```

}

// ============================================================
// LIGHTING
// ============================================================

function setupLighting() {

```
const ambient =
    new THREE.HemisphereLight(
        0xb8d0ff,
        0x26301f,
        1.7
    );


scene.add(
    ambient
);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        2.2
    );


sun.position.set(
    100,
    180,
    80
);


sun.castShadow = true;


sun.shadow.mapSize.width =
    2048;

sun.shadow.mapSize.height =
    2048;


sun.shadow.camera.left =
    -250;

sun.shadow.camera.right =
    250;

sun.shadow.camera.top =
    250;

sun.shadow.camera.bottom =
    -250;


scene.add(
    sun
);


const redLight =
    new THREE.PointLight(
        0xff3333,
        3,
        50
    );


redLight.position.set(
    0,
    10,
    0
);


scene.add(
    redLight
);
```

}

// ============================================================
// WORLD
// ============================================================

function createWorld() {

```
createGround();

createRoads();

createCityBuildings();

createCars();

createStreetLights();

createTrees();
```

}

// ============================================================
// GROUND
// ============================================================

function createGround() {

```
const geometry =
    new THREE.PlaneGeometry(
        WORLD_SIZE,
        WORLD_SIZE
    );


const material =
    new THREE.MeshStandardMaterial({
        color: 0x263526,
        roughness: 1
    });


const ground =
    new THREE.Mesh(
        geometry,
        material
    );


ground.rotation.x =
    -Math.PI / 2;


ground.receiveShadow =
    true;


scene.add(
    ground
);
```

}

// ============================================================
// ROADS
// ============================================================

function createRoads() {

```
const roadMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x242424,
        roughness: 0.9
    });


for (
    let i = -1800;
    i <= 1800;
    i += 900
) {

    const road =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                WORLD_SIZE,
                0.04,
                130
            ),
            roadMaterial
        );


    road.position.set(
        0,
        0.02,
        i
    );


    scene.add(
        road
    );


    const verticalRoad =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                130,
                0.04,
                WORLD_SIZE
            ),
            roadMaterial
        );


    verticalRoad.position.set(
        i,
        0.025,
        0
    );


    scene.add(
        verticalRoad
    );

}


const lineMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xd4c54a
    });


for (
    let i = -1800;
    i <= 1800;
    i += 900
) {

    const line =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                WORLD_SIZE,
                0.06,
                2
            ),
            lineMaterial
        );


    line.position.set(
        0,
        0.07,
        i
    );


    scene.add(
        line
    );


    const verticalLine =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                2,
                0.06,
                WORLD_SIZE
            ),
            lineMaterial
        );


    verticalLine.position.set(
        i,
        0.07,
        0
    );


    scene.add(
        verticalLine
    );

}
```

}

// ============================================================
// BUILDINGS
// ============================================================

function createCityBuildings() {

```
const locations = [

    [-1500, -1200, 320, 260],
    [-700, -1300, 400, 300],
    [500, -1250, 450, 350],
    [1400, -1250, 350, 280],

    [-1500, -500, 400, 300],
    [-650, -500, 350, 260],
    [550, -500, 500, 320],
    [1450, -500, 420, 300],

    [-1500, 500, 350, 300],
    [-700, 550, 500, 350],
    [550, 500, 400, 300],
    [1450, 550, 480, 350],

    [-1500, 1300, 400, 300],
    [-650, 1300, 450, 320],
    [500, 1300, 400, 300],
    [1450, 1300, 500, 350]

];


locations.forEach(
    (location, index) => {

        createBuilding(
            location[0],
            location[1],
            location[2],
            location[3],
            index
        );

    }
);
```

}

function createBuilding(
x,
z,
width,
depth,
index
) {

```
const height =
    8 +
    Math.random() * 10;


const colors = [
    0x846c59,
    0x677983,
    0x8b7463,
    0x6b6b6b,
    0x556b75,
    0x806b52
];


const material =
    new THREE.MeshStandardMaterial({
        color:
            colors[
                index %
                colors.length
            ],
        roughness: 0.8
    });


const building =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            width,
            height,
            depth
        ),
        material
    );


building.position.set(
    x,
    height / 2,
    z
);


building.castShadow =
    true;

building.receiveShadow =
    true;


scene.add(
    building
);


buildings.push({
    mesh: building,
    x,
    z,
    width,
    depth
});


createBuildingRoof(
    x,
    z,
    width,
    depth,
    height
);


createWindows(
    x,
    z,
    width,
    depth,
    height
);
```

}

// ============================================================
// ROOFS
// ============================================================

function createBuildingRoof(
x,
z,
width,
depth,
height
) {

```
const roof =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            width + 0.4,
            0.7,
            depth + 0.4
        ),
        new THREE.MeshStandardMaterial({
            color: 0x34383b
        })
    );


roof.position.set(
    x,
    height + 0.35,
    z
);


roof.castShadow =
    true;


scene.add(
    roof
);
```

}

// ============================================================
// WINDOWS
// ============================================================

function createWindows(
x,
z,
width,
depth,
height
) {

```
const windowMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x89c9dc,
        emissive: 0x16303a,
        roughness: 0.3
    });


const rows =
    Math.max(
        2,
        Math.floor(
            height / 4
        )
    );


const cols =
    Math.max(
        2,
        Math.floor(
            width / 70
        )
    );


for (
    let row = 0;
    row < rows;
    row++
) {

    for (
        let col = 0;
        col < cols;
        col++
    ) {

        const wx =
            x -
            width / 2 +
            35 +
            col *
            (
                width -
                70
            ) /
            Math.max(
                cols - 1,
                1
            );


        const wy =
            2 +
            row * 3;


        const front =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    18,
                    1.7,
                    0.15
                ),
                windowMaterial
            );


        front.position.set(
            wx,
            wy,
            z -
            depth / 2 -
            0.1
        );


        scene.add(
            front
        );


        const back =
            front.clone();


        back.position.z =
            z +
            depth / 2 +
            0.1;


        scene.add(
            back
        );

    }

}
```

}

// ============================================================
// CARS
// ============================================================

function createCars() {

```
const positions = [

    [-1150, -900],
    [-300, -900],
    [400, -900],
    [1200, -900],

    [-1100, 0],
    [300, 0],
    [1100, 0],

    [-1200, 900],
    [-400, 900],
    [700, 900],
    [1250, 1700]

];


positions.forEach(
    (pos, index) => {

        createCar(
            pos[0],
            pos[1],
            index % 2
        );

    }
);
```

}

function createCar(
x,
z,
colorIndex
) {

```
const colors = [
    0x9d302d,
    0x315e89,
    0x7a7a7a,
    0xb49338
];


const group =
    new THREE.Group();


const body =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            6,
            1.2,
            3
        ),
        new THREE.MeshStandardMaterial({
            color:
                colors[
                    colorIndex %
                    colors.length
                ]
        })
    );


body.position.y =
    1;


body.castShadow =
    true;


group.add(
    body
);


const roof =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            3,
            0.8,
            2.6
        ),
        new THREE.MeshStandardMaterial({
            color: 0x20252a
        })
    );


roof.position.set(
    -0.2,
    1.8,
    0
);


group.add(
    roof
);


const wheelMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x111111
    });


for (
    const wx of [-2, 2]
) {

    for (
        const wz of [-1.5, 1.5]
    ) {

        const wheel =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.55,
                    0.55,
                    0.35,
                    16
                ),
                wheelMaterial
            );


        wheel.rotation.z =
            Math.PI / 2;


        wheel.position.set(
            wx,
            0.6,
            wz
        );


        group.add(
            wheel
        );

    }

}


group.position.set(
    x,
    0,
    z
);


group.rotation.y =
    Math.random() *
    Math.PI;


scene.add(
    group
);


cars.push(
    group
);
```

}

// ============================================================
// STREET LIGHTS
// ============================================================

function createStreetLights() {

```
for (
    let x = -1800;
    x <= 1800;
    x += 300
) {

    createStreetLight(
        x,
        -65
    );

    createStreetLight(
        x,
        65
    );

}
```

}

function createStreetLight(
x,
z
) {

```
const pole =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.08,
            0.12,
            7,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x303030
        })
    );


pole.position.set(
    x,
    3.5,
    z
);


scene.add(
    pole
);


const lamp =
    new THREE.PointLight(
        0xffe4a0,
        0.8,
        18
    );


lamp.position.set(
    x,
    7,
    z
);


scene.add(
    lamp
);
```

}

// ============================================================
// TREES
// ============================================================

function createTrees() {

```
for (
    let i = 0;
    i < 80;
    i++
) {

    const x =
        (
            Math.random() -
            0.5
        ) *
        WORLD_SIZE;


    const z =
        (
            Math.random() -
            0.5
        ) *
        WORLD_SIZE;


    if (
        Math.abs(x) <
        180 &&
        Math.abs(z) <
        180
    )
        continue;


    createTree(
        x,
        z
    );

}
```

}

function createTree(
x,
z
) {

```
const group =
    new THREE.Group();


const trunk =
    new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.35,
            0.5,
            3,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x5a3925
        })
    );


trunk.position.y =
    1.5;


group.add(
    trunk
);


const leaves =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            2.3,
            10,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x315a35
        })
    );


leaves.position.y =
    4;


leaves.castShadow =
    true;


group.add(
    leaves
);


group.position.set(
    x,
    0,
    z
);


scene.add(
    group
);
```

}

// ============================================================
// CREATE CHARACTERS
// ============================================================

function createCharacters() {

```
const positions = [

    [-100, 0],
    [-80, 12],
    [-60, -10],
    [-40, 15],
    [-20, -15],
    [0, 12],
    [25, -12],
    [50, 10],
    [75, -10],
    [100, 8]

];


survivorData.forEach(
    (data, index) => {

        createHuman(
            data,
            positions[index][0],
            positions[index][1]
        );

    }
);


currentCharacter =
    humans[0];

currentCharacter.isPlayer =
    true;
```

}

// ============================================================
// CREATE HUMAN
// ============================================================

function createHuman(
data,
x,
z
) {

```
const group =
    createHumanMesh(
        data
    );


group.position.set(
    x,
    0,
    z
);


scene.add(
    group
);


const human = {

    type: "human",

    name: data.name,

    mesh: group,

    x,
    z,

    health: data.health,

    maxHealth: data.health,

    speed: data.speed,

    damage: data.damage,

    fireRate: data.fireRate,

    lastShot: 0,

    lastAttack: 0,

    infectionHits: 0,

    medkits: 2,

    ammo: 30,

    maxAmmo: 30,

    sprint: 100,

    alive: true,

    infected: false,

    isPlayer: false,

    ai: true,

    skin: data.skin

};


group.userData.character =
    human;


humans.push(
    human
);


return human;
```

}

// ============================================================
// HUMAN MESH
// ============================================================

function createHumanMesh(
data
) {

```
const group =
    new THREE.Group();


const body =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.42,
            0.9,
            6,
            12
        ),
        new THREE.MeshStandardMaterial({
            color:
                data.shirt
        })
    );


body.position.y =
    1.05;


body.castShadow =
    true;


group.add(
    body
);


const head =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.36,
            16,
            12
        ),
        new THREE.MeshStandardMaterial({
            color:
                data.skin
        })
    );


head.position.y =
    1.85;


head.castShadow =
    true;


group.add(
    head
);


const hair =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.37,
            16,
            8
        ),
        new THREE.MeshStandardMaterial({
            color:
                data.hair
        })
    );


hair.scale.y =
    0.55;


hair.position.y =
    2.05;


group.add(
    hair
);


const pants =
    new THREE.Mesh(
        new THREE.BoxGeometry(
            0.7,
            0.8,
            0.45
        ),
        new THREE.MeshStandardMaterial({
            color:
                data.pants
        })
    );


pants.position.y =
    0.35;


pants.castShadow =
    true;


group.add(
    pants
);


const eyeMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x111111
    });


const eye1 =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.035,
            8,
            8
        ),
        eyeMaterial
    );


eye1.position.set(
    -0.12,
    1.9,
    -0.32
);


group.add(
    eye1
);


const eye2 =
    eye1.clone();


eye2.position.x =
    0.12;


group.add(
    eye2
);


return group;
```

}

// ============================================================
// CREATE ZOMBIE
// ============================================================

function createZombie(
x,
z,
type = "normal"
) {

```
let health = 100;
let speed = 4.0;
let damage = 10;


if (
    type === "fast"
) {

    health = 90;
    speed = 6.5;
    damage = 7;

}


if (
    type === "tank"
) {

    health = 450;
    speed = 2.0;
    damage = 18;

}


const mesh =
    createZombieMesh(
        type
    );


mesh.position.set(
    x,
    0,
    z
);


scene.add(
    mesh
);


const zombie = {

    type: "zombie",

    name:
        type === "tank"
            ? "Tank Zombie"
            : type === "fast"
                ? "Runner Zombie"
                : "Walker Zombie",

    zombieType: type,

    mesh,

    x,
    z,

    health,

    maxHealth: health,

    speed,

    damage,

    lastAttack: 0,

    alive: true,

    ai: true,

    isPlayer: false

};


mesh.userData.character =
    zombie;


zombies.push(
    zombie
);


return zombie;
```

}

// ============================================================
// ZOMBIE MESH
// ============================================================

function createZombieMesh(
type
) {

```
const group =
    new THREE.Group();


let skinColor =
    0x6e875e;

let shirtColor =
    0x344834;

let scale = 1;


if (
    type === "fast"
) {

    skinColor =
        0x789b62;

    shirtColor =
        0x4d5e35;

    scale = 0.9;

}


if (
    type === "tank"
) {

    skinColor =
        0x526d4c;

    shirtColor =
        0x443d51;

    scale = 1.35;

}


const body =
    new THREE.Mesh(
        new THREE.CapsuleGeometry(
            0.5,
            1,
            6,
            12
        ),
        new THREE.MeshStandardMaterial({
            color:
                shirtColor
        })
    );


body.position.y =
    1.05;


body.castShadow =
    true;


group.add(
    body
);


const head =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.4,
            16,
            12
        ),
        new THREE.MeshStandardMaterial({
            color:
                skinColor
        })
    );


head.position.y =
    1.95;


group.add(
    head
);


const hair =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.42,
            12,
            8
        ),
        new THREE.MeshStandardMaterial({
            color: 0x171c14
        })
    );


hair.scale.y =
    0.45;


hair.position.y =
    2.18;


group.add(
    hair
);


const eyeMaterial =
    new THREE.MeshBasicMaterial({
        color: 0xff1b1b
    });


for (
    const x of [-0.13, 0.13]
) {

    const eye =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.045,
                8,
                8
            ),
            eyeMaterial
        );


    eye.position.set(
        x,
        2,
        -0.36
    );


    group.add(
        eye
    );

}


group.scale.setScalar(
    scale
);


return group;
```

}

// ============================================================
// START GAME
// ============================================================

function startGame() {

```
if (gameStarted)
    return;


gameStarted = true;


document
    .getElementById(
        "start-screen"
    )
    .style.display =
    "none";


showWaveAnnouncement(
    1,
    18
);


setTimeout(
    () => {

        startWave();

    },
    2500
);
```

}

// ============================================================
// WAVE
// ============================================================

function startWave() {

```
if (
    gameOver ||
    waveActive ||
    waveStarting
)
    return;


if (
    currentWave >
    TOTAL_WAVES
) {

    humanVictory();

    return;

}


waveActive = true;
waveStarting = false;


const count =
    waveZombieCounts[
        currentWave - 1
    ];


showWaveAnnouncement(
    currentWave,
    count
);


for (
    let i = 0;
    i < count;
    i++
) {

    setTimeout(
        () => {

            if (!gameOver)
                spawnWaveZombie();

        },

        i * 180
    );

}
```

}

// ============================================================
// SPAWN ZOMBIE
// ============================================================

function spawnWaveZombie() {

```
const angle =
    Math.random() *
    Math.PI *
    2;


const distance =
    120 +
    Math.random() *
    100;


const player =
    currentCharacter ||
    humans[0];


const px =
    player.mesh.position.x;


const pz =
    player.mesh.position.z;


const x =
    px +
    Math.cos(angle) *
    distance;


const z =
    pz +
    Math.sin(angle) *
    distance;


let type =
    "normal";


const random =
    Math.random();


if (
    currentWave >= 2 &&
    random < 0.2
) {

    type = "fast";

}


if (
    currentWave >= 3 &&
    random < 0.08
) {

    type = "tank";

}


createZombie(
    x,
    z,
    type
);
```

}

// ============================================================
// CHECK WAVE
// ============================================================

function checkWave() {

```
if (!waveActive)
    return;


const livingZombies =
    zombies.filter(
        zombie =>
            zombie.alive
    );


if (
    livingZombies.length >
    0
)
    return;


waveActive = false;


if (
    currentWave >=
    TOTAL_WAVES
) {

    humanVictory();

    return;

}


currentWave++;


setTimeout(
    () => {

        if (!gameOver)
            startWave();

    },
    4000
);
```

}

// ============================================================
// PLAYER UPDATE
// ============================================================

function updatePlayer(
delta
) {

```
if (
    !currentCharacter ||
    !currentCharacter.alive
)
    return;


if (
    currentTeam ===
    "human"
) {

    updateHumanPlayer(
        delta
    );

}
else {

    updateZombiePlayer(
        delta
    );

}
```

}

// ============================================================
// HUMAN PLAYER
// ============================================================

function updateHumanPlayer(
delta
) {

```
let forward = 0;
let right = 0;


if (
    keys["w"]
)
    forward += 1;


if (
    keys["s"]
)
    forward -= 1;


if (
    keys["d"]
)
    right += 1;


if (
    keys["a"]
)
    right -= 1;


const movement =
    new THREE.Vector3(
        right,
        0,
        -forward
    );


if (
    movement.length() >
    0
) {

    movement.normalize();


    const sprinting =
        keys["shift"] &&
        currentCharacter.sprint >
        0;


    let speed =
        currentCharacter.speed;


    if (sprinting) {

        speed *=
            SPRINT_MULTIPLIER;

        currentCharacter.sprint -=
            SPRINT_DRAIN *
            delta;

    }
    else {

        currentCharacter.sprint +=
            SPRINT_RECHARGE *
            delta;

    }


    currentCharacter.sprint =
        Math.max(
            0,
            Math.min(
                MAX_SPRINT,
                currentCharacter.sprint
            )
        );


    movement.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        cameraYaw
    );


    currentCharacter.mesh.position
        .add(
            movement.multiplyScalar(
                speed * delta
            )
        );

}


keepCharacterInsideWorld(
    currentCharacter
);


if (
    mouse.down
) {

    shoot();

}


updateCamera();
```

}

// ============================================================
// ZOMBIE PLAYER
// ============================================================

function updateZombiePlayer(
delta
) {

```
let forward = 0;
let right = 0;


if (
    keys["w"]
)
    forward += 1;


if (
    keys["s"]
)
    forward -= 1;


if (
    keys["d"]
)
    right += 1;


if (
    keys["a"]
)
    right -= 1;


const movement =
    new THREE.Vector3(
        right,
        0,
        -forward
    );


if (
    movement.length() >
    0
) {

    movement.normalize();


    movement.applyAxisAngle(
        new THREE.Vector3(
            0,
            1,
            0
        ),
        cameraYaw
    );


    currentCharacter.mesh.position
        .add(
            movement.multiplyScalar(
                currentCharacter.speed *
                delta
            )
        );

}


keepCharacterInsideWorld(
    currentCharacter
);


if (
    mouse.down
) {

    zombieAttackPlayer();

}


updateCamera();
```

}

// ============================================================
// HUMAN AI
// ============================================================

function updateHumanAI(
delta
) {

```
humans.forEach(
    human => {

        if (
            !human.alive ||
            human.isPlayer ||
            human.infected
        )
            return;


        const target =
            nearestLivingZombie(
                human.mesh.position
            );


        if (!target)
            return;


        const distance =
            human.mesh.position.distanceTo(
                target.mesh.position
            );


        if (
            distance <
            35
        ) {

            const direction =
                new THREE.Vector3()
                    .subVectors(
                        human.mesh.position,
                        target.mesh.position
                    )
                    .normalize();


            human.mesh.position.add(
                direction.multiplyScalar(
                    human.speed *
                    0.3 *
                    delta
                )
            );

        }


        if (
            distance <
            45
        ) {

            humanShootAI(
                human,
                target
            );

        }

    }
);
```

}

// ============================================================
// HUMAN AI SHOOT
// ============================================================

function humanShootAI(
human,
zombie
) {

```
const now =
    worldTime;


if (
    now -
    human.lastShot <
    human.fireRate
)
    return;


if (
    human.ammo <= 0
) {

    human.ammo =
        human.maxAmmo;

    return;

}


human.lastShot =
    now;


human.ammo--;


damageZombie(
    zombie,
    human.damage
);
```

}

// ============================================================
// ZOMBIE AI
// ============================================================

function updateZombieAI(
delta
) {

```
zombies.forEach(
    zombie => {

        if (
            !zombie.alive ||
            zombie.isPlayer
        )
            return;


        const target =
            nearestLivingHuman(
                zombie.mesh.position
            );


        if (!target)
            return;


        const direction =
            new THREE.Vector3()
                .subVectors(
                    target.mesh.position,
                    zombie.mesh.position
                );


        const distance =
            direction.length();


        if (
            distance >
            ZOMBIE_ATTACK_DISTANCE
        ) {

            direction.normalize();


            zombie.mesh.position.add(
                direction.multiplyScalar(
                    zombie.speed *
                    delta
                )
            );

        }
        else {

            zombieAttack(
                zombie,
                target
            );

        }

    }
);
```

}

// ============================================================
// ZOMBIE ATTACK
// ============================================================

function zombieAttack(
zombie,
human
) {

```
const now =
    worldTime;


if (
    now -
    zombie.lastAttack <
    ZOMBIE_ATTACK_COOLDOWN
)
    return;


zombie.lastAttack =
    now;


human.health -=
    zombie.damage;


if (
    Math.random() <
    0.25
) {

    human.infectionHits++;

}


if (
    human.health <= 0 ||
    human.infectionHits >=
    INFECTION_REQUIRED
) {

    infectHuman(
        human,
        zombie
    );

}
```

}

// ============================================================
// PLAYER ZOMBIE ATTACK
// ============================================================

function zombieAttackPlayer() {

```
if (
    currentTeam !==
    "zombie"
)
    return;


const target =
    nearestLivingHuman(
        currentCharacter.mesh.position
    );


if (!target)
    return;


const distance =
    currentCharacter.mesh.position
        .distanceTo(
            target.mesh.position
        );


if (
    distance >
    ZOMBIE_ATTACK_DISTANCE
)
    return;


const now =
    worldTime;


if (
    now -
    currentCharacter.lastAttack <
    ZOMBIE_ATTACK_COOLDOWN
)
    return;


currentCharacter.lastAttack =
    now;


target.health -=
    currentCharacter.damage ||
    10;


if (
    Math.random() <
    0.35
) {

    target.infectionHits++;

}


if (
    target.health <= 0 ||
    target.infectionHits >=
    INFECTION_REQUIRED
) {

    infectHuman(
        target,
        currentCharacter
    );

}
```

}

// ============================================================
// INFECT HUMAN
// ============================================================

function infectHuman(
human,
attacker
) {

```
if (
    !human.alive ||
    human.infected
)
    return;


human.infected =
    true;

human.alive =
    false;


const position =
    human.mesh.position.clone();


scene.remove(
    human.mesh
);


const zombie =
    createZombie(
        position.x,
        position.z,
        "normal"
    );


zombie.name =
    human.name +
    " - INFECTED";


if (
    human.isPlayer
) {

    switchToZombie(
        zombie
    );

}


updateHUD();
```

}

// ============================================================
// SWITCH TO ZOMBIE
// ============================================================

function switchToZombie(
zombie
) {

```
currentTeam =
    "zombie";


if (
    currentCharacter
) {

    currentCharacter.isPlayer =
        false;

}


currentCharacter =
    zombie;


zombie.isPlayer =
    true;


showInfectionWarning();
```

}

// ============================================================
// SWITCH CHARACTER
// ============================================================

function switchCharacter() {

```
if (
    currentTeam !==
    "human"
)
    return;


const available =
    humans.filter(
        human =>
            human.alive &&
            !human.infected
    );


if (
    available.length <= 1
)
    return;


const index =
    available.indexOf(
        currentCharacter
    );


if (
    currentCharacter
) {

    currentCharacter.isPlayer =
        false;

}


const next =
    available[
        (
            index + 1
        ) %
        available.length
    ];


currentCharacter =
    next;


next.isPlayer =
    true;


updateCamera();
```

}

// ============================================================
// SHOOTING
// ============================================================

function shoot() {

```
if (
    currentTeam !==
    "human"
)
    return;


const now =
    worldTime;


if (
    now -
    currentCharacter.lastShot <
    currentCharacter.fireRate
)
    return;


if (
    currentCharacter.ammo <= 0
) {

    return;

}


currentCharacter.lastShot =
    now;


currentCharacter.ammo--;


const origin =
    currentCharacter.mesh.position
        .clone();


origin.y +=
    1.4;


const direction =
    getAimDirection();


createBullet(
    origin,
    direction,
    currentCharacter.damage
);
```

}

// ============================================================
// BULLET
// ============================================================

function createBullet(
origin,
direction,
damage
) {

```
const mesh =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.08,
            8,
            8
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffd34d
        })
    );


mesh.position.copy(
    origin
);


scene.add(
    mesh
);


bullets.push({

    mesh,

    velocity:
        direction
            .normalize()
            .multiplyScalar(
                BULLET_SPEED
            ),

    damage,

    life: 2

});
```

}

// ============================================================
// UPDATE BULLETS
// ============================================================

function updateBullets(
delta
) {

```
bullets.forEach(
    bullet => {

        bullet.mesh.position.add(
            bullet.velocity
                .clone()
                .multiplyScalar(
                    delta
                )
        );


        bullet.life -=
            delta;


        zombies.forEach(
            zombie => {

                if (
                    !zombie.alive
                )
                    return;


                const distance =
                    bullet.mesh.position
                        .distanceTo(
                            zombie.mesh.position
                        );


                if (
                    distance <
                    1.4
                ) {

                    damageZombie(
                        zombie,
                        bullet.damage
                    );


                    bullet.life =
                        0;

                }

            }
        );

    }
);


bullets =
    bullets.filter(
        bullet => {

            if (
                bullet.life <=
                0
            ) {

                scene.remove(
                    bullet.mesh
                );

                return false;

            }

            return true;

        }
    );
```

}

// ============================================================
// DAMAGE ZOMBIE
// ============================================================

function damageZombie(
zombie,
damage
) {

```
if (
    !zombie.alive
)
    return;


zombie.health -=
    damage;


if (
    zombie.health <= 0
) {

    killZombie(
        zombie
    );

}
```

}

// ============================================================
// KILL ZOMBIE
// ============================================================

function killZombie(
zombie
) {

```
zombie.alive =
    false;


scene.remove(
    zombie.mesh
);


if (
    zombie.isPlayer
) {

    const available =
        zombies.filter(
            z =>
                z.alive
        );


    if (
        available.length > 0
    ) {

        zombie.isPlayer =
            false;


        currentCharacter =
            available[0];

        currentCharacter.isPlayer =
            true;

    }
    else {

        humanVictory();

    }

}


checkWave();
```

}

// ============================================================
// AIM
// ============================================================

function getAimDirection() {

```
const direction =
    new THREE.Vector3(
        0,
        0,
        -1
    );


direction.applyQuaternion(
    camera.quaternion
);


return direction.normalize();
```

}

// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

```
if (
    !currentCharacter
)
    return;


const target =
    currentCharacter.mesh.position
        .clone();


target.y +=
    PLAYER_HEIGHT;


const distance =
    8;


const offset =
    new THREE.Vector3(
        Math.sin(
            cameraYaw
        ) *
        distance,

        3.8,

        Math.cos(
            cameraYaw
        ) *
        distance
    );


camera.position.copy(
    target.clone()
        .add(offset)
);


camera.lookAt(
    target
);
```

}

// ============================================================
// KEEP INSIDE WORLD
// ============================================================

function keepCharacterInsideWorld(
character
) {

```
const limit =
    WORLD_SIZE / 2 -
    10;


character.mesh.position.x =
    THREE.MathUtils.clamp(
        character.mesh.position.x,
        -limit,
        limit
    );


character.mesh.position.z =
    THREE.MathUtils.clamp(
        character.mesh.position.z,
        -limit,
        limit
    );
```

}

// ============================================================
// NEAREST HUMAN
// ============================================================

function nearestLivingHuman(
position
) {

```
let nearest =
    null;

let distance =
    Infinity;


humans.forEach(
    human => {

        if (
            !human.alive ||
            human.infected
        )
            return;


        const d =
            position.distanceTo(
                human.mesh.position
            );


        if (
            d <
            distance
        ) {

            distance =
                d;

            nearest =
                human;

        }

    }
);


return nearest;
```

}

// ============================================================
// NEAREST ZOMBIE
// ============================================================

function nearestLivingZombie(
position
) {

```
let nearest =
    null;

let distance =
    Infinity;


zombies.forEach(
    zombie => {

        if (
            !zombie.alive
        )
            return;


        const d =
            position.distanceTo(
                zombie.mesh.position
            );


        if (
            d <
            distance
        ) {

            distance =
                d;

            nearest =
                zombie;

        }

    }
);


return nearest;
```

}

// ============================================================
// CAMERA MOUSE
// ============================================================

function updateMouseLook(
movementX,
movementY
) {

```
cameraYaw -=
    movementX *
    0.0025;


cameraPitch -=
    movementY *
    0.002;


cameraPitch =
    THREE.MathUtils.clamp(
        cameraPitch,
        -0.5,
        1
    );
```

}

// ============================================================
// INPUT
// ============================================================

function setupInput() {

```
document.addEventListener(
    "keydown",
    event => {

        keys[
            event.key.toLowerCase()
        ] = true;


        if (
            event.key ===
            "Tab"
        ) {

            event.preventDefault();

            switchCharacter();

        }


        if (
            event.key.toLowerCase() ===
            "e"
        ) {

            useMedkit();

        }


        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            reload();

        }


        if (
            event.key.toLowerCase() ===
            "enter" &&
            gameOver
        ) {

            location.reload();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


renderer.domElement.addEventListener(
    "mousedown",
    event => {

        mouse.down =
            true;


        if (
            !pointerLocked
        ) {

            renderer.domElement
                .requestPointerLock();

        }

    }
);


document.addEventListener(
    "mouseup",
    () => {

        mouse.down =
            false;

    }
);


document.addEventListener(
    "mousemove",
    event => {

        if (
            !pointerLocked
        )
            return;


        updateMouseLook(
            event.movementX,
            event.movementY
        );

    }
);


document.addEventListener(
    "pointerlockchange",
    () => {

        pointerLocked =
            document.pointerLockElement ===
            renderer.domElement;

    }
);


document
    .getElementById(
        "start-button"
    )
    .addEventListener(
        "click",
        startGame
    );


document
    .getElementById(
        "restart-button"
    )
    .addEventListener(
        "click",
        () => {

            location.reload();

        }
    );
```

}

// ============================================================
// MEDKIT
// ============================================================

function useMedkit() {

```
if (
    currentTeam !==
    "human"
)
    return;


if (
    !currentCharacter ||
    currentCharacter.medkits <= 0
)
    return;


if (
    currentCharacter.health >=
    currentCharacter.maxHealth
)
    return;


currentCharacter.medkits--;


currentCharacter.health +=
    100;


currentCharacter.health =
    Math.min(
        currentCharacter.health,
        currentCharacter.maxHealth
    );
```

}

// ============================================================
// RELOAD
// ============================================================

function reload() {

```
if (
    currentTeam !==
    "human"
)
    return;


if (
    !currentCharacter
)
    return;


currentCharacter.ammo =
    currentCharacter.maxAmmo;
```

}

// ============================================================
// UI
// ============================================================

function updateHUD() {

```
if (
    !currentCharacter
)
    return;


document
    .getElementById(
        "mode"
    )
    .textContent =
    currentTeam.toUpperCase();


document
    .getElementById(
        "character"
    )
    .textContent =
    currentCharacter.name;


document
    .getElementById(
        "health"
    )
    .textContent =
    Math.max(
        0,
        Math.floor(
            currentCharacter.health
        )
    );


const healthPercent =
    Math.max(
        0,
        currentCharacter.health /
        currentCharacter.maxHealth *
        100
    );


document
    .getElementById(
        "health-bar"
    )
    .style.width =
    healthPercent +
    "%";


document
    .getElementById(
        "humans"
    )
    .textContent =
    humans.filter(
        h =>
            h.alive &&
            !h.infected
    ).length;


document
    .getElementById(
        "zombies"
    )
    .textContent =
    zombies.filter(
        z =>
            z.alive
    ).length;


document
    .getElementById(
        "wave"
    )
    .textContent =
    `${Math.min(
        currentWave,
        TOTAL_WAVES
    )} / ${TOTAL_WAVES}`;


const humanStats =
    document
        .getElementById(
            "human-stats"
        );


const zombieStats =
    document
        .getElementById(
            "zombie-stats"
        );


if (
    currentTeam ===
    "human"
) {

    humanStats
        .classList
        .remove(
            "hidden"
        );

    zombieStats
        .classList
        .add(
            "hidden"
        );


    document
        .getElementById(
            "ammo"
        )
        .textContent =
        `${currentCharacter.ammo} / ${currentCharacter.maxAmmo}`;


    document
        .getElementById(
            "medkits"
        )
        .textContent =
        currentCharacter.medkits;


    document
        .getElementById(
            "sprint"
        )
        .textContent =
        Math.floor(
            currentCharacter.sprint
        ) +
        "%";


    document
        .getElementById(
            "sprint-bar"
        )
        .style.width =
        currentCharacter.sprint +
        "%";

}
else {

    humanStats
        .classList
        .add(
            "hidden"
        );

    zombieStats
        .classList
        .remove(
            "hidden"
        );

}
```

}

// ============================================================
// WAVE UI
// ============================================================

function showWaveAnnouncement(
wave,
count
) {

```
const box =
    document
        .getElementById(
            "wave-announcement"
        );


document
    .getElementById(
        "wave-number"
    )
    .textContent =
    `WAVE ${wave}`;


document
    .getElementById(
        "wave-text"
    )
    .textContent =
    `${count} ZOMBIES ARE COMING`;


box.classList.remove(
    "hidden"
);


setTimeout(
    () => {

        box.classList.add(
            "hidden"
        );

    },
    2500
);
```

}

// ============================================================
// INFECTION UI
// ============================================================

function showInfectionWarning() {

```
const warning =
    document
        .getElementById(
            "infection-warning"
        );


warning.classList.remove(
    "hidden"
);


setTimeout(
    () => {

        warning.classList.add(
            "hidden"
        );

    },
    3000
);
```

}

// ============================================================
// WIN
// ============================================================

function humanVictory() {

```
if (gameOver)
    return;


gameOver =
    true;


showResult(
    "🏆",
    "HUMANS WIN!",
    "The survivors defeated all five zombie waves."
);
```

}

// ============================================================
// ZOMBIE VICTORY
// ============================================================

function zombieVictory() {

```
if (gameOver)
    return;


gameOver =
    true;


showResult(
    "🧟",
    "ZOMBIES WIN!",
    "Every survivor has been infected."
);
```

}

// ============================================================
// RESULT
// ============================================================

function showResult(
icon,
title,
description
) {

```
document
    .getElementById(
        "result-icon"
    )
    .textContent =
    icon;


document
    .getElementById(
        "result-title"
    )
    .textContent =
    title;


document
    .getElementById(
        "result-description"
    )
    .textContent =
    description;


document
    .getElementById(
        "game-over"
    )
    .classList
    .remove(
        "hidden"
    );
```

}

// ============================================================
// LOADING
// ============================================================

function updateLoading(
progress,
text
) {

```
const bar =
    document
        .getElementById(
            "loading-progress"
        );


const label =
    document
        .getElementById(
            "loading-text"
        );


if (bar)
    bar.style.width =
        progress +
        "%";


if (label)
    label.textContent =
        text;
```

}

function hideLoading() {

```
const loading =
    document
        .getElementById(
            "loading-screen"
        );


if (loading)
    loading.style.display =
        "none";
```

}

// ============================================================
// RESIZE
// ============================================================

function onResize() {

```
camera.aspect =
    window.innerWidth /
    window.innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
```

}

// ============================================================
// MAIN LOOP
// ============================================================

function animate() {

```
requestAnimationFrame(
    animate
);


const delta =
    Math.min(
        clock.getDelta(),
        0.05
    );


worldTime +=
    delta;


if (
    gameStarted &&
    !gameOver
) {

    updatePlayer(
        delta
    );

    updateHumanAI(
        delta
    );

    updateZombieAI(
        delta
    );

    updateBullets(
        delta
    );


    checkWave();


    const livingHumans =
        humans.filter(
            h =>
                h.alive &&
                !h.infected
        );


    if (
        livingHumans.length ===
        0
    ) {

        zombieVictory();

    }


    updateHUD();

}


renderer.render(
    scene,
    camera
);
```

}

// ============================================================
// START
// ============================================================

init();
