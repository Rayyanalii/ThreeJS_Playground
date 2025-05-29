const boxGeo = new THREE.BoxGeometry(4, 4, 4);
const boxMat = new THREE.MeshBasicMaterial({
  color: 0x00ffdd,
  wireframe: true,
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);
