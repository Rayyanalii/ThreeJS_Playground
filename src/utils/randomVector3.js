import * as THREE from "three";

export const points = [];
const numPoints = 20;
const radius = 50;

for (let i = 0; i < numPoints; i++) {
  const angle = (i / numPoints) * Math.PI * 2;
  const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 10;
  const y = Math.sin(angle) * radius + (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 20;
  points.push(new THREE.Vector3(x, y, z));
}
