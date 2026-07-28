// ============================================================
// INFECTION
// BUILDINGS + CHARACTER FACES + ZOMBIE DESIGNS
// ============================================================

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


// ============================================================
// CANVAS
// ============================================================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ============================================================
// WORLD
// ============================================================

const WORLD_WIDTH = 4000;
const WORLD_HEIGHT = 2600;


// ============================================================
// WAVE SETTINGS
// ============================================================

const FIRST_WAVE_ZOMBIES = 18;
const WAVE_INCREMENT = 8;
const TOTAL_WAVES = 5;

let currentWave = 1;
let waveActive = false;
let waveTimer = 2000;


// ============================================================
// COMBAT
// ============================================================

const BULLET_SPEED = 950;

const ZOMBIE_ATTACK_DISTANCE = 50;
const ZOMBIE_ATTACK_COOLDOWN = 650;


// ============================================================
// GAME STATE
// ============================================================

let gameOver = false;

let currentTeam = "human";

let currentCharacterId = null;

let nextCharacterId = 1;

let bullets = [];

let particles = [];

let keys = {};

let mouse = {
    x: 0,
    y: 0,
    down: false
};

let camera = {
    x: 0,
    y: 0
};


// ============================================================
// ARRAYS
// ============================================================

const humans = [];
const zombies = [];
const buildings = [];
const cars = [];


// ============================================================
// SURVIVOR DATA
// ============================================================

const survivorData = [

    {
        name: "Alex",
        health: 120,
        speed: 270,
        damage: 45,
        fireRate: 650,
        skin: "#d69b72",
        hair: "#25180f",
        shirt: "#3f79b5"
    },

    {
        name: "Mia",
        health: 90,
        speed: 320,
        damage: 30,
        fireRate: 450,
        skin: "#f0bd91",
        hair: "#5a321d",
        shirt: "#a94d72"
    },

    {
        name: "Jack",
        health: 150,
        speed: 210,
        damage: 70,
        fireRate: 850,
        skin: "#bd805a",
        hair: "#151515",
        shirt: "#5b5b5b"
    },

    {
        name: "Emma",
        health: 100,
        speed: 250,
        damage: 45,
        fireRate: 650,
        skin: "#f1c39d",
        hair: "#d39a4e",
        shirt: "#648c54"
    },

    {
        name: "Liam",
        health: 110,
        speed: 290,
        damage: 35,
        fireRate: 500,
        skin: "#d59a73",
        hair: "#3a2418",
        shirt: "#a56c43"
    },

    {
        name: "Noah",
        health: 180,
        speed: 190,
        damage: 85,
        fireRate: 1000,
        skin: "#8e5c42",
        hair: "#17120f",
        shirt: "#4d536c"
    },

    {
        name: "Sophia",
        health: 85,
        speed: 340,
        damage: 25,
        fireRate: 400,
        skin: "#edb98d",
        hair: "#342014",
        shirt: "#bd5d52"
    },

    {
        name: "Ryan",
        health: 130,
        speed: 240,
        damage: 50,
        fireRate: 700,
        skin: "#c88963",
        hair: "#20140e",
        shirt: "#4e8d7c"
    },

    {
        name: "Olivia",
        health: 100,
        speed: 280,
        damage: 40,
        fireRate: 550,
        skin: "#f0c49d",
        hair: "#6e421e",
        shirt: "#765ca8"
    },

    {
        name: "Daniel",
        health: 160,
        speed: 220,
        damage: 65,
        fireRate: 800,
        skin: "#a86f50",
        hair: "#21160f",
        shirt: "#47715f"
    }

];


// ============================================================
// BUILDINGS
// ============================================================

function createBuilding(
    x,
    y,
    width,
    height,
    type,
    name
) {

    buildings.push({

        x,
        y,
        width,
        height,
        type,
        name

    });

}


// ============================================================
// CREATE CITY
// ============================================================

function createCity() {

    buildings.length = 0;
    cars.length = 0;


    // Houses

    createBuilding(
        300,
        250,
        420,
        300,
        "house",
        "Safe House"
    );


    createBuilding(
        950,
        250,
        450,
        320,
        "house",
        "Family House"
    );


    createBuilding(
        1700,
        300,
        500,
        350,
        "shop",
        "Supermarket"
    );


    createBuilding(
        2700,
        250,
        500,
        300,
        "hospital",
        "Hospital"
    );


    createBuilding(
        350,
        1100,
        500,
        350,
        "house",
        "Apartment"
    );


    createBuilding(
        1200,
        1200,
        600,
        400,
        "police",
        "Police Station"
    );


    createBuilding(
        2200,
        1100,
        550,
        350,
        "shop",
        "Grocery Store"
    );


    createBuilding(
        3100,
        1200,
        550,
        400,
        "house",
        "Large House"
    );


    createBuilding(
        500,
        1900,
        600,
        350,
        "house",
        "Warehouse"
    );


    createBuilding(
        1600,
        1950,
        600,
        350,
        "shop",
        "Mall"
    );


    createBuilding(
        2800,
        1900,
        600,
        350,
        "hospital",
        "Clinic"
    );


    // Cars

    createCar(850, 850, 80, 40);
    createCar(1500, 800, 80, 40);
    createCar(2350, 800, 80, 40);
    createCar(2900, 900, 80, 40);
    createCar(1150, 1750, 80, 40);
    createCar(2500, 1750, 80, 40);
    createCar(3500, 1750, 80, 40);

}


