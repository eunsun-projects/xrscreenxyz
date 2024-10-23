import { Control, CustomTagData, VideoXyz, VrModel } from '@/components/types/vr.type';
import { sortRegex } from '@/utils/common';
import randomString from '@/utils/common/randomString';
import * as THREE from 'three';
import { Tag } from '../../../../../public/matterport-assets/sdk';
import loadScene from '../loadScene';
import { inputData, objectsToLoadY } from './data/defragmentation.data';

type ModelsDefragmentationResult = [CustomTagData[], Tag.Attachment[], VideoXyz, Control];

const modelsDefragmentation = async (
  mpSdk: MpSdk,
  model: VrModel,
  tags: CustomTagData[] | undefined | null,
  attachs: Tag.Attachment[] | undefined | null,
): Promise<ModelsDefragmentationResult> => {
  const videoXyz: VideoXyz = {
    isVideo: true,
    position: [16.9, 4, 2.5],
    backPosition: [16.9, 4, 2.55],
    rotation: [0, -2.9, 0],
    scale: [2.5, 4.5, 2.5],
  };

  const controlXyz = {
    isControl: true,
    position: [16.9, 3.9, 2.48],
  };

  const origin = [...(model.object[1] as string[])];
  origin.sort();

  /** ===================== 태그 작업 ========================= */

  await mpSdk.Asset.registerTexture('introduction', '/assets/ui/tagicon_intro.png');
  await mpSdk.Asset.registerTexture('poster', '/assets/ui/tagicon_poster.png');

  const customTags: CustomTagData[] = [];
  const customAttach: Tag.Attachment[] = attachs?.map((attach) => ({ ...attach })) ?? [];
  const tempRandomStr: string[] = [];

  inputData.forEach((data, i) => {
    tempRandomStr[i] ??= randomString(11);
  });

  const introAndPoster = inputData.filter((data) => {
    return data.number === 10 || data.number === 21;
  });

  // 어태치먼트 아이디 위에 생성해놓은 tempRandomStr 의 값으로 적용, 타입은 rich 타입
  inputData.forEach((e, i) => {
    customAttach[i] ??= {
      id: tempRandomStr[i],
      src: e.url,
      type: Tag.AttachmentType.RICH,
    };
  });

  // 입력한 데이터 값으로 커스텀태그 객체 값 적용
  inputData.forEach((data, index) => {
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

  // console.log(introAndPoster)
  await mpSdk.Tag.editIcon(introAndPoster[0].id, 'poster');
  await mpSdk.Tag.editIcon(introAndPoster[1].id, 'introduction');

  /** ================= 객체 작업 ==================== */

  //function that provides access to three.js framework objects.
  await mpSdk.Scene.configure(function (renderer: any, three: any) {
    // configure PBR
    renderer.physicallyCorrectLights = false;
    // configure shadow mapping
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.bias = -0.0001;
    renderer.shadowMap.type = three.PCFSoftShadowMap;
  });

  const lights = {
    version: '1.0',
    ambient: {
      enabled: true,
      color: { r: 1, g: 1, b: 1 },
      intensity: 0.0001,
    },
    directional_joo: {
      enabled: true,
      intensity: 0.4,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 13,
        y: 10,
        z: -8,
      },
      target: {
        x: 11.78761950513903,
        y: 0,
        z: -2.2582975121618842,
      },
      castShadow: false,
      debug: false,
    },
    directional_jang: {
      enabled: true,
      intensity: 0.4,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 13,
        y: 10,
        z: -8,
      },
      target: {
        x: 21.76999854741998,
        y: 1.5,
        z: -8.986029396839877,
      },
      castShadow: false,
      debug: false,
    },
    directional_oh: {
      enabled: true,
      intensity: 0.4,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 13,
        y: 10,
        z: -8,
      },
      target: {
        x: 9.004537548053872,
        y: 0,
        z: -8.542391366439461,
      },
      castShadow: false,
      debug: false,
    },
    point: {
      enabled: true,
      intensity: 0.08,
      color: { r: 1, g: 1, b: 1 },
      position: {
        x: 13,
        y: 10,
        z: -8,
      },
      distance: 0,
      decay: 1,
      castShadow: false,
      debug: false,
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
        const shadow_texture_url = '/assets/ui/shadow_blur_dark.png';
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
  // amb light
  // sceneObject.addNode().addComponent('mp.ambientLight', lights.ambient);
  // directional light
  sceneObject.addNode().addComponent('mp.directionalLight', lights.directional_joo);
  sceneObject.addNode().addComponent('mp.directionalLight', lights.directional_jang);
  sceneObject.addNode().addComponent('mp.directionalLight', lights.directional_oh);
  // point light
  // sceneObject.addNode().addComponent('mp.pointLight', lights.point);

  const customNode = sceneObject.addNode();
  customNode.addComponent('makeShadow', shadowFactory);

  await loadScene(sceneObject, objectsToLoadY, 'y');

  sceneObject.start();

  console.log('%c 3d object Loaded!', 'background: #333333; color: #8dceff');

  // 커스텀 태그일 경우 customTag 와 customAttach 리턴 + 기본 비디오, 컨트롤 객체 리턴
  return [customTags, customAttach, videoXyz, controlXyz];
};

export default modelsDefragmentation;
