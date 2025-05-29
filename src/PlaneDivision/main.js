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

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
ambient.position.set(0, -20, 0);

//Objects
const loader = new THREE.TextureLoader();

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.81, 0),
});

const planeGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshStandardMaterial({
  color: 0xdddddd,
  side: THREE.DoubleSide,
  visible: false,
});
const groundMesh = new THREE.Mesh(planeGeo, groundMat);
scene.add(groundMesh);
groundMesh.receiveShadow = true;
groundMesh.name = "ground";

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

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);

const highlightMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
  })
);
highlightMesh.rotateX(-Math.PI / 2);
highlightMesh.position.set(0.5, 0, 0.5);
scene.add(highlightMesh);

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
let intersects;

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  planeNormal.copy(camera.position).normalize();
  plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((object) => {
    if (object.object.name == "ground") {
      highlightMesh.position.copy(object.point.floor().addScalar(0.5).setY(0));
    }
    const exists = objects.find(
      (obj) =>
        obj.position.x === highlightMesh.position.x &&
        obj.position.z === highlightMesh.position.z
    );
    if (exists) {
      highlightMesh.material.color.setHex(0xff0000);
    } else {
      highlightMesh.material.color.setHex(0xffffff);
    }
  });
});

const sphereGeo = new THREE.SphereGeometry(0.2);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ffdd,
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);

const objects = [];

window.addEventListener("click", (e) => {
  const exists = objects.find(
    (obj) =>
      obj.position.x === highlightMesh.position.x &&
      obj.position.z === highlightMesh.position.z
  );

  if (!exists) {
    intersects.forEach((object) => {
      if (object.object.name == "ground") {
        const clone = boxMesh.clone();
        clone.position.copy(highlightMesh.position);
        clone.position.setY(0.2);
        scene.add(clone);
        objects.push(clone);
        highlightMesh.material.color.setHex(0xff0000);
      }
    });
  }
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
