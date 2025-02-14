// Import OBJLoader (Ensure three/examples/jsm/loaders/OBJLoader.js is available)
//import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/loaders/OBJLoader.js';
import * as THREE from "three";
import { OBJLoader } from 'jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'jsm/loaders/MTLLoader.js';
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create tunnel
    let tunnelGeo = new THREE.CylinderGeometry(5, 5, 200, 32, 1, true);
    let tunnelMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true, side: THREE.BackSide });
    tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
    tunnel.rotation.x = Math.PI / 2;
    scene.add(tunnel);

    // Add ambient light (provides base lighting everywhere)
    const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Soft white light
    scene.add(ambientLight);

    // Create the MTLLoader
    const player_mtlLoader = new MTLLoader();
    player_mtlLoader.load('./Assets/Models/Spaceship2.mtl', function (materials) {
        materials.preload(); // Preload materials

        // Now load the OBJ file using OBJLoader
        const _playeObjLoader = new OBJLoader();
        _playeObjLoader.setMaterials(materials); // Apply materials to the object
        _playeObjLoader.load('./Assets/Models/Spaceship2.obj', function (object) {
            player = object;
            player.scale.set(0.5, 0.5, 0.5);
            player.position.z = 10;
            player.rotation.y = Math.PI;

            player.position.x = 0;
            player.position.y = -3;
            // Create a PointLight for the player
            const pointLight = new THREE.PointLight(0xff0000, 200, 100); // color, intensity, distance
            pointLight.position.set(player.position.x, player.position.y - 2, player.position.z+2); // Position it slightly above the player
            const pointLight2 = new THREE.PointLight(0xffff00, 200, 100); // color, intensity, distance
            pointLight.position.set(player.position.x-2, player.position.y , player.position.z+2); // Position it slightly above the player
            const pointLight3 = new THREE.PointLight(0xffff00, 200, 100); // color, intensity, distance
            pointLight.position.set(player.position.x+2, player.position.y, player.position.z+2); // Position it slightly above the player

            // Add the point light to the scene
            scene.add(pointLight);
            scene.add(pointLight2);
            scene.add(pointLight3);

            // Add the player to the scene
            scene.add(player);
        });
    });

    
    camera.position.z = 15;

    high_score = loadHighScore();
    document.getElementById("score").innerText = "High Score: " + high_score +"\nScore: " + score;

    //createFlameTrail();
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Move tunnel backward
    tunnel.position.z += difficulty[current_difficulty].speed;;
    if (tunnel.position.z > 5) tunnel.position.z = -25;

    // Move obstacles
    obstacles.forEach((obs, i) => {
        obs.position.z += difficulty[current_difficulty].speed;
        // Collision detection
        if (checkCollision(player, obs)) {
            console.log("Collision detected! Game Over.");
            if(score>high_score) high_score = score, saveHighScore(high_score);
            //alert("Game Over! Score: " + score);
            
            window.location.reload(); // Restart the game
        }

        // Remove obstacles that move out of bounds
        if (obs.position.z > 15) {
            scene.remove(obs);
            obstacles.splice(i, 1);
            score++;
            document.getElementById("score").innerText = "High Score: " + high_score +"\nScore: " + score;
        }
    });

    // Spawn obstacles
    if (Math.random() < difficulty[current_difficulty].obstacle_spawn_probability) spawnObstacle();

    renderer.render(scene, camera);
    //updateStars();
    //updateFlameTrail();
    

}


function checkCollision(obj1, obj2) {
    let box1 = new THREE.Box3().setFromObject(obj1);
    let box2 = new THREE.Box3().setFromObject(obj2);
    return box1.intersectsBox(box2);
}


function spawnObstacle() {
    let obsGeo = new THREE.BoxGeometry(1, 1, 1);
    let obsMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    let obs = new THREE.Mesh(obsGeo, obsMat);
    obs.position.set(Math.random() * 6 - 3, Math.random() * 4 - 2, -15);
    scene.add(obs);
    obstacles.push(obs);
}

init();




// var flameTrail;

// // Create a particle system for the flame trail
// function createFlameTrail() {
//     const flameGeometry = new THREE.BufferGeometry();
//     const particleCount = 100;  // Number of particles in the flame trail
//     const positions = new Float32Array(particleCount * 3);
//     const velocities = new Float32Array(particleCount * 3); // For movement of particles

//     // Set initial positions and velocities for particles
//     for (let i = 0; i < particleCount; i++) {
//         positions[i * 3] = 0;  // X
//         positions[i * 3 + 1] = 0;  // Y
//         positions[i * 3 + 2] = 0;  // Z
//         velocities[i * 3] = Math.random() * 0.2 - 0.1;  // Random velocity in X
//         velocities[i * 3 + 1] = Math.random() * 0.5 + 0.5;  // Y
//         velocities[i * 3 + 2] = Math.random() * 0.2 - 0.1;  // Z
//     }

//     flameGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

//     // Material for the flame (using ShaderMaterial for more control)
//     const flameMaterial = new THREE.ShaderMaterial({
//         vertexShader: `
//             varying vec3 vColor;
//             attribute vec3 velocity;
//             void main() {
//                 vColor = vec3(1.0, 0.5, 0.0);  // Flame color (orange)
//                 vec3 pos = position + velocity;
//                 gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//             }
//         `,
//         fragmentShader: `
//             varying vec3 vColor;
//             void main() {
//                 gl_FragColor = vec4(vColor, 1.0); // Use color from vertex shader
//             }
//         `,
//         transparent: true,
//         blending: THREE.AdditiveBlending,  // To create a glowing effect
//         depthWrite: false,  // Disable depth write for additive blending
//     });

//     // Create particle system (Points)
//     flameTrail = new THREE.Points(flameGeometry, flameMaterial);
//     //flameTrail.position.set(player.position.x, player.position.y - 2, player.position.z+2);  // Attach the flame trail to the rocket
//     scene.add(flameTrail);
// }
// // Function to update the flame positions based on the rocket movement
// function updateFlameTrail() {
//     const positions = flameTrail.geometry.attributes.position.array;
//     const velocities = new Float32Array(positions.length / 3);

//     // Update positions of particles
//     for (let i = 0; i < positions.length / 3; i++) {
//         const index = i * 3;
        
//         // Move particles in the direction of the rocket
//         positions[index] += velocities[index] * 0.1;
//         positions[index + 1] += velocities[index + 1] * 0.1;
//         positions[index + 2] += velocities[index + 2] * 0.1;
//     }

//     flameTrail.geometry.attributes.position.needsUpdate = true;  // Flag the geometry as needing an update
// }





