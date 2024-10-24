import * as THREE from 'three';

export const vasLights = [
  { _id: 0, target: 'painting', position: new THREE.Vector3(0, 18, -32), l: 7, shadow: true },
  { _id: 1, target: 'sculpture1', position: new THREE.Vector3(0, 20, -16), l: 7, shadow: true },
  { _id: 2, target: 'sculpture2', position: new THREE.Vector3(0, 8, 43), l: 4, shadow: true },
];

export const vasTextures = [
  { _id: 0, to: 'floor', for: 'square', src: '/assets/vas/img/square_floor.png' },
  { _id: 1, to: 'wall', for: 'square', src: '/assets/vas/img/square_wall.png' },
  { _id: 2, to: 'ceiling', for: 'square', src: '/assets/vas/img/square_wall.png' },
  { _id: 3, to: 'floor', for: 'rect', src: '/assets/vas/img/rect_floor.png' },
  { _id: 4, to: 'wall', for: 'rect', src: '/assets/vas/img/rect_wall.png' },
  { _id: 5, to: 'ceiling', for: 'rect', src: '/assets/vas/img/rect_ceiling.png' },
  { _id: 6, to: 'floor', for: 'dig', src: '/assets/vas/img/dig_wall.png' },
  { _id: 7, to: 'wall', for: 'dig', src: '/assets/vas/img/dig_floor.png' },
  { _id: 8, to: 'ceiling', for: 'dig', src: '/assets/vas/img/dig_floor.png' },
];
