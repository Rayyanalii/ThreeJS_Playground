const planeGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const groundMesh = new THREE.Mesh(planeGeo, groundMat);
scene.add(groundMesh);
