// ============================================================
// INFECTION
// Zombie Survival / Character Switching Game
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
// GAME SETTINGS
// ============================================================

const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2000;

const HUMAN_SPEED = 260;
const ZOMBIE_SPEED = 180;

const BULLET_SPEED = 900;
const BULLET_DAMAGE = 40;

const ZOMBIE_ATTACK_DISTANCE = 48;
const ZOMBIE_ATTACK_COOLDOWN = 700;

const HUMAN_ATTACK_COOLDOWN = 250;


// ============================================================
// GAME STATE
// ============================================================

let gameOver = false;

let gameStarted = true;

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
// CHARACTERS
// ============================================================

const humans = [];

const zombies = [];


// ============================================================
// HUMAN CREATION
// ============================================================

function createHuman(x, y, name) {

    const human = {

        id: nextCharacterId++,

        type: "human",

        name: name,

        x: x,

        y: y,

        radius: 18,

        health: 100,

        maxHealth: 100,

        alive: true,

        infected: false,

        speed: HUMAN_SPEED,

        lastAttack: 0,

        color: "#e9f4ff",

        ai: true

    };

    humans.push(human);

    return human;
}


// ============================================================
// ZOMBIE CREATION
// ============================================================

function createZombie(x, y, name = "Zombie") {

    const zombie = {

        id: nextCharacterId++,

        type: "zombie",

        name: name,

        x: x,

        y: y,

        radius: 20,

        health: 100,

        maxHealth: 100,

        alive: true,

        speed: ZOMBIE_SPEED,

        lastAttack: 0,

        color: "#70e56a",

        ai: true

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

    // Survivors

    createHuman(500, 500, "Alex");
    createHuman(650, 550, "Mia");
    createHuman(550, 700, "Jack");
    createHuman(750, 700, "Sam");
    createHuman(850, 550, "Liam");
    createHuman(700, 850, "Emma");

    // Starting zombies

    createZombie(2200, 1300, "Zombie 1");
    createZombie(2400, 1400, "Zombie 2");

    // Player starts as first human

    currentTeam = "human";

    currentCharacterId = humans[0].id;

    humans[0].ai = false;

}

createInitialGame();


// ============================================================
// INPUT
// ============================================================

window.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    // TAB = CHARACTER SWITCH

    if (event.key === "Tab") {

        event.preventDefault();

        switchCharacter();

    }

    // R = RESTART

    if (key === "r" && gameOver) {

        location.reload();

    }

});


window.addEventListener("keyup", (event) => {

    keys[event.key.toLowerCase()] = false;

});


canvas.addEventListener("mousemove", (event) => {

    mouse.x = event.clientX;
    mouse.y = event.clientY;

});


canvas.addEventListener("mousedown", (event) => {

    if (event.button === 0) {

        mouse.down = true;

    }

});


canvas.addEventListener("mouseup", (event) => {

    if (event.button === 0) {

        mouse.down = false;

    }

});


canvas.addEventListener("contextmenu", (event) => {

    event.preventDefault();

});


// ============================================================
// GET CURRENT CHARACTER
// ============================================================

function getCurrentCharacter() {

    if (currentTeam === "human") {

        return humans.find(
            human =>
                human.id === currentCharacterId &&
                human.alive &&
                !human.infected
        );

    }

    return zombies.find(
        zombie =>
            zombie.id === currentCharacterId &&
            zombie.alive
    );

}


// ============================================================
// GET AVAILABLE CHARACTERS
// ============================================================

