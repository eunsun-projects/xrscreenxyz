import { Control, CustomTagData, VideoXyz, VrModel } from '@/components/types/vr.type';
import { sortRegex } from '@/utils/common';
import randomString from '@/utils/common/randomString';
import * as THREE from 'three';
import Shadow from '../class/Shadow.class';
import loadScene from '../loadScene';
import { inputData, objectsToLoadY } from './data/gpuonline.data';

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

type ModelsGpuResult = [CustomTagData[], Attachment[], VideoXyz, Control];

const modelsGpu = async (
  mpSdk: MpSdk,
  model: VrModel,
  tags: CustomTagData[] | undefined | null,
  attachs: Attachment[] | undefined | null,
): Promise<ModelsGpuResult> => {
  const videoXyz = {
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
  customTags.forEach((e) => {
    mpSdk.Tag.add(e);
  });

  /** ================= 객체 작업 ==================== */

  //function that provides access to three.js framework objects.
  // 그림자 캐스팅을 위해선 여기 설정이 꼭 필요함
  //function that provides access to three.js framework objects.
  await mpSdk.Scene.configure(function (renderer: any, three: any) {
    // configure PBR
    renderer.physicallyCorrectLights = false;
    // configure shadow mapping
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.bias = -0.0001;
    renderer.shadowMap.type = three.PCFSoftShadowMap;
  });

  const lights = {
    version: '1.0',
    ambient: {
      enabled: true,
      color: { r: 1, g: 1, b: 1 },
      intensity: 0.4,
      name: 'amb',
      castShadow: true,
    },
    directional: {
      enabled: true,
      intensity: 0.5,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 3,
        y: 5,
        z: -1,
      },
      target: {
        x: 2,
        y: 0,
        z: -1,
      },
      castShadow: true,
      debug: false,
    },
    point: {
      enabled: true,
      intensity: 1,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 2,
        y: 4,
        z: -1,
      },
      distance: 0,
      decay: 1,
      castShadow: true,
      debug: false,
    },
  };

  function shadowMatFactory() {
    return new Shadow();
  }
  mpSdk.Scene.register('makeShadowMat', shadowMatFactory);

  const [sceneObject] = await mpSdk.Scene.createObjects(1);

  // amb light
  sceneObject.addNode().addComponent('mp.ambientLight', lights.ambient);
  // directional light
  sceneObject.addNode().addComponent('mp.directionalLight', lights.ambient);

  // 그림자 캐스트를 위한 노드 생성
  const lightNode = sceneObject.addNode();

  lightNode.addComponent('mp.directionalLight', lights.directional);
  lightNode.addComponent('mp.pointLight', lights.point);

  lightNode.obj3D.castShadow = true;
  lightNode.obj3D.receiveShadow = true;

  await loadScene(sceneObject, objectsToLoadY, 'y');

  lightNode.addComponent('makeShadowMat', shadowMatFactory);

  sceneObject.start();

  // lightNode.obj3D.children[1] === pointLight
  lightNode.obj3D.children[1].children[0].shadow.radius = 8;
  lightNode.obj3D.children[1].children[0].shadow.mapSize.width = 1024;
  lightNode.obj3D.children[1].children[0].shadow.mapSize.height = 1024;
  lightNode.obj3D.children[1].children[0].shadow.camera.near = 1;
  lightNode.obj3D.children[1].children[0].shadow.camera.far = 10000;
  lightNode.obj3D.children[1].children[0].shadow.camera.focus = 1;
  // lightNode.obj3D.children[0].children[0].shadow.needsUpdate = true;

  console.log('%c 3d object Loaded!', 'background: #333333; color: #8dceff');

  // 커스텀 태그일 경우 customTag 와 customAttach 리턴 + 기본 비디오, 컨트롤 객체 리턴
  return [customTags, customAttach, videoXyz, controlXyz];
};

export default modelsGpu;