function createCar(
    x,
    y,
    width,
    height
) {

    cars.push({
        x,
        y,
        width,
        height
    });

}


// ============================================================
// CREATE HUMAN
// ============================================================

function createHuman(x, y, data) {

    const human = {

        id: nextCharacterId++,

        type: "human",

        name: data.name,

        x,
        y,

        radius: 18,

        health: data.health,

        maxHealth: data.health,

        speed: data.speed,

        damage: data.damage,

        fireRate: data.fireRate,

        skin: data.skin,

        hair: data.hair,

        shirt: data.shirt,

        alive: true,

        infected: false,

        ai: true,

        lastAttack: 0

    };

    humans.push(human);

    return human;

}


// ============================================================
// CREATE ZOMBIE
// ============================================================

function createZombie(
    x,
    y,
    name = "Zombie",
    zombieType = "normal"
) {

    let health = 100;
    let speed = 150;
    let radius = 20;


    if (zombieType === "fast") {

        health = 70;
        speed = 260;
        radius = 16;

    }


    if (zombieType === "tank") {

        health = 300;
        speed = 85;
        radius = 30;

    }


    const zombie = {

        id: nextCharacterId++,

        type: "zombie",

        name,

        zombieType,

        x,
        y,

        radius,

        health,

        maxHealth: health,

        speed,

        alive: true,

        ai: true,

        lastAttack: 0,

        skin:
            zombieType === "tank"
                ? "#687b55"
                : zombieType === "fast"
                    ? "#78925d"
                    : "#657d5c"

    };

    zombies.push(zombie);

    return zombie;

}


// ============================================================
// INITIAL HUMANS
// ============================================================

function createInitialHumans() {

    const positions = [

        [600, 700],
        [750, 650],
        [850, 750],
        [650, 850],
        [950, 900],
        [1100, 700],
        [1050, 950],
        [800, 1050],
        [1200, 900],
        [500, 950]

    ];


    for (
        let i = 0;
        i < survivorData.length;
        i++
    ) {

        createHuman(
            positions[i][0],
            positions[i][1],
            survivorData[i]
        );

    }


    currentTeam = "human";

    currentCharacterId =
        humans[0].id;

    humans[0].ai = false;

}


// ============================================================
// WAVE COUNT
// ============================================================

function getWaveZombieCount(wave) {

    return (
        FIRST_WAVE_ZOMBIES +
        (wave - 1) *
        WAVE_INCREMENT
    );

}


// ============================================================
// SPAWN WAVE
// ============================================================

function spawnWave() {

    if (gameOver)
        return;


    const count =
        getWaveZombieCount(
            currentWave
        );


    waveActive = true;


    showWaveMessage(
        `WAVE ${currentWave}`,
        `${count} ZOMBIES ARE COMING`
    );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        setTimeout(
            spawnSingleZombie,
            i * 180
        );

    }

}


// ============================================================
// SPAWN ZOMBIE
// ============================================================

function spawnSingleZombie() {

    if (gameOver)
        return;


    let x;
    let y;


    const side =
        Math.floor(
            Math.random() * 4
        );


    if (side === 0) {

        x =
            Math.random() *
            WORLD_WIDTH;

        y = 80;

    }

    else if (side === 1) {

        x =
            WORLD_WIDTH - 80;

        y =
            Math.random() *
            WORLD_HEIGHT;

    }

    else if (side === 2) {

        x =
            Math.random() *
            WORLD_WIDTH;

        y =
            WORLD_HEIGHT - 80;

    }

    else {

        x = 80;

        y =
            Math.random() *
            WORLD_HEIGHT;

    }


    let type = "normal";

    const roll =
        Math.random();


    if (
        currentWave >= 2 &&
        roll < 0.20
    ) {

        type = "fast";

    }


    if (
        currentWave >= 3 &&
        roll < 0.08
    ) {

        type = "tank";

    }


    createZombie(
        x,
        y,
        type === "tank"
            ? "Tank"
            : type === "fast"
                ? "Runner"
                : "Walker",
        type
    );

}


// ============================================================
// WAVE UPDATE
// ============================================================

function updateWaveTimer(dt) {

    if (waveActive)
        return;


    if (
        currentWave >
        TOTAL_WAVES
    )
        return;


    waveTimer -=
        dt * 1000;


    if (
        waveTimer <= 0
    ) {

        spawnWave();

    }

}


