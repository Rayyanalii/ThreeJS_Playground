const sphereGeo = new THREE.SphereGeometry(5);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xff9900,
  wireframe: true,
});
const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphereMesh);
