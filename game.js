// ============================================================
// INFECTION
// Zombie Survival
// Character Switching + Horde System
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
// SETTINGS
// ============================================================

const HUMAN_SPEED = 250;
const ZOMBIE_SPEED = 150;

const BULLET_SPEED = 950;

const ZOMBIE_ATTACK_DISTANCE = 48;

const ZOMBIE_ATTACK_COOLDOWN = 700;


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
    x: canvas.width / 2,
    y: canvas.height / 2,
    down: false
};

let camera = {
    x: 0,
    y: 0
};


// ============================================================
// CHARACTER LISTS
// ============================================================

const humans = [];
const zombies = [];


// ============================================================
// SURVIVOR DATA
// ============================================================

const survivorData = [

    {
        name: "Alex",
        health: 120,
        speed: 270,
        damage: 40,
        fireRate: 220
    },

    {
        name: "Mia",
        health: 90,
        speed: 320,
        damage: 30,
        fireRate: 150
    },

    {
        name: "Jack",
        health: 150,
        speed: 210,
        damage: 55,
        fireRate: 300
    },

    {
        name: "Emma",
        health: 100,
        speed: 250,
        damage: 45,
        fireRate: 220
    },

    {
        name: "Liam",
        health: 110,
        speed: 290,
        damage: 35,
        fireRate: 180
    },

    {
        name: "Noah",
        health: 180,
        speed: 190,
        damage: 70,
        fireRate: 350
    },

    {
        name: "Sophia",
        health: 85,
        speed: 340,
        damage: 25,
        fireRate: 120
    },

    {
        name: "Ryan",
        health: 130,
        speed: 240,
        damage: 50,
        fireRate: 240
    },

    {
        name: "Olivia",
        health: 100,
        speed: 280,
        damage: 40,
        fireRate: 200
    },

    {
        name: "Daniel",
        health: 160,
        speed: 220,
        damage: 60,
        fireRate: 280
    }

];


// ============================================================
// CREATE HUMAN
// ============================================================

function createHuman(x, y, data) {

    const human = {

        id: nextCharacterId++,

        type: "human",

        name: data.name,

        x: x,

        y: y,

        radius: 18,

        health: data.health,

        maxHealth: data.health,

        speed: data.speed,

        damage: data.damage,

        fireRate: data.fireRate,

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
    let speed = ZOMBIE_SPEED;
    let radius = 20;


    // FAST ZOMBIE

    if (zombieType === "fast") {

        health = 65;
        speed = 260;
        radius = 16;

    }


    // TANK ZOMBIE

    if (zombieType === "tank") {

        health = 300;
        speed = 85;
        radius = 30;

    }


    const zombie = {

        id: nextCharacterId++,

        type: "zombie",

        name: name,

        zombieType: zombieType,

        x: x,

        y: y,

        radius: radius,

        health: health,

        maxHealth: health,

        speed: speed,

        alive: true,

        ai: true,

        lastAttack: 0

    };

    zombies.push(zombie);

    return zombie;
}


// ============================================================
// INITIAL GAME
// ============================================================

function createInitialGame() {

    humans.length = 0;
    zombies.length = 0;

    bullets.length = 0;
    particles.length = 0;


    // --------------------------------------------------------
    // SURVIVORS
    // --------------------------------------------------------

    const positions = [

        [600, 600],
        [750, 520],
        [850, 700],
        [650, 800],
        [950, 850],
        [1100, 650],
        [1050, 900],
        [800, 1000],
        [1200, 800],
        [500, 900]

    ];


    for (let i = 0; i < survivorData.length; i++) {

        createHuman(
            positions[i][0],
            positions[i][1],
            survivorData[i]
        );

    }


    // --------------------------------------------------------
    // ZOMBIE HORDE
    // --------------------------------------------------------

    // Normal zombies

    for (let i = 0; i < 12; i++) {

        createZombie(

            2500 + Math.random() * 1000,

            500 + Math.random() * 1500,

            "Walker",

            "normal"

        );

    }


    // Fast zombies

    for (let i = 0; i < 4; i++) {

        createZombie(

            2200 + Math.random() * 1200,

            500 + Math.random() * 1500,

            "Runner",

            "fast"

        );

    }


    // Tank zombies

    for (let i = 0; i < 2; i++) {

        createZombie(

            3000 + Math.random() * 700,

            700 + Math.random() * 1000,

            "Tank",

            "tank"

        );

    }


    // Player

    currentTeam = "human";

    currentCharacterId = humans[0].id;

    humans[0].ai = false;

}

createInitialGame();


// ============================================================
// INPUT
// ============================================================

window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;


    if (event.key === "Tab") {

        event.preventDefault();

        switchCharacter();

    }


    if (
        event.key.toLowerCase() === "r" &&
        gameOver
    ) {

        location.reload();

    }

});