function getAvailableCharacters() {

    if (currentTeam === "human") {

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
// CHARACTER SWITCHING
// ============================================================

function switchCharacter() {

    if (gameOver) return;

    const available = getAvailableCharacters();

    if (available.length <= 1) return;

    let currentIndex =
        available.findIndex(
            character =>
                character.id === currentCharacterId
        );

    if (currentIndex === -1) {

        currentIndex = 0;

    } else {

        currentIndex++;

        if (currentIndex >= available.length) {

            currentIndex = 0;

        }

    }

    // Current character becomes AI

    const oldCharacter = getCurrentCharacter();

    if (oldCharacter) {

        oldCharacter.ai = true;

    }

    // New character becomes player-controlled

    const newCharacter = available[currentIndex];

    currentCharacterId = newCharacter.id;

    newCharacter.ai = false;

}


// ============================================================
// SWITCH TO ZOMBIE TEAM
// ============================================================

function becomeZombie(human) {

    if (!human || !human.alive) return;

    human.alive = false;

    human.infected = true;

    // Create zombie from human

    const zombie = createZombie(
        human.x,
        human.y,
        human.name + " - Infected"
    );

    // If this is the player character,
    // the player switches to zombie side.

    if (human.id === currentCharacterId) {

        currentTeam = "zombie";

        currentCharacterId = zombie.id;

        zombie.ai = false;

        showInfectionMessage();

    }

    createBloodEffect(
        human.x,
        human.y,
        "#7cff70"
    );

}


// ============================================================
// INFECTION MESSAGE
// ============================================================

function showInfectionMessage() {

    let warning =
        document.getElementById("infectionWarning");

    if (!warning) {

        warning = document.createElement("div");

        warning.id = "infectionWarning";

        warning.textContent =
            "YOU ARE INFECTED";

        document.body.appendChild(warning);

    }

    warning.style.display = "block";

    setTimeout(() => {

        warning.style.display = "none";

    }, 1800);

}


// ============================================================
// MOVEMENT
// ============================================================

function updatePlayer(deltaTime) {

    const player = getCurrentCharacter();

    if (!player) return;

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) {

        dy -= 1;

    }

    if (keys["s"] || keys["arrowdown"]) {

        dy += 1;

    }

    if (keys["a"] || keys["arrowleft"]) {

        dx -= 1;

    }

    if (keys["d"] || keys["arrowright"]) {

        dx += 1;

    }

    // Normalize diagonal movement

    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(dx * dx + dy * dy);

        dx /= length;
        dy /= length;

    }

    player.x +=
        dx * player.speed * deltaTime;

    player.y +=
        dy * player.speed * deltaTime;

    keepInsideWorld(player);

}


// ============================================================
// AI HUMAN MOVEMENT
// ============================================================

function updateHumanAI(deltaTime) {

    for (const human of humans) {

        if (!human.alive) continue;

        if (human.infected) continue;

        if (!human.ai) continue;

        const nearestZombie =
            findNearestZombie(human);

        if (!nearestZombie) continue;

        const distance =
            distanceBetween(human, nearestZombie);

        // Run away if zombie is close

        if (distance < 450) {

            const dx =
                human.x - nearestZombie.x;

            const dy =
                human.y - nearestZombie.y;

            const length =
                Math.sqrt(dx * dx + dy * dy);

            if (length > 0) {

                human.x +=
                    (dx / length) *
                    human.speed *
                    0.45 *
                    deltaTime;

                human.y +=
                    (dy / length) *
                    human.speed *
                    0.45 *
                    deltaTime;

            }

        }

        // Shoot zombie

        if (distance < 700) {

            humanShoot(human);

        }

        keepInsideWorld(human);

    }

}


// ============================================================
// AI ZOMBIE MOVEMENT
// ============================================================

function updateZombieAI(deltaTime) {

    for (const zombie of zombies) {

        if (!zombie.alive) continue;

        if (!zombie.ai) continue;

        const target =
            findNearestHuman(zombie);

        if (!target) continue;

        const dx =
            target.x - zombie.x;

        const dy =
            target.y - zombie.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance > ZOMBIE_ATTACK_DISTANCE) {

            if (distance > 0) {

                zombie.x +=
                    (dx / distance) *
                    zombie.speed *
                    deltaTime;

                zombie.y +=
                    (dy / distance) *
                    zombie.speed *
                    deltaTime;

            }

        } else {

            zombieAttack(zombie, target);

        }

        keepInsideWorld(zombie);

    }

}