function checkWaveFinished() {

    if (!waveActive)
        return;


    const living =
        zombies.filter(
            z =>
                z.alive
        );


    if (
        living.length === 0
    ) {

        waveActive = false;


        if (
            currentWave >=
            TOTAL_WAVES
        ) {

            endGame(
                "🧑 HUMANS SURVIVED ALL WAVES!"
            );

            return;

        }


        currentWave++;

        waveTimer = 3500;

    }

}


// ============================================================
// COLLISION WITH BUILDINGS
// ============================================================

function circleRectangleCollision(
    circle,
    rect
) {

    const closestX =
        Math.max(
            rect.x,
            Math.min(
                circle.x,
                rect.x +
                rect.width
            )
        );


    const closestY =
        Math.max(
            rect.y,
            Math.min(
                circle.y,
                rect.y +
                rect.height
            )
        );


    const dx =
        circle.x -
        closestX;


    const dy =
        circle.y -
        closestY;


    return (
        dx * dx +
        dy * dy <
        circle.radius *
        circle.radius
    );

}


// ============================================================
// MOVEMENT COLLISION
// ============================================================

function moveCharacter(
    character,
    dx,
    dy
) {

    const oldX =
        character.x;

    const oldY =
        character.y;


    character.x += dx;


    if (
        buildings.some(
            building =>
                circleRectangleCollision(
                    character,
                    building
                )
        )
    ) {

        character.x =
            oldX;

    }


    character.y += dy;


    if (
        buildings.some(
            building =>
                circleRectangleCollision(
                    character,
                    building
                )
        )
    ) {

        character.y =
            oldY;

    }


    keepInsideWorld(
        character
    );

}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(dt) {

    const player =
        getCurrentCharacter();


    if (!player)
        return;


    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    )
        dy--;


    if (
        keys["s"] ||
        keys["arrowdown"]
    )
        dy++;


    if (
        keys["a"] ||
        keys["arrowleft"]
    )
        dx--;


    if (
        keys["d"] ||
        keys["arrowright"]
    )
        dx++;


    if (
        dx !== 0 ||
        dy !== 0
    ) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        dx /= length;
        dy /= length;

    }


    moveCharacter(
        player,
        dx *
        player.speed *
        dt,

        dy *
        player.speed *
        dt
    );

}


// ============================================================
// HUMAN AI
// ============================================================

function updateHumanAI(dt) {

    for (
        const human of humans
    ) {

        if (!human.alive)
            continue;

        if (human.infected)
            continue;

        if (!human.ai)
            continue;


        const zombie =
            findNearestZombie(
                human
            );


        if (!zombie)
            continue;


        const distance =
            distanceBetween(
                human,
                zombie
            );


        if (
            distance < 350
        ) {

            const dx =
                human.x -
                zombie.x;

            const dy =
                human.y -
                zombie.y;


            const length =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                length > 0
            ) {

                moveCharacter(
                    human,

                    dx / length *
                    human.speed *
                    0.35 *
                    dt,

                    dy / length *
                    human.speed *
                    0.35 *
                    dt
                );

            }

        }


        if (
            distance < 600
        ) {

            humanShoot(
                human
            );

        }

    }

}


// ============================================================
// ZOMBIE AI
// ============================================================

function updateZombieAI(dt) {

    for (
        const zombie of zombies
    ) {

        if (!zombie.alive)
            continue;

        if (!zombie.ai)
            continue;


        const human =
            findNearestHuman(
                zombie
            );


        if (!human)
            continue;


        const dx =
            human.x -
            zombie.x;

        const dy =
            human.y -
            zombie.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance >
            ZOMBIE_ATTACK_DISTANCE
        ) {

            if (
                distance > 0
            ) {

                moveCharacter(
                    zombie,

                    dx / distance *
                    zombie.speed *
                    dt,

                    dy / distance *
                    zombie.speed *
                    dt
                );

            }

        }
        else {

            zombieAttack(
                zombie,
                human
            );

        }

    }

}


// ============================================================
// PLAYER ZOMBIE ATTACK
// ============================================================

function updateZombiePlayer() {

    if (
        currentTeam !==
        "zombie"
    )
        return;


    const zombie =
        getCurrentCharacter();


    if (!zombie)
        return;


    const human =
        findNearestHuman(
            zombie
        );


    if (!human)
        return;


    if (
        distanceBetween(
            zombie,
            human
        ) <=
        ZOMBIE_ATTACK_DISTANCE
    ) {

        zombieAttack(
            zombie,
            human
        );

    }

}


// ============================================================
// ZOMBIE ATTACK
// ============================================================

