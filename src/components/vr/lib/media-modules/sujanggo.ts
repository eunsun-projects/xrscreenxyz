import { Control, CustomTagData, VideoXyz, VrModel } from '@/components/types/vr.type';
import { sortRegex } from '@/utils/common';
import randomString from '@/utils/common/randomString';
import * as THREE from 'three';
import loadScene from '../loadScene';
import { inputData, objectsToLoadY } from './data/sujanggo.data';

enum AttachmentType {
  /** An unknown type of attachment. This should never happen */
  UNKNOWN = 'tag.attachment.unknown',
  APPLICATION = 'tag.attachment.application',
  AUDIO = 'tag.attachment.audio',
  /** The attachment contains an image */
  IMAGE = 'tag.attachment.image',
  /** The attachment contains rich content like an iframe of another site */
  MODEL = 'tag.attachment.model',
  PDF = 'tag.attachment.pdf',
  RICH = 'tag.attachment.rich',
  TEXT = 'tag.attachment.text',
  /** The attachment contains a video */
  VIDEO = 'tag.attachment.video',
  ZIP = 'tag.attachment.zip',
  /** The attachment is a sandbox created by a call to [[Tag.registerSandbox]] */
  SANDBOX = 'tag.attachment.sandbox',
}
type Attachment = {
  id: string;
  src: string;
  type: AttachmentType;
};

type ModelsDefragmentationResult = [CustomTagData[], Attachment[], VideoXyz, Control];

