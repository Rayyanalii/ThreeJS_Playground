import * as THREE from "three";
import gsap from "gsap";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 40);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;

const terrainChunks = [];
const chunkSize = 100;
let lastChunkZ = 0;

function generateTerrainChunk(zOffset) {
  const geometry = new THREE.PlaneGeometry(500, 500, 200, 200);
  geometry.rotateX(-Math.PI / 2);

  for (let i = 0; i < geometry.attributes.position.count; i++) {
    const y = Math.random() * 5;
    geometry.attributes.position.setY(i, y);
  }
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: 0x88cc88,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.position.z = zOffset;
  scene.add(terrain);
  terrainChunks.push(terrain);
}

for (let i = 0; i < 5; i++) {
  generateTerrainChunk(i * -chunkSize); // Negative Z
}
lastChunkZ = -chunkSize * 4;

const sunGeo = new THREE.IcosahedronGeometry(15, 30);
const sunMat = new THREE.MeshStandardMaterial({
  emissive: 0xffffff,
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);

const sun = new THREE.DirectionalLight(0xffddaa, 2);

scene.background = new THREE.Color(0x87ceeb);

const sunGroup = new THREE.Group();
scene.add(sunGroup);

sun.position.set(0, 50, 0);
sunMesh.position.copy(sun.position);

sunGroup.add(sun);
sunGroup.add(sunMesh);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let yaw = 0;
let pitch = 0;

document.addEventListener("mousedown", () => (isDragging = true));
document.addEventListener("mouseup", () => (isDragging = false));

document.addEventListener("mousemove", (event) => {
  if (!isDragging) return;

  const movementX =
    event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  const movementY =
    event.movementY || event.mozMovementY || event.webkitMovementY || 0;

  yaw -= movementX * 0.002;
  pitch -= movementY * 0.002;
  pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch)); // clamp

  const lookDirection = new THREE.Vector3();
  lookDirection.x = Math.sin(yaw) * Math.cos(pitch);
  lookDirection.y = Math.sin(pitch);
  lookDirection.z = Math.cos(yaw) * Math.cos(pitch);

  camera.lookAt(camera.position.clone().add(lookDirection));
});

let sunAngle = 0;

function animate() {
  requestAnimationFrame(animate);

  camera.position.z -= 0.5;

  sunAngle += 0.005;
  const radius = 1000;
  const sunY = Math.sin(sunAngle) * radius;
  const sunZ = Math.cos(sunAngle) * radius;

  sun.position.set(
    camera.position.x,
    camera.position.y + sunY,
    camera.position.z + sunZ
  );
  sunMesh.position.copy(sun.position);
  sun.lookAt(camera.position);
  sunMesh.lookAt(camera.position);

  const t = (Math.sin(sunAngle) + 1) / 2;
  scene.background.setRGB(
    THREE.MathUtils.lerp(0.05, 0.53, t),
    THREE.MathUtils.lerp(0.05, 0.81, t),
    THREE.MathUtils.lerp(0.1, 0.92, t)
  );

  // Terrain generation
  const generationBuffer = 2 * chunkSize;
  if (camera.position.z - lastChunkZ < generationBuffer) {
    generateTerrainChunk(lastChunkZ - chunkSize);
    lastChunkZ -= chunkSize;

    if (terrainChunks.length > 10) {
      const old = terrainChunks.shift();
      scene.remove(old);
      old.geometry.dispose();
      old.material.dispose();
    }
  }

  renderer.render(scene, camera);
}

animate();
