import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as CANNON from "cannon-es";

//Renderer
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

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
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(dirLight);
dirLight.position.set(0, 30, 0);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 20;
dirLight.shadow.camera.right = 20;
dirLight.shadow.camera.bottom = -20;
dirLight.shadow.camera.left = -20;

dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;

const dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(dirLightHelper);

// const dirLightShadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(dirLightShadowHelper);

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

const sphereMeshes = [];
const sphereBodies = [];
const allColors = [
  0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0x00ffff, 0xffffff, 0x000000,
];

window.addEventListener("click", (e) => {
  const sphereGeo = new THREE.SphereGeometry(0.5);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: allColors[Math.floor(Math.random() * allColors.length - 1)],
  });
  const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphereMesh);
  sphereMeshes.push(sphereMesh);
  sphereMesh.castShadow = true;

  const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(sphereGeo.parameters.radius),
    mass: 1,
  });
  world.addBody(sphereBody);
  sphereBody.linearDamping = 0.3;

  sphereBodies.push(sphereBody);

  sphereBody.position.copy(intersectionPoint);
});

//Animate
function animate(t = 0) {
  requestAnimationFrame(animate);
  world.step(1 / 60);

  groundMesh.position.copy(groundBody.position);
  groundMesh.quaternion.copy(groundBody.quaternion);

  for (let index = 0; index < sphereBodies.length; index++) {
    sphereMeshes[index].position.copy(sphereBodies[index].position);
    sphereMeshes[index].quaternion.copy(sphereBodies[index].quaternion);
  }

  renderer.render(scene, camera);
  controls.update();
}

animate();