function zombieAttack(
    zombie,
    human
) {

    if (!human.alive)
        return;


    const now =
        Date.now();


    if (
        now -
        zombie.lastAttack <
        ZOMBIE_ATTACK_COOLDOWN
    )
        return;


    zombie.lastAttack =
        now;


    let chance = 0.45;


    if (
        zombie.zombieType ===
        "fast"
    )
        chance = 0.55;


    if (
        zombie.zombieType ===
        "tank"
    )
        chance = 0.70;


    if (
        Math.random() <
        chance
    ) {

        becomeZombie(
            human
        );

    }
    else {

        human.health -=
            30;


        createBloodEffect(
            human.x,
            human.y,
            "#ff3333"
        );


        if (
            human.health <= 0
        ) {

            becomeZombie(
                human
            );

        }

    }

}


// ============================================================
// INFECTION
// ============================================================

function becomeZombie(
    human
) {

    if (!human.alive)
        return;


    human.alive = false;
    human.infected = true;


    const zombie =
        createZombie(
            human.x,
            human.y,
            human.name +
            " - INFECTED",
            "normal"
        );


    if (
        human.id ===
        currentCharacterId
    ) {

        currentTeam =
            "zombie";

        currentCharacterId =
            zombie.id;

        zombie.ai = false;

        showInfectionMessage();

    }


    createBloodEffect(
        human.x,
        human.y,
        "#65ff72"
    );

}


// ============================================================
// PLAYER SHOOTING
// ============================================================

function updatePlayerShooting() {

    if (
        currentTeam !==
        "human"
    )
        return;


    if (!mouse.down)
        return;


    const player =
        getCurrentCharacter();


    if (!player)
        return;


    humanShoot(
        player
    );

}


function humanShoot(
    human
) {

    const now =
        Date.now();


    if (
        now -
        human.lastAttack <
        human.fireRate
    )
        return;


    human.lastAttack =
        now;


    const target =
        screenToWorld(
            mouse.x,
            mouse.y
        );


    const angle =
        Math.atan2(
            target.y -
            human.y,

            target.x -
            human.x
        );


    bullets.push({

        x: human.x,
        y: human.y,

        vx:
            Math.cos(angle) *
            BULLET_SPEED,

        vy:
            Math.sin(angle) *
            BULLET_SPEED,

        damage:
            human.damage,

        life: 1.5

    });

}


// ============================================================
// BULLETS
// ============================================================

function updateBullets(dt) {

    for (
        const bullet of bullets
    ) {

        bullet.x +=
            bullet.vx *
            dt;

        bullet.y +=
            bullet.vy *
            dt;

        bullet.life -=
            dt;


        // Buildings block bullets

        if (
            buildings.some(
                building =>
                    pointInsideRectangle(
                        bullet.x,
                        bullet.y,
                        building
                    )
            )
        ) {

            bullet.life = 0;

            continue;

        }


        for (
            const zombie of zombies
        ) {

            if (!zombie.alive)
                continue;


            if (
                distanceBetween(
                    bullet,
                    zombie
                ) <
                zombie.radius
            ) {

                zombie.health -=
                    bullet.damage;


                bullet.life = 0;


                createBloodEffect(
                    zombie.x,
                    zombie.y,
                    "#ff3333"
                );


                if (
                    zombie.health <=
                    0
                ) {

                    killZombie(
                        zombie
                    );

                }


                break;

            }

        }

    }


    bullets =
        bullets.filter(
            bullet =>
                bullet.life > 0
        );

}


function pointInsideRectangle(
    x,
    y,
    rect
) {

    return (
        x >= rect.x &&
        x <=
            rect.x +
            rect.width &&
        y >= rect.y &&
        y <=
            rect.y +
            rect.height
    );

}


// ============================================================
// KILL ZOMBIE
// ============================================================

function killZombie(
    zombie
) {

    zombie.alive = false;


    createBloodEffect(
        zombie.x,
        zombie.y,
        "#8cff70"
    );


    if (
        zombie.id ===
        currentCharacterId &&
        currentTeam ===
        "zombie"
    ) {

        const available =
            getAvailableCharacters();


        if (
            available.length > 0
        ) {

            currentCharacterId =
                available[0].id;

            available[0].ai =
                false;

        }

    }

}


// ============================================================
// CHARACTER SWITCH
// ============================================================

function switchCharacter() {

    if (gameOver)
        return;


    const available =
        getAvailableCharacters();


    if (
        available.length <= 1
    )
        return;


    let index =
        available.findIndex(
            character =>
                character.id ===
                currentCharacterId
        );


    if (index >= 0)
        available[index].ai = true;


    index++;


    if (
        index >=
        available.length
    )
        index = 0;


    const next =
        available[index];


    currentCharacterId =
        next.id;


    next.ai = false;


    createSwitchEffect(
        next.x,
        next.y
    );

}


// ============================================================
// GET CURRENT CHARACTER
// ============================================================

