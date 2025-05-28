import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { points } from "../utils/randomVector3";

//Renderer
const width = window.innerWidth;
const height = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Camera
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1);
camera.position.z = 20;

//Scene
const scene = new THREE.Scene();

//Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

//Lighting
scene.fog = new THREE.FogExp2(0x000000, 0.09);

//Objects
const loader = new THREE.TextureLoader();

const curve = new THREE.CatmullRomCurve3(points, true);
const geometry = new THREE.TubeGeometry(curve, 100, 5, 8, true);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ffcc,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const updateCamera = (t) => {
  const time = t * 0.1;
  const looptime = 8 * 1000;
  const p = (time % looptime) / looptime;
  const pos = geometry.parameters.path.getPointAt(p);
  const lookAt = geometry.parameters.path.getPointAt((p + 0.01) % 1);
  camera.position.copy(pos);
  camera.lookAt(lookAt);
};

//Animate
function animate(t = 0) {
  requestAnimationFrame(animate);
  updateCamera(t);
  renderer.render(scene, camera);
  controls.update();
}

animate();
