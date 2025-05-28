import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import createStars from "../utils/createStars.js";

//Renderer
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.z = 3;

//Scene
const scene = new THREE.Scene();

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Lighting
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
// scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

//Objects
const loader = new THREE.TextureLoader();

const earthGroup = new THREE.Group();
earthGroup.rotateZ((-23.4 * Math.PI) / 180);
scene.add(earthGroup);

const sphereGeo = new THREE.IcosahedronGeometry(1, 12);
const sphereMat = new THREE.MeshStandardMaterial({
  map: loader.load("/assets/textures/earthStandardMap.jpg"),
});
const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
earthGroup.add(earthMesh);

const stars = createStars();
scene.add(stars);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("/assets/textures/earthStandardNightLights.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(sphereGeo, lightsMat);
earthGroup.add(lightsMesh);

function animate(t = 0) {
  requestAnimationFrame(animate);
  earthMesh.rotation.y += 0.001;
  lightsMesh.rotation.y += 0.001;
  renderer.render(scene, camera);
  controls.update();
}

animate();