window.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});


canvas.addEventListener("mousemove", event => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


canvas.addEventListener("mousedown", event => {

    if (event.button === 0) {

        mouse.down = true;

    }

});


canvas.addEventListener("mouseup", event => {

    if (event.button === 0) {

        mouse.down = false;

    }

});


canvas.addEventListener("contextmenu", event => {

    event.preventDefault();

});


// ============================================================
// CURRENT CHARACTER
// ============================================================

function getCurrentCharacter() {

    if (currentTeam === "human") {

        return humans.find(
            h =>
                h.id === currentCharacterId &&
                h.alive &&
                !h.infected
        );

    }


    return zombies.find(
        z =>
            z.id === currentCharacterId &&
            z.alive
    );

}


// ============================================================
// AVAILABLE CHARACTERS
// ============================================================

function getAvailableCharacters() {

    if (currentTeam === "human") {

        return humans.filter(
            h =>
                h.alive &&
                !h.infected
        );

    }


    return zombies.filter(
        z =>
            z.alive
    );

}


// ============================================================
// CHARACTER SWITCHING
// ============================================================

function switchCharacter() {

    if (gameOver) return;


    const available =
        getAvailableCharacters();


    if (available.length <= 1) return;


    let index =
        available.findIndex(
            c =>
                c.id === currentCharacterId
        );


    if (index >= 0) {

        available[index].ai = true;

    }


    index++;


    if (index >= available.length) {

        index = 0;

    }


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
// INFECTION
// ============================================================

function becomeZombie(human) {

    if (!human.alive) return;


    human.alive = false;

    human.infected = true;


    const zombie =
        createZombie(

            human.x,
            human.y,

            human.name + " - INFECTED",

            "normal"

        );


    // Player gets transformed

    if (
        human.id ===
        currentCharacterId
    ) {

        currentTeam = "zombie";

        currentCharacterId =
            zombie.id;

        zombie.ai = false;

        showInfectionMessage();

    }


    createBloodEffect(
        human.x,
        human.y,
        "#78ff65"
    );

}


// ============================================================
// INFECTION MESSAGE
// ============================================================

function showInfectionMessage() {

    const warning =
        document.getElementById(
            "infectionWarning"
        );


    if (!warning) return;


    warning.textContent =
        "YOU ARE INFECTED";


    warning.style.display =
        "block";


    setTimeout(() => {

        warning.style.display =
            "none";

    }, 1800);

}


// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(dt) {

    const player =
        getCurrentCharacter();


    if (!player) return;


    let dx = 0;
    let dy = 0;


    if (
        keys["w"] ||
        keys["arrowup"]
    ) {

        dy--;

    }


    if (
        keys["s"] ||
        keys["arrowdown"]
    ) {

        dy++;

    }


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        dx--;

    }


    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        dx++;

    }


    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        dx /= length;
        dy /= length;

    }


    player.x +=
        dx *
        player.speed *
        dt;


    player.y +=
        dy *
        player.speed *
        dt;


    keepInsideWorld(player);

}


// ============================================================
// HUMAN AI
// ============================================================

function updateHumanAI(dt) {

    for (const human of humans) {

        if (!human.alive) continue;

        if (human.infected) continue;

        if (!human.ai) continue;


        const zombie =
            findNearestZombie(human);


        if (!zombie) continue;


        const distance =
            distanceBetween(
                human,
                zombie
            );


        // RUN AWAY

        if (distance < 500) {

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


            if (length > 0) {

                human.x +=
                    dx / length *
                    human.speed *
                    0.5 *
                    dt;

                human.y +=
                    dy / length *
                    human.speed *
                    0.5 *
                    dt;

            }

        }


        // SHOOT

        if (distance < 800) {

            humanShoot(human);

        }


        keepInsideWorld(human);

    }

}


// ============================================================
// ZOMBIE AI
// ============================================================

function updateZombieAI(dt) {

    for (const zombie of zombies) {

        if (!zombie.alive) continue;

        if (!zombie.ai) continue;


        const human =
            findNearestHuman(zombie);


        if (!human) continue;


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

            if (distance > 0) {

                zombie.x +=
                    dx / distance *
                    zombie.speed *
                    dt;

                zombie.y +=
                    dy / distance *
                    zombie.speed *
                    dt;

            }

        } else {

            zombieAttack(
                zombie,
                human
            );

        }


        keepInsideWorld(zombie);

    }

}


