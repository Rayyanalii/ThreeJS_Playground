import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createStars from "./../utils/createStars";

//Renderer
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 10;

//Scene
const scene = new THREE.Scene();

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Objects
const loader = new THREE.TextureLoader();

const solarGroup = new THREE.Group();
scene.add(solarGroup);

const sunGeo = new THREE.IcosahedronGeometry(2, 16);
const sunMat = new THREE.MeshBasicMaterial({
  emissiveIntensity: 3,
  map: loader.load("/assets/textures/sunMap.jpg"),
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
solarGroup.add(sunMesh);

const earthGeo = new THREE.IcosahedronGeometry(1, 16);
const earthMat = new THREE.MeshStandardMaterial({
  map: loader.load("/assets/textures/earthStandardMap.jpg"),
});
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
const earthOrbit = new THREE.Group();
solarGroup.add(earthOrbit);
earthMesh.position.setX(16);
earthOrbit.add(earthMesh);

const moonGeo = new THREE.IcosahedronGeometry(0.4, 16);
const moonMat = new THREE.MeshStandardMaterial({
  map: loader.load("/assets/textures/moonmap.jpg"),
});
const moonMesh = new THREE.Mesh(moonGeo, moonMat);
const moonOrbit = new THREE.Group();
earthMesh.add(moonOrbit);
moonMesh.position.setX(4);
moonOrbit.add(moonMesh);

earthMesh.castShadow = true;
earthMesh.receiveShadow = true;

moonMesh.castShadow = true;
moonMesh.receiveShadow = true;

const stars = createStars();
scene.add(stars);

//Lighting
const sunLight = new THREE.PointLight(0xffffff, 1000);
sunLight.position.copy(sunMesh.position);
sunLight.castShadow = true;
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambientLight);

//Animate
function animate(t = 0) {
  requestAnimationFrame(animate);
  sunLight.position.copy(sunMesh.getWorldPosition(new THREE.Vector3()));

  earthOrbit.rotation.y += 0.001;
  moonOrbit.rotation.y += 0.0001;
  earthMesh.rotation.y += 0.005;
  renderer.render(scene, camera);
  controls.update();
}

animate();