const modelsSujanggo = async (
  mpSdk: MpSdk,
  model: VrModel,
  tags: CustomTagData[] | undefined | null,
  attachs: Attachment[] | undefined | null,
): Promise<ModelsDefragmentationResult> => {
  const videoXyz: VideoXyz = {
    isVideo: false,
    position: [0, 0, 0],
    backPosition: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [0, 0, 0],
  };

  const controlXyz = {
    isControl: false,
    position: [0, 0, 0],
  };

  /** ===================== 태그 작업 ========================= */
  const customTags: CustomTagData[] = [];
  const customAttach: Attachment[] = attachs?.map((attach) => ({ ...attach })) ?? [];
  const tempRandomStr: string[] = [];

  inputData.forEach((data, i) => {
    tempRandomStr[i] ??= randomString(11);
  });

  inputData.forEach((data, index) => {
    customAttach[index] ??= {
      id: tempRandomStr[index],
      src: data.media.src,
      type: AttachmentType.RICH,
    };
    customTags[index] ??= {
      number: data.number,
      id: data.id,
      enabled: data.enabled,
      customAttachments: [tempRandomStr[index]],
      color: data.color,
      label: data.label,
      description: data.description,
      stemVector: data.stemVector,
      stemHeight: data.stemHeight,
      stemVisible: data.stemVisible,
      floorIndex: data.floorIndex,
      roomId: data.roomId,
      anchorPosition: data.anchorPosition,
      sorted: data.description.match(sortRegex),
      attachments: [],
      discPosition: data.anchorPosition as THREE.Vector3,
      keywords: data.keywords,
      fontId: '',
    };
  });

  // 메타포트 콘솔에서 생성한 태그 데이터가 있다면 커스텀태그 배열에 추가
  tags?.forEach((tag) => {
    customTags.push({ ...tag });
  });

  // 커스텀 태그 배열을 기준으로 태그 생성
  customTags.forEach((tag, index) => {
    if (index !== 0) {
      mpSdk.Tag.add(tag);
    }
  });

  /** ================= 객체 작업 ==================== */

  //function that provides access to three.js framework objects.
  await mpSdk.Scene.configure(function (renderer: any, three: any) {
    // configure PBR
    renderer.physicallyCorrectLights = true;
    // configure shadow mapping
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.bias = -0.0001;
    renderer.shadowMap.type = three.PCFSoftShadowMap;
  });

  const lights = {
    version: '1.0',
    initial_light_1: {
      enabled: true,
      color: { r: 255, g: 255, b: 255 },
      intensity: 0.003,
    },
    initial_light_2: {
      enabled: true,
      intensity: 0.006,
      color: { r: 160, g: 160, b: 160 },
      position: { x: 9.7, y: 5, z: -0.8 },
      distance: 0,
      decay: 1,
      castShadow: true,
      debug: false,
    },
    initial_light_box: {
      enabled: true,
      intensity: 0.0013,
      color: { r: 255, g: 255, b: 255 },
      position: { x: 1, y: 2, z: -1 },
      target: { x: -0.63, y: 0.65, z: -1.25 },
      decay: 10,
      castShadow: true,
    },
    initial_light_point: {
      enabled: true,
      intensity: 0.006,
      color: { r: 255, g: 255, b: 200 },
      position: { x: 3.2, y: 6, z: -1.6 },
      distance: 0,
      decay: 1,
      castShadow: true,
    },
    initial_light_3: {
      enabled: true,
      color: { r: 255, g: 230, b: 175 },
      intensity: 0.003,
      distance: 8,
      castShadow: true,
      position: { x: 11, y: 7.5, z: -5.9 },
      target: { x: 11, y: 0, z: -5.9 },
    },
    initial_light_4: {
      enabled: true,
      color: { r: 255, g: 230, b: 200 },
      intensity: 0.003,
      distance: 8,
      castShadow: true,
      position: { x: 5, y: 7.5, z: -3.7 },
      target: { x: 5, y: 0, z: -3.7 },
    },
  };

  ///makeShadow///
  class makeShadow {
    inputs: {
      visible: boolean;
    };
    outputs: any;
    context: {
      three: typeof THREE;
    };
    onInit: () => void;
    constructor() {
      this.inputs = {
        visible: true,
      };
      this.context = {
        three: THREE,
      };
      this.onInit = function () {
        const THREE = this.context.three;
        const node = new THREE.Object3D();

        this.outputs.objectRoot = node;

        const shadowGeo = new THREE.PlaneGeometry(1, 1);
        const shadow_texture_url = '/assets/ui/shadow_blur.png';
        const shadowTexture = new THREE.TextureLoader().load(shadow_texture_url);
        const shadowMat = new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          shadowSide: undefined,
        });

        objectsToLoadY.forEach((obj) => {
          const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
          shadowMesh.position.set(obj.shadowPosition.x, 0.03, obj.shadowPosition.z);
          shadowMesh.scale.set(obj.shadowScale.x, obj.shadowScale.y, obj.shadowScale.z);
          shadowMesh.rotation.set(1.57, 0, 0);
          node.add(shadowMesh);
        });
      };
    }
  }
  function shadowFactory() {
    return new makeShadow();
  }
  mpSdk.Scene.register('makeShadow', shadowFactory);

  const [sceneObject] = await mpSdk.Scene.createObjects(1);
  //global light_1
  sceneObject.addNode().addComponent('mp.ambientLight', lights.initial_light_1);
  //point light_2
  sceneObject.addNode().addComponent('mp.pointLight', lights.initial_light_2);
  //directional light_box
  sceneObject.addNode().addComponent('mp.directionalLight', lights.initial_light_box);
  //directional light_point
  sceneObject.addNode().addComponent('mp.pointLight', lights.initial_light_point);
  //directional light_3
  sceneObject.addNode().addComponent('mp.directionalLight', lights.initial_light_3);
  //directional light_4
  sceneObject.addNode().addComponent('mp.directionalLight', lights.initial_light_4);

  const customNode = sceneObject.addNode();
  customNode.addComponent('makeShadow', shadowFactory);

  await loadScene(sceneObject, objectsToLoadY);

  sceneObject.start();

  console.log('%c 3d object Loaded!', 'background: #333333; color: #8dceff');

  // 커스텀 태그일 경우 customTag 와 customAttach 리턴 + 기본 비디오, 컨트롤 객체 리턴
  return [customTags, customAttach, videoXyz, controlXyz];
};

export default modelsSujanggo;