// ============================================================
// ZOMBIE PLAYER ATTACK
// ============================================================

function updateZombiePlayer() {

    if (currentTeam !== "zombie")
        return;


    const zombie =
        getCurrentCharacter();


    if (!zombie) return;


    const human =
        findNearestHuman(zombie);


    if (!human) return;


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

    if (!human.alive) return;


    const now =
        Date.now();


    if (
        now -
        zombie.lastAttack <
        ZOMBIE_ATTACK_COOLDOWN
    ) {

        return;

    }


    zombie.lastAttack =
        now;


    // Stronger zombies have better infection chance

    let chance = 0.4;


    if (
        zombie.zombieType ===
        "fast"
    ) {

        chance = 0.55;

    }


    if (
        zombie.zombieType ===
        "tank"
    ) {

        chance = 0.7;

    }


    if (
        Math.random() <
        chance
    ) {

        becomeZombie(human);

    } else {

        human.health -= 25;


        createBloodEffect(
            human.x,
            human.y,
            "#ff3333"
        );


        if (
            human.health <= 0
        ) {

            becomeZombie(human);

        }

    }

}


// ============================================================
// PLAYER SHOOTING
// ============================================================

function updatePlayerShooting() {

    if (
        currentTeam !==
        "human"
    ) return;


    if (!mouse.down)
        return;


    const player =
        getCurrentCharacter();


    if (!player) return;


    humanShoot(player);

}


// ============================================================
// HUMAN SHOOT
// ============================================================

function humanShoot(human) {

    const now =
        Date.now();


    if (
        now -
        human.lastAttack <
        human.fireRate
    ) {

        return;

    }


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

    for (const bullet of bullets) {

        bullet.x +=
            bullet.vx *
            dt;

        bullet.y +=
            bullet.vy *
            dt;

        bullet.life -=
            dt;


        for (const zombie of zombies) {

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
            b =>
                b.life > 0
        );

}


// ============================================================
// KILL ZOMBIE
// ============================================================

function killZombie(zombie) {

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

        const remaining =
            getAvailableCharacters();


        if (
            remaining.length > 0
        ) {

            currentCharacterId =
                remaining[0].id;

            remaining[0].ai =
                false;

        }

    }

}


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

    const player =
        getCurrentCharacter();


    if (!player) return;


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


// ============================================================
// WORLD / SCREEN
// ============================================================

function screenToWorld(x, y) {

    return {

        x:
            x +
            camera.x,

        y:
            y +
            camera.y

    };

}


function worldToScreen(x, y) {

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


    const grid =
        100;


    ctx.strokeStyle =
        "#263226";


    ctx.lineWidth = 1;


    const offsetX =
        -(camera.x % grid);


    const offsetY =
        -(camera.y % grid);


    for (
        let x = offsetX;
        x < canvas.width;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            canvas.height
        );

        ctx.stroke();

    }


    for (
        let y = offsetY;
        y < canvas.height;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            canvas.width,
            y
        );

        ctx.stroke();

    }

}


// ============================================================
// DRAW HUMAN
// ============================================================

