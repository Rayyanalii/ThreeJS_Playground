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
camera.position.set(0, 10, 50);

//Scene
const scene = new THREE.Scene();

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Lighting
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
scene.add(hemiLight);

//Objects
const loader = new THREE.TextureLoader();

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const planeGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const groundMesh = new THREE.Mesh(planeGeo, groundMat);
scene.add(groundMesh);

const boxGeo = new THREE.BoxGeometry(4, 4, 4);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ffdd,
  wireframe: true,
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(5);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);

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

const boxBody = new CANNON.Body({
  shape: new CANNON.Box(
    new CANNON.Vec3(
      boxGeo.parameters.width / 2,
      boxGeo.parameters.height / 2,
      boxGeo.parameters.depth / 2
    )
  ),
  mass: 1,
  position: new CANNON.Vec3(1, 40, 0),
});
world.addBody(boxBody);
boxBody.linearDamping = 0.31;

const sphereBody = new CANNON.Body({
  shape: new CANNON.Sphere(sphereGeo.parameters.radius),
  mass: 10,
  position: new CANNON.Vec3(0, 15, 0),
});
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31;

const timeStep = 1 / 60;

//Animate
function animate(t = 0) {
  requestAnimationFrame(animate);
  world.step(timeStep);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);

  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);

  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion);

  renderer.render(scene, camera);
  controls.update();
}

animate();
