import * as THREE from 'three';

/** ============ class White background ============== */
class Shadow {
  material: THREE.ShadowMaterial | null;
  inputs: {
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
  };
  outputs: any;
  context: {
    three: typeof THREE;
  };
  onDestroy: () => void;
  onInit: () => void;
  constructor() {
    this.inputs = {
      visible: true,
      castShadow: true,
      receiveShadow: true,
    };
    this.context = {
      three: THREE,
    };
    this.material = null;
    this.onInit = function () {
      const THREE = this.context.three;
      const node = new THREE.Object3D();
      const geo = new THREE.PlaneGeometry(1, 1);

      // shadow material 로 생성
      this.material = new THREE.ShadowMaterial({
        transparent: true,
        color: 0x000000,
        opacity: 0.3, // 그림자의 투명도를 조절하십시오.
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geo, this.material);
      mesh.position.set(2, 0.1, -1);
      mesh.scale.set(10, 10, 10);
      mesh.rotation.set(1.57, 0, 0);
      node.add(mesh);

      mesh.receiveShadow = true;
      node.name = 'shadowMat';
      mesh.name = 'shadowMat';

      this.outputs.objectRoot = mesh;
      this.outputs.collider = mesh;
    };

    this.onDestroy = function () {
      if (this.material) {
        this.material.dispose();
      }
    };
  }
}
export default Shadow;