function getCurrentCharacter() {

    if (
        currentTeam ===
        "human"
    ) {

        return humans.find(
            human =>
                human.id ===
                currentCharacterId &&
                human.alive &&
                !human.infected
        );

    }


    return zombies.find(
        zombie =>
            zombie.id ===
            currentCharacterId &&
            zombie.alive
    );

}


function getAvailableCharacters() {

    if (
        currentTeam ===
        "human"
    ) {

        return humans.filter(
            human =>
                human.alive &&
                !human.infected
        );

    }


    return zombies.filter(
        zombie =>
            zombie.alive
    );

}


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

    const player =
        getCurrentCharacter();


    if (!player)
        return;


    camera.x =
        player.x -
        canvas.width / 2;


    camera.y =
        player.y -
        canvas.height / 2;


    camera.x =
        Math.max(
            0,
            Math.min(
                WORLD_WIDTH -
                canvas.width,
                camera.x
            )
        );


    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT -
                canvas.height,
                camera.y
            )
        );

}


function screenToWorld(
    x,
    y
) {

    return {
        x:
            x +
            camera.x,

        y:
            y +
            camera.y
    };

}


function worldToScreen(
    x,
    y
) {

    return {
        x:
            x -
            camera.x,

        y:
            y -
            camera.y
    };

}


// ============================================================
// DRAW WORLD
// ============================================================

function drawWorld() {

    ctx.fillStyle =
        "#182018";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    drawRoads();

    drawBuildings();

    drawCars();

}


// ============================================================
// ROADS
// ============================================================

function drawRoads() {

    ctx.fillStyle =
        "#252525";


    // Horizontal roads

    for (
        let y = 850;
        y < WORLD_HEIGHT;
        y += 850
    ) {

        const screen =
            worldToScreen(
                0,
                y
            );


        ctx.fillRect(
            screen.x,
            screen.y,
            WORLD_WIDTH,
            180
        );

    }


    // Vertical roads

    for (
        let x = 850;
        x < WORLD_WIDTH;
        x += 850
    ) {

        const screen =
            worldToScreen(
                x,
                0
            );


        ctx.fillRect(
            screen.x,
            screen.y,
            180,
            WORLD_HEIGHT
        );

    }


    // Road markings

    ctx.strokeStyle =
        "#c7b84a";

    ctx.setLineDash([
        30,
        30
    ]);

    ctx.lineWidth = 3;


    for (
        let y = 940;
        y < WORLD_HEIGHT;
        y += 850
    ) {

        const screen =
            worldToScreen(
                0,
                y
            );


        ctx.beginPath();

        ctx.moveTo(
            screen.x,
            screen.y
        );

        ctx.lineTo(
            screen.x +
            WORLD_WIDTH,
            screen.y
        );

        ctx.stroke();

    }


    ctx.setLineDash([]);

}


// ============================================================
// BUILDINGS
// ============================================================

function drawBuildings() {

    for (
        const building of buildings
    ) {

        const p =
            worldToScreen(
                building.x,
                building.y
            );


        let wall =
            "#777777";


        let roof =
            "#4c4c4c";


        if (
            building.type ===
            "house"
        ) {

            wall =
                "#b18a68";

            roof =
                "#704b3c";

        }


        if (
            building.type ===
            "shop"
        ) {

            wall =
                "#768b92";

            roof =
                "#3e5056";

        }


        if (
            building.type ===
            "hospital"
        ) {

            wall =
                "#d0d0d0";

            roof =
                "#707070";

        }


        if (
            building.type ===
            "police"
        ) {

            wall =
                "#53677b";

            roof =
                "#293b4d";

        }


        // Shadow

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";


        ctx.fillRect(
            p.x + 12,
            p.y + 15,
            building.width,
            building.height
        );


        // Building body

        ctx.fillStyle =
            wall;


        ctx.fillRect(
            p.x,
            p.y,
            building.width,
            building.height
        );


        // Roof

        ctx.fillStyle =
            roof;


        ctx.fillRect(
            p.x,
            p.y,
            building.width,
            45
        );


        // Windows

        drawWindows(
            p.x,
            p.y,
            building
        );


        // Door

        ctx.fillStyle =
            "#38271e";


        ctx.fillRect(
            p.x +
                building.width / 2 -
                20,

            p.y +
                building.height -
                65,

            40,
            65
        );


        // Building label

        ctx.font =
            "bold 14px Arial";

        ctx.textAlign =
            "center";

        ctx.fillStyle =
            "rgba(255,255,255,0.8)";


        ctx.fillText(
            building.name,
            p.x +
                building.width / 2,

            p.y +
                building.height +
                20
        );

    }

}


// ============================================================
// WINDOWS
// ============================================================