// ============================================================
// PLAYER ZOMBIE ATTACK
// ============================================================

function updateZombiePlayer() {

    if (currentTeam !== "zombie") return;

    const zombie = getCurrentCharacter();

    if (!zombie) return;

    const target =
        findNearestHuman(zombie);

    if (!target) return;

    const distance =
        distanceBetween(zombie, target);

    if (distance <= ZOMBIE_ATTACK_DISTANCE) {

        if (Date.now() - zombie.lastAttack >
            ZOMBIE_ATTACK_COOLDOWN) {

            zombieAttack(zombie, target);

        }

    }

}


// ============================================================
// ZOMBIE ATTACK
// ============================================================

function zombieAttack(zombie, human) {

    if (!human.alive) return;

    const now = Date.now();

    if (
        now - zombie.lastAttack <
        ZOMBIE_ATTACK_COOLDOWN
    ) {

        return;

    }

    zombie.lastAttack = now;

    // Chance of infection

    const infectionChance = 0.45;

    if (Math.random() < infectionChance) {

        becomeZombie(human);

    } else {

        human.health -= 25;

        createBloodEffect(
            human.x,
            human.y,
            "#ff4444"
        );

        if (human.health <= 0) {

            becomeZombie(human);

        }

    }

}


// ============================================================
// HUMAN SHOOTING
// ============================================================

function updatePlayerShooting() {

    if (currentTeam !== "human") return;

    const player = getCurrentCharacter();

    if (!player) return;

    if (!mouse.down) return;

    humanShoot(player);

}


function humanShoot(human) {

    const now = Date.now();

    if (
        now - human.lastAttack <
        HUMAN_ATTACK_COOLDOWN
    ) {

        return;

    }

    human.lastAttack = now;

    const worldMouse =
        screenToWorld(
            mouse.x,
            mouse.y
        );

    const angle =
        Math.atan2(
            worldMouse.y - human.y,
            worldMouse.x - human.x
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

        damage: BULLET_DAMAGE,

        life: 1.5

    });

}


// ============================================================
// BULLET UPDATE
// ============================================================

