import * as THREE from "three";

export default function createStars(
  starCount = 1000,
  radius = 0.02,
  detail = 1,
  color = 0xffffff
) {
  const allStars = new THREE.Object3D();
  const range = 100;
  const offset = range / 2;

  const starGeo = new THREE.IcosahedronGeometry(radius, detail);
  const starMat = new THREE.MeshBasicMaterial({
    color: color,
  });

  for (let index = 0; index < starCount; index++) {
    const starMesh = new THREE.Mesh(starGeo.clone(), starMat.clone());
    const x = Math.random() * range - offset;
    const y = Math.random() * range - offset;
    const z = Math.random() * range - offset;
    starMesh.position.set(x, y, z);
    allStars.add(starMesh);
  }
  return allStars;
}