function drawHuman(human) {

    const p =
        worldToScreen(
            human.x,
            human.y
        );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";


    ctx.beginPath();

    ctx.ellipse(
        p.x,
        p.y + 14,
        20,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        human.id ===
        currentCharacterId &&
        currentTeam ===
        "human"
            ? "#49d9ff"
            : "#eeeeee";


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        human.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Selection ring

    if (
        human.id ===
        currentCharacterId &&
        currentTeam ===
        "human"
    ) {

        ctx.strokeStyle =
            "#39d9ff";

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            human.radius + 9,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    drawHealthBar(
        p.x,
        p.y - 30,
        human
    );


    drawName(
        p.x,
        p.y - 40,
        human.name
    );

}


// ============================================================
// DRAW ZOMBIE
// ============================================================

function drawZombie(zombie) {

    const p =
        worldToScreen(
            zombie.x,
            zombie.y
        );


    let color =
        "#6ce56a";


    if (
        zombie.zombieType ===
        "fast"
    ) {

        color =
            "#e5d65a";

    }


    if (
        zombie.zombieType ===
        "tank"
    ) {

        color =
            "#a56be5";

    }


    if (
        zombie.id ===
        currentCharacterId &&
        currentTeam ===
        "zombie"
    ) {

        color =
            "#ff5555";

    }


    ctx.fillStyle =
        color;


    ctx.beginPath();

    ctx.arc(
        p.x,
        p.y,
        zombie.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Eyes

    ctx.fillStyle =
        "#ff2020";


    ctx.beginPath();

    ctx.arc(
        p.x - 6,
        p.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        p.x + 6,
        p.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Selection

    if (
        zombie.id ===
        currentCharacterId &&
        currentTeam ===
        "zombie"
    ) {

        ctx.strokeStyle =
            "#ff3333";

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
        p.y - 35,
        zombie
    );


    drawName(
        p.x,
        p.y - 45,
        zombie.name
    );

}


// ============================================================
// DRAW NAME
// ============================================================

function drawName(
    x,
    y,
    name
) {

    ctx.font =
        "12px Arial";

    ctx.textAlign =
        "center";

    ctx.fillStyle =
        "rgba(255,255,255,0.85)";


    ctx.fillText(
        name,
        x,
        y
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

    const width = 45;

    const height = 5;


    const ratio =
        Math.max(
            0,
            character.health /
            character.maxHealth
        );


    ctx.fillStyle =
        "rgba(0,0,0,0.7)";


    ctx.fillRect(
        x - width / 2,
        y,
        width,
        height
    );


    ctx.fillStyle =
        ratio > 0.5
            ? "#5ee56a"
            : "#ff4141";


    ctx.fillRect(
        x - width / 2,
        y,
        width * ratio,
        height
    );

}


// ============================================================
// DRAW BULLETS
// ============================================================

function drawBullets() {

    ctx.fillStyle =
        "#ffd84a";


    for (const bullet of bullets) {

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

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            life: 0.5,

            color: color

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

            x: x,

            y: y,

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


function updateParticles(dt) {

    for (const particle of particles) {

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
            p =>
                p.life > 0
        );

}


function drawParticles() {

    for (const particle of particles) {

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
// FIND NEAREST HUMAN
// ============================================================

function findNearestHuman(character) {

    let nearest = null;

    let closest =
        Infinity;


    for (const human of humans) {

        if (!human.alive)
            continue;


        if (human.infected)
            continue;


        const d =
            distanceBetween(
                character,
                human
            );


        if (
            d <
            closest
        ) {

            closest = d;

            nearest = human;

        }

    }


    return nearest;

}


// ============================================================
// FIND NEAREST ZOMBIE
// ============================================================

function findNearestZombie(character) {

    let nearest = null;

    let closest =
        Infinity;


    for (const zombie of zombies) {

        if (!zombie.alive)
            continue;


        const d =
            distanceBetween(
                character,
                zombie
            );


        if (
            d <
            closest
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

function distanceBetween(a, b) {

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
// WORLD BOUNDARY
// ============================================================

function keepInsideWorld(character) {

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
// GAME STATE
// ============================================================

function checkGameState() {

    const livingHumans =
        humans.filter(
            h =>
                h.alive &&
                !h.infected
        );


    const livingZombies =
        zombies.filter(
            z =>
                z.alive
        );


    // ZOMBIES WIN

    if (
        livingHumans.length === 0
    ) {

        endGame(
            "🧟 ZOMBIES WIN!"
        );

        return;

    }


    // HUMANS WIN

    if (
        livingZombies.length === 0
    ) {

        endGame(
            "🧑 HUMANS WIN!"
        );

        return;

    }


    // Player died

    if (
        !getCurrentCharacter()
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
// END GAME
// ============================================================

function endGame(message) {

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


    if (result) {

        result.textContent =
            message;

    }


    if (messageBox) {

        messageBox.style.display =
            "flex";

    }

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


    if (mode) {

        mode.textContent =
            currentTeam.toUpperCase();

    }


    if (character) {

        character.textContent =
            player
                ? player.name
                : "-";

    }


    if (health) {

        health.textContent =
            player
                ? Math.max(
                    0,
                    Math.floor(
                        player.health
                    )
                )
                : 0;

    }


    if (humanCount) {

        humanCount.textContent =
            humans.filter(
                h =>
                    h.alive &&
                    !h.infected
            ).length;

    }


    if (zombieCount) {

        zombieCount.textContent =
            zombies.filter(
                z =>
                    z.alive
            ).length;

    }

}


// ============================================================
// GAME LOOP
// ============================================================

let previousTime =
    performance.now();


function gameLoop(time) {

    const dt =
        Math.min(
            (time -
                previousTime) /
            1000,
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
// DRAW ALL CHARACTERS
// ============================================================

function drawCharacters() {

    for (const human of humans) {

        if (!human.alive)
            continue;

        if (human.infected)
            continue;

        drawHuman(human);

    }


    for (const zombie of zombies) {

        if (!zombie.alive)
            continue;

        drawZombie(zombie);

    }

}


// ============================================================
// START
// ============================================================

requestAnimationFrame(
    gameLoop
);