function drawWindows(
    x,
    y,
    building
) {

    const rows = 2;

    const cols = 3;


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
                x +
                55 +
                col *
                (
                    (
                        building.width -
                        110
                    ) /
                    2
                );


            const wy =
                y +
                80 +
                row *
                85;


            ctx.fillStyle =
                "#182b35";


            ctx.fillRect(
                wx,
                wy,
                45,
                45
            );


            ctx.strokeStyle =
                "#c6c6a5";


            ctx.lineWidth = 2;


            ctx.strokeRect(
                wx,
                wy,
                45,
                45
            );

        }

    }

}


// ============================================================
// CARS
// ============================================================

function drawCars() {

    for (
        const car of cars
    ) {

        const p =
            worldToScreen(
                car.x,
                car.y
            );


        ctx.fillStyle =
            "#242a30";


        ctx.fillRect(
            p.x,
            p.y,
            car.width,
            car.height
        );


        ctx.fillStyle =
            "#1a2025";


        ctx.fillRect(
            p.x + 15,
            p.y - 8,
            45,
            12
        );


        ctx.fillStyle =
            "#111";


        ctx.beginPath();

        ctx.arc(
            p.x + 18,
            p.y + car.height,
            9,
            0,
            Math.PI * 2
        );

        ctx.arc(
            p.x + 62,
            p.y + car.height,
            9,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// ============================================================
// CHARACTER DRAWING
// ============================================================

function drawCharacters() {

    for (
        const human of humans
    ) {

        if (
            !human.alive ||
            human.infected
        )
            continue;


        drawHuman(
            human
        );

    }


    for (
        const zombie of zombies
    ) {

        if (!zombie.alive)
            continue;


        drawZombie(
            zombie
        );

    }

}


// ============================================================
// HUMAN
// ============================================================

function drawHuman(
    human
) {

    const p =
        worldToScreen(
            human.x,
            human.y
        );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";


    ctx.beginPath();

    ctx.ellipse(
        p.x,
        p.y + 19,
        21,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        human.shirt;


    ctx.beginPath();

    ctx.roundRect(
        p.x - 13,
        p.y + 2,
        26,
        27,
        8
    );

    ctx.fill();


    // Neck

    ctx.fillStyle =
        human.skin;


    ctx.fillRect(
        p.x - 5,
        p.y - 4,
        10,
        10
    );


    // Face

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y - 13,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Hair

    ctx.fillStyle =
        human.hair;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y - 18,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    // Hair side

    ctx.fillRect(
        p.x - 14,
        p.y - 18,
        5,
        12
    );


    ctx.fillRect(
        p.x + 9,
        p.y - 18,
        5,
        12
    );


    // Eyes

    ctx.fillStyle =
        "#111";


    ctx.beginPath();

    ctx.arc(
        p.x - 5,
        p.y - 12,
        2,
        0,
        Math.PI * 2
    );

    ctx.arc(
        p.x + 5,
        p.y - 12,
        2,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Nose

    ctx.fillStyle =
        "#9a654e";


    ctx.fillRect(
        p.x - 1,
        p.y - 9,
        2,
        4
    );


    // Smile

    ctx.strokeStyle =
        "#592f2f";

    ctx.lineWidth = 1;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y - 7,
        5,
        0,
        Math.PI
    );

    ctx.stroke();


    // Selection ring

    if (
        human.id ===
        currentCharacterId &&
        currentTeam ===
        "human"
    ) {

        ctx.strokeStyle =
            "#35d9ff";

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            31,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    drawHealthBar(
        p.x,
        p.y - 39,
        human
    );


    drawName(
        p.x,
        p.y - 51,
        human.name
    );

}


// ============================================================
// ZOMBIE
// ============================================================

function drawZombie(
    zombie
) {

    const p =
        worldToScreen(
            zombie.x,
            zombie.y
        );


    let shirt =
        "#344b35";


    if (
        zombie.zombieType ===
        "fast"
    ) {

        shirt =
            "#4f5d30";

    }


    if (
        zombie.zombieType ===
        "tank"
    ) {

        shirt =
            "#423d52";

    }


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.45)";


    ctx.beginPath();

    ctx.ellipse(
        p.x,
        p.y + 20,
        zombie.radius + 5,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        shirt;


    ctx.beginPath();

    ctx.roundRect(
        p.x -
            zombie.radius * 0.7,

        p.y,

        zombie.radius * 1.4,

        zombie.radius * 1.4,

        7
    );

    ctx.fill();


    // Neck

    ctx.fillStyle =
        zombie.skin;


    ctx.fillRect(
        p.x - 6,
        p.y - 7,
        12,
        10
    );


    // Face

    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y - 18,
        zombie.radius * 0.72,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Messy hair

    ctx.fillStyle =
        "#20251b";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y - 23,
        zombie.radius * 0.72,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    // Glowing eyes

    ctx.fillStyle =
        "#ff3030";


    ctx.beginPath();

    ctx.arc(
        p.x -
            zombie.radius * 0.28,

        p.y - 18,

        3,

        0,
        Math.PI * 2
    );


    ctx.arc(
        p.x +
            zombie.radius * 0.28,

        p.y - 18,

        3,

        0,
        Math.PI * 2
    );


    ctx.fill();


    // Zombie mouth

    ctx.fillStyle =
        "#281212";


    ctx.beginPath();

    ctx.ellipse(
        p.x,
        p.y - 8,
        zombie.radius * 0.42,
        zombie.radius * 0.28,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Teeth

    ctx.fillStyle =
        "#ded8b6";


    for (
        let i = -1;
        i <= 1;
        i++
    ) {

        ctx.fillRect(
            p.x +
                i * 5 -
                2,

            p.y - 12,

            4,
            5
        );

    }


    // Blood

    ctx.fillStyle =
        "#8e2020";


    ctx.fillRect(
        p.x +
            zombie.radius * 0.5,

        p.y - 4,

        3,
        12
    );


    // Player selection

    if (
        zombie.id ===
        currentCharacterId &&
        currentTeam ===
        "zombie"
    ) {

        ctx.strokeStyle =
            "#ff4141";

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            zombie.radius + 10,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    drawHealthBar(
        p.x,
        p.y -
            zombie.radius -
            13,

        zombie
    );


    drawName(
        p.x,
        p.y -
            zombie.radius -
            23,

        zombie.name
    );

}


// ============================================================
// HEALTH BAR
// ============================================================

function drawHealthBar(
    x,
    y,
    character
) {

    const width = 48;
    const height = 5;


    const ratio =
        Math.max(
            0,
            character.health /
            character.maxHealth
        );


    ctx.fillStyle =
        "#151515";


    ctx.fillRect(
        x -
            width / 2,

        y,

        width,
        height
    );


    ctx.fillStyle =
        ratio > 0.5
            ? "#5ce36a"
            : "#f04444";


    ctx.fillRect(
        x -
            width / 2,

        y,

        width * ratio,
        height
    );

}


// ============================================================
// NAME
// ============================================================

function drawName(
    x,
    y,
    name
) {

    ctx.font =
        "bold 12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "#ffffff";


    ctx.fillText(
        name,
        x,
        y
    );

}


// ============================================================
// BULLETS
// ============================================================

function drawBullets() {

    ctx.fillStyle =
        "#ffd447";


    for (
        const bullet of bullets
    ) {

        const p =
            worldToScreen(
                bullet.x,
                bullet.y
            );


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            4,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}


// ============================================================
// PARTICLES
// ============================================================

function createBloodEffect(
    x,
    y,
    color
) {

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            40 +
            Math.random() *
            100;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 0.5,

            color

        });

    }

}


function createSwitchEffect(
    x,
    y
) {

    for (
        let i = 0;
        i < 15;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        particles.push({

            x,
            y,

            vx:
                Math.cos(angle) *
                80,

            vy:
                Math.sin(angle) *
                80,

            life: 0.4,

            color:
                "#55ddff"

        });

    }

}


function updateParticles(
    dt
) {

    for (
        const particle of particles
    ) {

        particle.x +=
            particle.vx *
            dt;

        particle.y +=
            particle.vy *
            dt;

        particle.life -=
            dt;

    }


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );

}


function drawParticles() {

    for (
        const particle of particles
    ) {

        const p =
            worldToScreen(
                particle.x,
                particle.y
            );


        ctx.globalAlpha =
            Math.max(
                0,
                particle.life * 2
            );


        ctx.fillStyle =
            particle.color;


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            3,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }


    ctx.globalAlpha = 1;

}


// ============================================================
// FIND NEAREST
// ============================================================

function findNearestHuman(
    character
) {

    let nearest = null;
    let closest = Infinity;


    for (
        const human of humans
    ) {

        if (
            !human.alive ||
            human.infected
        )
            continue;


        const d =
            distanceBetween(
                character,
                human
            );


        if (
            d < closest
        ) {

            closest = d;
            nearest = human;

        }

    }


    return nearest;

}


function findNearestZombie(
    character
) {

    let nearest = null;
    let closest = Infinity;


    for (
        const zombie of zombies
    ) {

        if (!zombie.alive)
            continue;


        const d =
            distanceBetween(
                character,
                zombie
            );


        if (
            d < closest
        ) {

            closest = d;
            nearest = zombie;

        }

    }


    return nearest;

}


// ============================================================
// DISTANCE
// ============================================================

function distanceBetween(
    a,
    b
) {

    const dx =
        a.x -
        b.x;


    const dy =
        a.y -
        b.y;


    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ============================================================
// WORLD LIMIT
// ============================================================

function keepInsideWorld(
    character
) {

    character.x =
        Math.max(
            character.radius,
            Math.min(
                WORLD_WIDTH -
                character.radius,
                character.x
            )
        );


    character.y =
        Math.max(
            character.radius,
            Math.min(
                WORLD_HEIGHT -
                character.radius,
                character.y
            )
        );

}


// ============================================================
// HUD
// ============================================================

function updateHUD() {

    const player =
        getCurrentCharacter();


    const mode =
        document.getElementById(
            "mode"
        );

    const character =
        document.getElementById(
            "character"
        );

    const health =
        document.getElementById(
            "health"
        );

    const humanCount =
        document.getElementById(
            "humans"
        );

    const zombieCount =
        document.getElementById(
            "zombies"
        );


    if (mode)
        mode.textContent =
            currentTeam.toUpperCase();


    if (character)
        character.textContent =
            player
                ? player.name
                : "-";


    if (health)
        health.textContent =
            player
                ? Math.max(
                    0,
                    Math.floor(
                        player.health
                    )
                )
                : 0;


    if (humanCount)
        humanCount.textContent =
            humans.filter(
                h =>
                    h.alive &&
                    !h.infected
            ).length;


    if (zombieCount)
        zombieCount.textContent =
            zombies.filter(
                z =>
                    z.alive
            ).length;

}


// ============================================================
// INFECTION MESSAGE
// ============================================================

function showInfectionMessage() {

    let warning =
        document.getElementById(
            "infectionWarning"
        );


    if (!warning) {

        warning =
            document.createElement(
                "div"
            );

        warning.id =
            "infectionWarning";


        document.body.appendChild(
            warning
        );

    }


    warning.textContent =
        "☠ YOU ARE INFECTED ☠";


    warning.style.display =
        "block";


    setTimeout(
        () => {

            warning.style.display =
                "none";

        },
        1800
    );

}


// ============================================================
// WAVE MESSAGE
// ============================================================

function showWaveMessage(
    title,
    subtitle
) {

    let box =
        document.getElementById(
            "waveMessage"
        );


    if (!box) {

        box =
            document.createElement(
                "div"
            );

        box.id =
            "waveMessage";


        document.body.appendChild(
            box
        );

    }


    box.innerHTML = `
        <div style="
            font-size:42px;
            font-weight:900;
        ">
            ${title}
        </div>

        <div style="
            font-size:18px;
            margin-top:8px;
        ">
            ${subtitle}
        </div>
    `;


    box.style.position =
        "fixed";

    box.style.top =
        "30%";

    box.style.left =
        "50%";

    box.style.transform =
        "translate(-50%,-50%)";

    box.style.textAlign =
        "center";

    box.style.color =
        "white";

    box.style.background =
        "rgba(0,0,0,0.75)";

    box.style.padding =
        "30px 55px";

    box.style.borderRadius =
        "15px";

    box.style.zIndex =
        "9999";

    box.style.display =
        "block";


    setTimeout(
        () => {

            box.style.display =
                "none";

        },
        2500
    );

}


// ============================================================
// GAME STATE
// ============================================================

function checkGameState() {

    const livingHumans =
        humans.filter(
            human =>
                human.alive &&
                !human.infected
        );


    if (
        livingHumans.length === 0
    ) {

        endGame(
            "🧟 ZOMBIES WIN!"
        );

        return;

    }


    checkWaveFinished();

}


function endGame(
    message
) {

    if (gameOver)
        return;


    gameOver = true;


    const result =
        document.getElementById(
            "result"
        );


    const messageBox =
        document.getElementById(
            "message"
        );


    if (result)
        result.textContent =
            message;


    if (messageBox)
        messageBox.style.display =
            "flex";

}


// ============================================================
// INPUT
// ============================================================

window.addEventListener(
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
            event.key.toLowerCase()
            === "r" &&
            gameOver
        ) {

            location.reload();

        }

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


canvas.addEventListener(
    "mousemove",
    event => {

        mouse.x =
            event.clientX;

        mouse.y =
            event.clientY;

    }
);


canvas.addEventListener(
    "mousedown",
    event => {

        if (
            event.button === 0
        )
            mouse.down = true;

    }
);


canvas.addEventListener(
    "mouseup",
    event => {

        if (
            event.button === 0
        )
            mouse.down = false;

    }
);


// ============================================================
// GAME LOOP
// ============================================================

let previousTime =
    performance.now();


function gameLoop(
    time
) {

    const dt =
        Math.min(
            (
                time -
                previousTime
            ) / 1000,
            0.05
        );


    previousTime =
        time;


    if (!gameOver) {

        updatePlayer(dt);

        updateHumanAI(dt);

        updateZombieAI(dt);

        updatePlayerShooting();

        updateZombiePlayer();

        updateBullets(dt);

        updateParticles(dt);

        updateWaveTimer(dt);

        updateCamera();

        checkGameState();

        updateHUD();

    }


    drawWorld();

    drawCharacters();

    drawBullets();

    drawParticles();


    requestAnimationFrame(
        gameLoop
    );

}


// ============================================================
// START
// ============================================================

createCity();

createInitialHumans();

requestAnimationFrame(
    gameLoop
);
