import { Control, ExtendedVideo, VideoXyz } from '@/components/types/vr.type';
import * as THREE from 'three';
import { Scene } from '../../../../../public/matterport-assets/sdk';

/** ============= class video controller ================ */
export class VideoController {
  sdk: MpSdk;
  bindArr: VideoXyz;
  control: Control;
  video: ExtendedVideo;
  playBtn: THREE.Mesh | null;
  pauseBtn: THREE.Mesh | null;
  inputs: {
    visible: boolean;
  };
  context: {
    three: typeof THREE;
  };
  outputs: any;
  constructor(bindArr: VideoXyz, control: Control, mpSdk: MpSdk, video: ExtendedVideo) {
    this.sdk = mpSdk || null;
    this.inputs = {
      visible: true,
    };
    this.bindArr = bindArr;
    this.video = video;
    this.control = control;
    this.playBtn = null;
    this.pauseBtn = null;
    this.context = {
      three: THREE,
    };
    this.onInit = this.onInit.bind(this);
    this.onEvent = this.onEvent.bind(this);
  }
  events = {
    'INTERACTION.CLICK': true,
    // 'INTERACTION.HOVER': true,
  };
  onInit() {
    const rotation = this.bindArr.rotation;
    const position = this.control.position;

    const THREE = this.context.three; // 매터포트 api 안에서 실행되는 것을 가정한 세팅
    const scene = new THREE.Scene();
    const node = new THREE.Object3D();

    // make play button
    const PlayButtonAlpha = '/assets/ui/play.png';
    const ppTexture = new THREE.TextureLoader().load(PlayButtonAlpha);
    const bttnGeo = new THREE.PlaneGeometry(1, 1);
    const bttnMaterial = new THREE.MeshBasicMaterial({
      map: ppTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const playButtonObject = new THREE.Mesh(bttnGeo, bttnMaterial);
    playButtonObject.position.set(position[0], position[1], position[2]);
    playButtonObject.rotation.set(rotation[0], rotation[1], rotation[2]);
    playButtonObject.scale.set(0.25, 0.25, 0.25);

    node.add(playButtonObject);

    // make pause button
    const pauButtonAlpha = '/assets/ui/pause.png';
    const paTexture = new THREE.TextureLoader().load(pauButtonAlpha);
    const pabttnGeo = new THREE.PlaneGeometry(1, 1);
    const pabttnMaterial = new THREE.MeshBasicMaterial({
      map: paTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const pauButtonObject = new THREE.Mesh(pabttnGeo, pabttnMaterial);
    pauButtonObject.position.set(position[0], position[1], position[2]);
    pauButtonObject.rotation.set(rotation[0], rotation[1], rotation[2]);
    pauButtonObject.scale.set(0.2, 0.2, 0.2);
    pauButtonObject.visible = false;

    node.add(pauButtonObject);

    if (this.sdk) scene.add(node);

    this.outputs.objectRoot = node;
    this.outputs.collider = node;

    this.playBtn = playButtonObject;
    this.pauseBtn = pauButtonObject;

    function playBtnOn() {
      playButtonObject.visible = true;
    } // 재생버튼 보이키
    function playBtnOff() {
      playButtonObject.visible = false;
    } // 정지버튼
    function pauseBtnShow() {
      pauButtonObject.visible = true; // 일시정지버튼 보이기
      setTimeout(() => {
        pauButtonObject.visible = false; // 1초뒤 일시정지버튼 사라짐
        playButtonObject.visible = true; // 그 후 재생버튼 나타남
      }, 1000);
    }
    this.video.addEventListener('pause', () => {
      console.log('paused');
      pauseBtnShow();
    });
    this.video.addEventListener('ended', () => {
      playBtnOn();
    });
    this.video.addEventListener('play', () => {
      playBtnOff();
    });
  }
  onEvent(eventType: Scene.InteractionType) {
    const video = this.video;
    if (eventType === 'INTERACTION.CLICK') {
      if (video.value === 'off') {
        video.muted = false;
        video.play();
        video.value = 'on';
        // alert('재생. 다시 클릭하시면 정지됩니다')
      } else {
        video.muted = true;
        video.pause();
        video.value = 'off';
        //alert('실패')
      }
    }
  }
}
