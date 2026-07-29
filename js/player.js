export class Player {

    constructor(camera) {

        this.camera = camera;

        this.position = {
            x: 0,
            y: 2,
            z: 15
        };

        this.yaw = 0;
        this.pitch = 0;

        this.speed = 0.12;
        this.sprintSpeed = 0.22;

        this.keys = {};

        this.pointerLocked = false;

        this.setupControls();
    }

    setupControls() {

        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.body.addEventListener("click", () => {
            document.body.requestPointerLock();
        });

        document.addEventListener("pointerlockchange", () => {
            this.pointerLocked =
                document.pointerLockElement === document.body;
        });

        document.addEventListener("mousemove", e => {

            if (!this.pointerLocked) return;

            this.yaw -= e.movementX * 0.002;
            this.pitch -= e.movementY * 0.002;

            const limit = Math.PI / 2 - 0.05;

            if (this.pitch > limit) this.pitch = limit;
            if (this.pitch < -limit) this.pitch = -limit;

        });

    }

    update() {

        const speed =
            this.keys["shift"]
                ? this.sprintSpeed
                : this.speed;

        const forwardX = Math.sin(this.yaw);
        const forwardZ = Math.cos(this.yaw);

        const rightX = Math.cos(this.yaw);
        const rightZ = -Math.sin(this.yaw);

        if (this.keys["w"]) {
            this.position.x -= forwardX * speed;
            this.position.z -= forwardZ * speed;
        }

        if (this.keys["s"]) {
            this.position.x += forwardX * speed;
            this.position.z += forwardZ * speed;
        }

        if (this.keys["a"]) {
            this.position.x -= rightX * speed;
            this.position.z -= rightZ * speed;
        }

        if (this.keys["d"]) {
            this.position.x += rightX * speed;
            this.position.z += rightZ * speed;
        }

        this.camera.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.camera.rotation.order = "YXZ";
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;

    }

}
