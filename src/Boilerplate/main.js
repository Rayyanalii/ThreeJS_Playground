import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

//Renderer
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.set(0, 10, 30);

//Scene
const scene = new THREE.Scene();

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Lighting
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
// scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(dirLight);
dirLight.position.set(0, 30, 0);

// const ambient = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambient);
// ambient.position.set(0, -20, 0);

//Objects
const loader = new THREE.TextureLoader();

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const planeGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(planeGeo, groundMat);
scene.add(groundMesh);
groundMesh.receiveShadow = true;

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(
    new CANNON.Vec3(
      planeGeo.parameters.width / 2,
      planeGeo.parameters.height / 2,
      0.1
    )
  ),
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, intersectionPoint);
});

//Animate
function animate(t = 0) {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);

  renderer.render(scene, camera);
  controls.update();
}

window.addEventListener("resize", (e) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
