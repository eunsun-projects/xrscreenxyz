import { ObjectToLoad } from '@/components/types/vr.type';
import * as THREE from 'three';
import { Scene } from '../../../../public/matterport-assets/sdk';

interface Node extends Scene.INode {
  obj3D?: THREE.Object3D;
}

async function loadScene(sceneObject: Scene.IObject, objects: ObjectToLoad[], axis: any) {
  const lookup: Record<string, Scene.IComponent> = {};
  const toBind = [];

  for (let i = 0, length = objects.length; i < length; i++) {
    const node: Node = await sceneObject.addNode();
    const position = objects[i].position;
    const scale = objects[i].scale;
    const rotation = objects[i].rotation;
    const id = objects[i].id;
    const bind = objects[i].bind;
    const castShadow = objects[i].castShadow;
    const component = node.addComponent(objects[i].type, objects[i].inputs);

    if (castShadow) {
      node.obj3D!.castShadow = true;
      node.obj3D!.receiveShadow = true;
    }
    if (id) {
      lookup[id] = component;
    }
    if (bind) {
      toBind.push({
        component,
        bind,
      });
    }

    node.obj3D!.position.set(position[0], position[1], position[2]);
    node.obj3D!.scale.set(scale[0], scale[1], scale[2]);

    node.obj3D!.rotateX((rotation[0] * Math.PI) / 180);
    node.obj3D!.rotateY((rotation[1] * Math.PI) / 180);
    node.obj3D!.rotateZ((rotation[2] * Math.PI) / 180);
    node.obj3D!.updateMatrixWorld(true);
    // node.start();

    function tick() {
      requestAnimationFrame(tick);
      if (axis === 'x') {
        node.obj3D!.rotation.x += 0.004;
      } else if (axis === 'y') {
        node.obj3D!.rotation.y += 0.003;
      } else if (axis === 'z') {
        node.obj3D!.rotation.z += 0.004;
      }
    }
    if (axis) {
      tick();
    } else {
      console.log('animate == false');
    }
  }
  return toBind;
}
export default loadScene;
