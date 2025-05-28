import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);
camera.position.z = 5;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.01;

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  flatShading: true,
});

const mesh = new THREE.Mesh(geo, mat);
const mesh2 = new THREE.Mesh(geo, mat);
mesh.position.x = -2;
mesh2.position.x = 2;
scene.add(mesh);
scene.add(mesh2);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x666666,
  wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh.clone());
mesh2.add(wireMesh.clone());

const hemiLight = new THREE.HemisphereLight(0x3300aa, 0xaa3300, 1.5);
scene.add(hemiLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0004;
  mesh2.rotation.y = t * -0.0004;

  raycaster.setFromCamera(mouse, camera);
  const intersectsMesh1 = raycaster.intersectObject(mesh);
  const intersectsMesh2 = raycaster.intersectObject(mesh2);

  if (intersectsMesh1.length > 0 || intersectsMesh2.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }

  renderer.render(scene, camera);
  controls.update();
}

animate();
