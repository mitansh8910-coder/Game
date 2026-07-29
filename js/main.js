import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.176.0/build/three.module.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

camera.position.set(0,8,15);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);

document.getElementById("game").appendChild(renderer.domElement);

// Lights
const light=new THREE.DirectionalLight(0xffffff,2);
light.position.set(10,20,10);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff,0.6));

// Ground
const ground=new THREE.Mesh(
    new THREE.PlaneGeometry(200,200),
    new THREE.MeshStandardMaterial({
        color:0x3d8f3d
    })
);

ground.rotation.x=-Math.PI/2;
scene.add(ground);

// Cube (test object)
const cube=new THREE.Mesh(
    new THREE.BoxGeometry(2,2,2),
    new THREE.MeshStandardMaterial({
        color:0xff4444
    })
);

cube.position.y=1;

scene.add(cube);

// Resize
window.addEventListener("resize",()=>{

    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// Animation
function animate(){

    requestAnimationFrame(animate);

    cube.rotation.y+=0.01;

    renderer.render(scene,camera);

}

animate();
