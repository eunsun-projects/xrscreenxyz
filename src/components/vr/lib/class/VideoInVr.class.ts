import { ExtendedVideo, VideoXyz } from '@/components/types/vr.type';
import * as THREE from 'three';
import { Scene } from '../../../../../public/matterport-assets/sdk';

/** ============ class make Video ============ */
export class VideoInVr {
  sdk: MpSdk;
  bindArr: VideoXyz;
  video: ExtendedVideo;
  isControl: boolean;
  context: {
    three: typeof THREE;
  };
  outputs: {
    objectRoot: THREE.Object3D;
    collider: THREE.Object3D;
  };
  constructor(mpSdk: MpSdk, video: ExtendedVideo, bindArr: VideoXyz, isControl: boolean) {
    this.sdk = mpSdk;
    this.bindArr = bindArr;
    this.video = video;
    this.isControl = isControl;
    this.context = {
      three: THREE,
    };
    this.outputs = {
      objectRoot: new THREE.Object3D(),
      collider: new THREE.Object3D(),
    };
    this.onEvent = this.onEvent.bind(this);
  }
  events = {
    'INTERACTION.CLICK': true,
    // 'INTERACTION.HOVER': true,
  };
  inputs = {
    visible: true,
  };
  onInit() {
    const position = this.bindArr.position;
    const rotation = this.bindArr.rotation;
    const scale = this.bindArr.scale;
    const backPostion = this.bindArr.backPosition;
    const video = this.video;

    const THREE = this.context.three;
    const scene = new THREE.Scene();
    const node = new THREE.Object3D();

    const VideoTexture_s = new THREE.VideoTexture(video);
    VideoTexture_s.minFilter = THREE.LinearFilter;
    VideoTexture_s.magFilter = THREE.LinearFilter;
    VideoTexture_s.needsUpdate = true;

    const VideoMaterial = new THREE.MeshBasicMaterial({
      map: VideoTexture_s,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    VideoMaterial.needsUpdate = true;

    const VideoGeometry = new THREE.PlaneGeometry(1, 1);

    const backbox = new THREE.MeshBasicMaterial({ color: 0x0c1427 });
    const VideoBackGeometry = new THREE.BoxGeometry(1, 1, 0.01);

    const VideoScreen = new THREE.Mesh(VideoGeometry, VideoMaterial);
    VideoScreen.castShadow = true;
    VideoScreen.position.set(position[0], position[1], position[2]);
    VideoScreen.rotation.set(rotation[0], rotation[1], rotation[2]);
    VideoScreen.scale.set(scale[0], scale[1], scale[2]);

    node.add(VideoScreen);

    const VideoBack = new THREE.Mesh(VideoBackGeometry, backbox);
    VideoBack.position.set(backPostion[0], backPostion[1], backPostion[2]);
    VideoBack.rotation.set(rotation[0], rotation[1], rotation[2]);
    VideoBack.scale.set(scale[0], scale[1], scale[2]);

    node.add(VideoBack);
    scene.add(node);

    //this.outputs.texture = this.texture;
    this.outputs.objectRoot = node;
    this.outputs.collider = VideoScreen; //raycast hit detection
  }
  onEvent(eventType: Scene.InteractionType) {
    const video = this.video;
    if (this.isControl === false) {
      if (eventType === 'INTERACTION.CLICK') {
        if (video.value === 'off') {
          // video.muted = !video.muted;
          video.muted = false;
          video.play();
          video.value = 'on';
          // alert('재생. 다시 클릭하시면 정지됩니다')
        } else {
          // video.muted = !video.muted;
          video.muted = true;
          video.pause();
          video.value = 'off';
          //alert('실패')
        }
      }
      console.log('Scene.Object3D Clicked', eventType); // this.notify(eventType);
    } else if (this.isControl === true) {
      if (eventType === 'INTERACTION.CLICK') {
        video.muted = !video.muted;
        video.pause();
        video.value = 'off';
        //alert('실패')
      }
    }
  }
}