function updateBullets(deltaTime) {

    for (const bullet of bullets) {

        bullet.x +=
            bullet.vx * deltaTime;

        bullet.y +=
            bullet.vy * deltaTime;

        bullet.life -= deltaTime;

        // Check zombies

        for (const zombie of zombies) {

            if (!zombie.alive) continue;

            const distance =
                distanceBetween(
                    bullet,
                    zombie
                );

            if (distance < zombie.radius) {

                zombie.health -= bullet.damage;

                bullet.life = 0;

                createBloodEffect(
                    zombie.x,
                    zombie.y,
                    "#ff3333"
                );

                if (zombie.health <= 0) {

                    killZombie(zombie);

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


// ============================================================
// KILL ZOMBIE
// ============================================================

function killZombie(zombie) {

    zombie.alive = false;

    createBloodEffect(
        zombie.x,
        zombie.y,
        "#7cff70"
    );

    // If player-controlled zombie dies,
    // automatically switch to another zombie.

    if (
        zombie.id === currentCharacterId &&
        currentTeam === "zombie"
    ) {

        const remaining =
            getAvailableCharacters();

        if (remaining.length > 0) {

            currentCharacterId =
                remaining[0].id;

            remaining[0].ai = false;

        }

    }

}


// ============================================================
// CAMERA
// ============================================================

function updateCamera() {

    const player = getCurrentCharacter();

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
                WORLD_WIDTH - canvas.width,
                camera.x
            )
        );

    camera.y =
        Math.max(
            0,
            Math.min(
                WORLD_HEIGHT - canvas.height,
                camera.y
            )
        );

}


// ============================================================
// SCREEN → WORLD
// ============================================================

function screenToWorld(x, y) {

    return {

        x: x + camera.x,

        y: y + camera.y

    };

}


// ============================================================
// WORLD → SCREEN
// ============================================================

function worldToScreen(x, y) {

    return {

        x: x - camera.x,

        y: y - camera.y

    };

}


// ============================================================
// DRAW WORLD
// ============================================================

function drawWorld() {

    ctx.fillStyle = "#1d251d";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Grid

    const gridSize = 100;

    ctx.strokeStyle = "#293329";

    ctx.lineWidth = 1;

    const startX =
        -(camera.x % gridSize);

    const startY =
        -(camera.y % gridSize);


    for (
        let x = startX;
        x < canvas.width;
        x += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);

        ctx.stroke();

    }


    for (
        let y = startY;
        y < canvas.height;
        y += gridSize
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);

        ctx.stroke();

    }


    // World border

    const topLeft =
        worldToScreen(0, 0);

    ctx.strokeStyle = "#4b594b";

    ctx.lineWidth = 5;

    ctx.strokeRect(
        topLeft.x,
        topLeft.y,
        WORLD_WIDTH,
        WORLD_HEIGHT
    );

}


// ============================================================
// DRAW CHARACTERS
// ============================================================

function drawCharacters() {

    for (const human of humans) {

        if (!human.alive) continue;

        if (human.infected) continue;

        drawHuman(human);

    }


    for (const zombie of zombies) {

        if (!zombie.alive) continue;

        drawZombie(zombie);

    }

}


// ============================================================
// DRAW HUMAN
// ============================================================

function drawHuman(human) {

    const position =
        worldToScreen(
            human.x,
            human.y
        );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.beginPath();

    ctx.ellipse(
        position.x,
        position.y + 14,
        18,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    ctx.fillStyle =
        human.color;

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        human.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Selection ring

    if (
        human.id === currentCharacterId &&
        currentTeam === "human"
    ) {

        ctx.strokeStyle = "#38d9ff";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
            human.radius + 9,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    drawHealthBar(
        position.x,
        position.y - 30,
        human
    );

}


// ============================================================
// DRAW ZOMBIE
// ============================================================

function drawZombie(zombie) {

    const position =
        worldToScreen(
            zombie.x,
            zombie.y
        );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.4)";

    ctx.beginPath();

    ctx.ellipse(
        position.x,
        position.y + 15,
        20,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Zombie body

    ctx.fillStyle =
        zombie.color;

    ctx.beginPath();

    ctx.arc(
        position.x,
        position.y,
        zombie.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Eyes

    ctx.fillStyle = "#ff3030";

    ctx.beginPath();

    ctx.arc(
        position.x - 6,
        position.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        position.x + 6,
        position.y - 3,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Selection ring

    if (
        zombie.id === currentCharacterId &&
        currentTeam === "zombie"
    ) {

        ctx.strokeStyle = "#ff3333";

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
            zombie.radius + 10,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    drawHealthBar(
        position.x,
        position.y - 33,
        zombie
    );

}


// ============================================================
// HEALTH BAR
// ============================================================

function drawHealthBar(x, y, character) {

    const width = 40;

    const height = 5;

    const healthRatio =
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
        healthRatio > 0.5
            ? "#65e765"
            : "#ff4444";

    ctx.fillRect(
        x - width / 2,
        y,
        width * healthRatio,
        height
    );

}


// ============================================================
// DRAW BULLETS
// ============================================================

function drawBullets() {

    ctx.fillStyle = "#ffd84a";

    for (const bullet of bullets) {

        const position =
            worldToScreen(
                bullet.x,
                bullet.y
            );

        ctx.beginPath();

        ctx.arc(
            position.x,
            position.y,
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

function createBloodEffect(x, y, color) {

    for (let i = 0; i < 8; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            30 +
            Math.random() * 100;

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


function updateParticles(deltaTime) {

    for (const particle of particles) {

        particle.x +=
            particle.vx *
            deltaTime;

        particle.y +=
            particle.vy *
            deltaTime;

        particle.life -=
            deltaTime;

    }

    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );

}


function drawParticles() {

    for (const particle of particles) {

        const position =
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
            position.x,
            position.y,
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

    let bestDistance = Infinity;


    for (const human of humans) {

        if (!human.alive) continue;

        if (human.infected) continue;

        const distance =
            distanceBetween(
                character,
                human
            );

        if (distance < bestDistance) {

            bestDistance = distance;

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

    let bestDistance = Infinity;


    for (const zombie of zombies) {

        if (!zombie.alive) continue;

        const distance =
            distanceBetween(
                character,
                zombie
            );

        if (distance < bestDistance) {

            bestDistance = distance;

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
        a.x - b.x;

    const dy =
        a.y - b.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


// ============================================================
// KEEP CHARACTER INSIDE WORLD
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
// WIN / LOSE
// ============================================================

function checkGameState() {

    const livingHumans =
        humans.filter(
            human =>
                human.alive &&
                !human.infected
        );

    const livingZombies =
        zombies.filter(
            zombie =>
                zombie.alive
        );


    // No humans left

    if (livingHumans.length === 0) {

        endGame(
            "🧟 ZOMBIES WIN!"
        );

        return;

    }


    // No zombies left

    if (livingZombies.length === 0) {

        endGame(
            "🧑 HUMANS WIN!"
        );

        return;

    }


    // Player-controlled character died

    if (!getCurrentCharacter()) {

        if (currentTeam === "human") {

            const availableHumans =
                livingHumans;

            if (availableHumans.length > 0) {

                currentCharacterId =
                    availableHumans[0].id;

                availableHumans[0].ai = false;

            }

        } else {

            const availableZombies =
                livingZombies;

            if (availableZombies.length > 0) {

                currentCharacterId =
                    availableZombies[0].id;

                availableZombies[0].ai = false;

            }

        }

    }

}


// ============================================================
// END GAME
// ============================================================

function endGame(message) {

    if (gameOver) return;

    gameOver = true;

    const result =
        document.getElementById("result");

    const messageBox =
        document.getElementById("message");

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
// UPDATE HUD
// ============================================================

function updateHUD() {

    const player =
        getCurrentCharacter();


    const mode =
        document.getElementById("mode");

    const character =
        document.getElementById("character");

    const health =
        document.getElementById("health");

    const humanCount =
        document.getElementById("humans");

    const zombieCount =
        document.getElementById("zombies");


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
                human =>
                    human.alive &&
                    !human.infected
            ).length;

    }


    if (zombieCount) {

        zombieCount.textContent =
            zombies.filter(
                zombie =>
                    zombie.alive
            ).length;

    }

}


// ============================================================
// GAME LOOP
// ============================================================

let previousTime = performance.now();


function gameLoop(currentTime) {

    const deltaTime =
        Math.min(
            (currentTime - previousTime) / 1000,
            0.05
        );

    previousTime =
        currentTime;


    if (!gameOver) {

        // PLAYER

        updatePlayer(deltaTime);


        // AI

        updateHumanAI(deltaTime);

        updateZombieAI(deltaTime);


        // ATTACKS

        updatePlayerShooting();

        updateZombiePlayer();


        // BULLETS

        updateBullets(deltaTime);


        // EFFECTS

        updateParticles(deltaTime);


        // CAMERA

        updateCamera();


        // GAME STATE

        checkGameState();


        // UI

        updateHUD();

    }


    // DRAW

    drawWorld();

    drawCharacters();

    drawBullets();

    drawParticles();


    requestAnimationFrame(gameLoop);

}


requestAnimationFrame(gameLoop);
