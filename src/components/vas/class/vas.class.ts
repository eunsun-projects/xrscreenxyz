import { VasInformActions } from '@/context/vasInform.context';
import { VasLoadingActions } from '@/context/vasLoading.context';
import { vasLights, vasTextures } from '@/data/vas.data';
import * as THREE from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PointerLockControls } from '../controls/vas.controls';

export default class Vas {
  actions: VasLoadingActions;
  boolActions: VasInformActions;
  canvasdiv: HTMLDivElement;
  title: string;
  running: boolean;
  controls: any;
  player: any;
  isDragging: boolean;
  preventKeyFlag: boolean;
  paintingsArr: any[];
  textures: typeof vasTextures;
  models: any[];
  lights: typeof vasLights;
  pedeObject: any;
  lightObject: any[];
  scaleFactorArr: any[];
  mergeArr: any[];
  infoArr: any[];
  loadingCount: number;
  rafId: string;
  idleTime: number;
  previousPosition: any;
  _fixedWidth: number;
  _fixedHeight: number;
  _renderer: THREE.WebGLRenderer | null;
  _scene: THREE.Scene | null;
  _camera: THREE.PerspectiveCamera | null;
  _modelLoader: GLTFLoader | null;
  _textureLoader: THREE.TextureLoader | null;
  loadingBoxGroup: THREE.Group | null;
  objGroup: THREE.Group | null;
  pedeGroup: THREE.Group | null;
  paintingGroup: THREE.Group | null;
  spotLightGroup: THREE.Group | null;
  wallGroup: THREE.Group | null;
  paintingObject: any;
  constructor(
    canvasdiv: HTMLDivElement,
    title: string,
    actions: VasLoadingActions,
    boolActions: VasInformActions,
    textures: typeof vasTextures,
    paintings: any[],
    models: any[],
    lights: typeof vasLights,
  ) {
    this.actions = actions;
    this.boolActions = boolActions;
    this.canvasdiv = canvasdiv;
    this.title = title;
    this.running = true;
    this._renderer = null;
    this._scene = null;
    this._camera = null;
    this._modelLoader = null;
    this._textureLoader = null;
    this.controls = {};
    this.player = {
      height: 0.65,
      turnSpeed: 0.03,
      speed: 0.12,
      jumpHeight: 0.16,
      gravity: 0.005,
      velocity: 0,
      playerJumps: false,
    };
    this.isDragging = false;
    this.preventKeyFlag = true;
    this.paintingsArr = paintings; // 파라미터로 받은 페인팅 정보 할당
    this.textures = textures; // 파라미터로 받은 텍스처 정보 할당
    this.models = models; // 파라미터로 받은 모델 정보 할당
    this.lights = lights; // 파라미터로 받은 모델 정보 할당
    this.pedeObject = {}; // 좌대 객체는 비워놓고 시작 > 3d 모델이 있으면 생성됨 > 실행은 createPedestal 함수로
    this.lightObject = [];
    this.scaleFactorArr = [];
    this.mergeArr = [];
    this.infoArr = [];
    this.loadingCount = 0;
    this.rafId = '';
    this.idleTime = 0;
    this.previousPosition = {};
    this.controls = null;
    this.loadingBoxGroup = null;
    this.objGroup = null;
    this.pedeGroup = null;
    this.paintingGroup = null;
    this.spotLightGroup = null;
    this.wallGroup = null;
    const fixedWidth = window.innerWidth;
    const fixedHeight = window.innerHeight;
    this._fixedWidth = fixedWidth;
    this._fixedHeight = fixedHeight;

    /************** start app ***************/
    this.init(); // init 만 컨스트럭터안에서 실행할 것
  }
  _isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }
  init() {
    /************* renderer ***************/
    const renderer = new THREE.WebGLRenderer({ antialias: true }); //canvas : canvas,
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this._fixedWidth, this._fixedHeight);
    renderer.setClearColor(0xffffff, 1);
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.bias = -0.01;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.canvasdiv.appendChild(renderer.domElement); // 캔버스에 렌더러 적용
    this._renderer = renderer;

    /************* scene ***************/
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc7c7c7);
    if (this.title !== 'sanctum') scene.fog = new THREE.Fog(0xc7c7c7, 0.1, 100); /////////////////
    this._scene = scene;

    /************* camera ***************/
    const camera = new THREE.PerspectiveCamera(
      90, // FOV
      this._fixedWidth / this._fixedHeight, // aspect ratio
      0.1, // near
      1000, // far 10000
    );
    this._camera = camera;

    this.initCamera();
    this._camera.updateProjectionMatrix();
    this.previousPosition = this._camera.position.clone(); // Initialize previousPosition

    /************* model loader ***************/
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    this._modelLoader = loader;

    /************* texture loader ***************/
    const textureLoader = new THREE.TextureLoader();
    this._textureLoader = textureLoader;

    /************* group ***************/
    this.loadingBoxGroup = new THREE.Group();
    this.objGroup = new THREE.Group();
    this.pedeGroup = new THREE.Group();
    this.paintingGroup = new THREE.Group();
    this.spotLightGroup = new THREE.Group();
    this.wallGroup = new THREE.Group();

    /************* controler ***************/
    this.controls = new PointerLockControls(camera, this.canvasdiv);
  }
  initCamera() {
    if (!this._camera || !this._scene) return;
    if (this.title === '정방형공간') {
      // 공간에 따라 시작위치 변경
      this._camera.position.set(0, this.player.height, 28);
      this._camera.lookAt(new THREE.Vector3(0, this.player.height, 0));
      this._scene.add(this._camera);
    } else if (this.title === '세장형공간') {
      this._camera.position.set(0, this.player.height, 46);
      this._camera.lookAt(new THREE.Vector3(0, this.player.height, 0));
      this._scene.add(this._camera);
    } else if (this.title === 'ㄷ자형공간') {
      this._camera.position.set(-20, this.player.height, 30);
      this._camera.lookAt(new THREE.Vector3(0, this.player.height, 0));
      this._scene.add(this._camera);
    }
  }
  addWorldLight() {
    if (!this._scene) return;
    if (this.title === '정방형공간') {
      const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
      this._scene.add(ambLight);
      const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
      this._scene.add(light);
    } else if (this.title === '세장형공간') {
      const ambLight = new THREE.AmbientLight(0xfffff0, 0.1);
      this._scene.add(ambLight);
      const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
      this._scene.add(light);
    } else if (this.title === 'ㄷ자형공간') {
      const ambLight = new THREE.AmbientLight(0xfffff0, 0.1);
      this._scene.add(ambLight);
      const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      this._scene.add(light);
    }
  }
  loadTexture(url: string) {
    return new Promise((resolve, reject) => {
      if (!this._textureLoader) return;
      this._textureLoader.load(
        url,
        (texture) => {
          resolve(texture);
        },
        undefined,
        (error) => {
          reject(error);
        },
      );
    });
  }
  addWallFloorCeiling() {
    // 고른것에 따라 벽이랑 천장 바닥 만드는 함수
    let fTexture;
    let wTexture;
    let cTexture;
    if (this.title === '정방형공간') {
      fTexture = this.textures[0].src;
      wTexture = this.textures[1].src;
      cTexture = this.textures[2].src;
    } else if (this.title === '세장형공간') {
      fTexture = this.textures[3].src;
      wTexture = this.textures[4].src;
      cTexture = this.textures[5].src;
    } else if (this.title === 'ㄷ자형공간') {
      fTexture = this.textures[6].src;
      wTexture = this.textures[7].src;
      cTexture = this.textures[8].src;
    }

    // Texture of the floor 바닥 생성
    this.loadTexture(fTexture!)
      .then((texture: unknown) => {
        const floorTexture = texture as THREE.Texture;
        let planeGeometry;
        if (this.title === '정방형공간') {
          planeGeometry = new THREE.PlaneGeometry(90, 90);
        } else if (this.title === '세장형공간') {
          planeGeometry = new THREE.PlaneGeometry(50, 100);
        } else if (this.title === 'ㄷ자형공간') {
          planeGeometry = new THREE.PlaneGeometry(50, 65);
        }
        if (!this._scene) return;

        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1, 1);

        const material = new THREE.MeshPhongMaterial({
          map: floorTexture,
          side: THREE.DoubleSide,
        });

        const floorPlane = new THREE.Mesh(planeGeometry, material);
        floorPlane.receiveShadow = true;
        floorPlane.rotation.x = Math.PI / 2;
        floorPlane.position.y = -Math.PI;
        this._scene.add(floorPlane);

        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((error) => console.log(error));

    // Create wall material 벽 생성
    this.loadTexture(wTexture!)
      .then((texture: unknown) => {
        const wallTexture = texture as THREE.Texture;
        let frontWall;
        let leftWall;
        let rightWall;
        let backWall;
        let middleWall;
        // Front Wall
        if (this.title === '정방형공간') {
          wallTexture.wrapS = THREE.RepeatWrapping;
          wallTexture.wrapT = THREE.RepeatWrapping;
          wallTexture.repeat.set(1, 1);

          frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001), // (가로, 높이, 두께)
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          frontWall.position.z = -30; // push the wall forward in the Z axis

          // Left Wall
          leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          leftWall.rotation.y = Math.PI / 2;
          leftWall.position.x = -30;

          // Right Wall
          rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          rightWall.position.x = 30;
          rightWall.rotation.y = Math.PI / 2;

          // Back Wall
          backWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          backWall.position.z = 30;
          if (!this.wallGroup) return;
          this.wallGroup.add(frontWall, backWall, leftWall, rightWall);
        } else if (this.title === '세장형공간') {
          wallTexture.wrapS = THREE.RepeatWrapping;
          wallTexture.wrapT = THREE.RepeatWrapping;
          wallTexture.repeat.set(1, 1);

          frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, 30, 0.001), // (가로, 높이, 두께)
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          frontWall.position.z = -50; // push the wall forward in the Z axis

          // Left Wall
          leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          leftWall.rotation.y = Math.PI / 2;
          leftWall.position.x = -25;

          // Right Wall
          rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          rightWall.position.x = 25;
          rightWall.rotation.y = Math.PI / 2;

          // Back Wall
          backWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          backWall.position.z = 50;

          if (!this.wallGroup) return;
          this.wallGroup.add(frontWall, backWall, leftWall, rightWall);
        } else if (this.title === 'ㄷ자형공간') {
          wallTexture.wrapS = THREE.RepeatWrapping;
          wallTexture.wrapT = THREE.RepeatWrapping;
          wallTexture.repeat.set(1, 1);

          frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, 30, 0.001), // (가로, 높이, 두께)
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          frontWall.position.z = -32.5; // push the wall forward in the Z axis

          // Left Wall
          leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(65, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          leftWall.rotation.y = Math.PI / 2;
          leftWall.position.x = -25;

          // Right Wall
          rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(65, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          rightWall.position.x = 25;
          rightWall.rotation.y = Math.PI / 2;

          // Back Wall
          backWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          backWall.position.z = 32.5;

          // middle Wall
          middleWall = new THREE.Mesh(
            new THREE.BoxGeometry(27, 30, 15),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          middleWall.position.x = 11.5;

          if (!this.wallGroup) return;
          this.wallGroup.add(frontWall, backWall, leftWall, rightWall, middleWall);
        }
        // Enable shadows on objects
        if (frontWall) {
          frontWall.castShadow = true;
          frontWall.receiveShadow = true;
        }
        if (leftWall) {
          leftWall.castShadow = true;
          leftWall.receiveShadow = true;
        }
        if (rightWall) {
          rightWall.castShadow = true;
          rightWall.receiveShadow = true;
        }
        if (backWall) {
          backWall.castShadow = true;
          backWall.receiveShadow = true;
        }

        if (!this._scene || !this.wallGroup) return;
        this._scene.add(this.wallGroup);
        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((err) => console.log(err));

    // Create the ceiling 천장 생성
    this.loadTexture(cTexture!)
      .then((texture: unknown) => {
        const ceilingTexture = texture as THREE.Texture;
        let ceilingGeometry;
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(1, 1);
        if (this.title === '정방형공간') {
          ceilingGeometry = new THREE.PlaneGeometry(90, 90);
        } else if (this.title === '세장형공간') {
          ceilingGeometry = new THREE.PlaneGeometry(50, 100);
        } else if (this.title === 'ㄷ자형공간') {
          ceilingGeometry = new THREE.PlaneGeometry(50, 65);
        }
        const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });
        const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceilingPlane.receiveShadow = true;

        ceilingPlane.rotation.x = Math.PI / 2; // 90 degrees
        ceilingPlane.position.y = 15;

        if (!this._scene) return;
        this._scene.add(ceilingPlane);

        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((err) => console.log(err));
  }
  loadPainting(
    imageURL: string,
    width: number,
    height: number,
    position: THREE.Vector3,
    lr: string,
  ) {
    const paintingTexture = this._textureLoader?.load(imageURL);
    if (!paintingTexture) return;
    const paintingMaterial = new THREE.MeshBasicMaterial({
      map: paintingTexture,
      depthWrite: false,
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial) as THREE.Mesh<
      THREE.PlaneGeometry,
      THREE.MeshBasicMaterial
    > & {
      customProperty: string;
    };
    painting.position.set(position.x, position.y, position.z);
    if (lr === 'left') {
      painting.rotation.y = Math.PI / 2; // 90 degrees.
    } else if (lr === 'right') {
      painting.rotation.y = -Math.PI / 2; // 90 degrees.
    } else if (lr === 'back') {
      painting.rotation.y = Math.PI; //180 degrees
    } else {
      painting.rotation.y = 0;
    }
    painting.customProperty = 'paintingss';
    painting.receiveShadow = true;
    painting.castShadow = true;
    return painting; // this function returns the paintings
  }
  addPaintings() {
    if (this.paintingsArr.length > 0) {
      this.paintingsArr.forEach((e, i) => {
        this.paintingObject['painting' + i] = this.loadPainting(
          e.poster,
          e.w,
          e.h,
          e.position,
          e.lr,
        );
      });
      // scene add paintings
      for (const painting of Object.values(this.paintingObject)) {
        if (!this.paintingGroup) return;
        this.paintingGroup.add(painting as THREE.Mesh);
      }
      this.paintingsArr.forEach((e, i) => {
        if (!this.paintingGroup) return;
        this.paintingGroup.children[i].userData = { ...e.userData };
      });
      if (!this._scene || !this.paintingGroup) return;
      this._scene.add(this.paintingGroup);
    }
  }
  loadingBox(position: THREE.Vector3) {
    const boxGeometry1 = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial1 = new THREE.MeshBasicMaterial({ color: 'white', wireframe: false });
    const box1 = new THREE.Mesh(boxGeometry1, boxMaterial1);
    box1.scale.set(0.25, 0.25, 0.25);
    box1.position.set(position.x, position.y, position.z);
    box1.name = 'loadingBox';
    return box1;
  }
  modelLoad(model: any, position: THREE.Vector3) {
    return new Promise((resolve, reject) => {
      if (!this._modelLoader) return;
      this._modelLoader.load(
        model.obj,
        (gltf) => {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const scaleFactor = 10 / Math.max(size.x, size.y, size.z);
          gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

          if (!this.objGroup) return;
          this.objGroup.add(gltf.scene);

          gltf.scene.traverse(function (object) {
            if (object instanceof THREE.Mesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            }
          });
          gltf.scene.castShadow = true;
          gltf.scene.receiveShadow = true;
          gltf.scene.name = model.userdata.info.title;
          gltf.scene.userData = model.userdata;
          (gltf.scene as any).number = model._id;
          (gltf.scene as any).scaleFactor = scaleFactor;
          (gltf.scene as any).customProperty = 'obj';
          gltf.scene.position.set(position.x, position.y, position.z);
          if (!this.objGroup) return;
          (this.objGroup as any).customProperty = 'objsGroup';
          if (!this._scene) return;
          this._scene.add(this.objGroup);

          resolve(gltf.scene); // Resolve the promise when the model has loaded
        },
        (xhr) => {
          const loadCounter = (xhr.loaded / xhr.total) * 100;
          if (loadCounter < 100) {
            if (!this.loadingBoxGroup) return;
            this.loadingBoxGroup.add(this.loadingBox(position));
            if (!this._scene) return;
            this._scene.add(this.loadingBoxGroup);
          } else if (loadCounter === 100) {
            if (!this._scene || !this.loadingBoxGroup) return;
            this._scene.remove(this.loadingBoxGroup);
          }
        },
        function (error) {
          console.error(error);
          reject(error);
        },
      );
    });
  }
  createSpotlight(
    position: THREE.Vector3,
    intensity: number,
    emer: THREE.Vector3,
    shadow: boolean,
  ) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(position.x, position.y, position.z);
    // targetPosition ? spotlight.target.position.copy(targetPosition.position) : spotlight.target.position.copy(emer);
    spotlight.target.position.copy(emer);
    spotlight.castShadow = shadow;
    spotlight.angle = Math.PI / 3;
    spotlight.penumbra = 1;
    spotlight.decay = 1.5;
    spotlight.distance = 40;
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    spotlight.shadow.camera.near = 0.3;
    spotlight.shadow.camera.far = 500;
    return spotlight; // this function returns the spotlight
  }
  addModelAndLight() {
    // 예시 공간에는 모델이 없으므로 아직 쓸일 없는 함수
    if (this.models.length > 0) {
      this.models.forEach((e, i) => {
        this.modelLoad(e, e.position)
          .then((scene: any) => {
            this.infoArr.push(scene.userData);
            this.mergeArr.push(scene.position);
            this.scaleFactorArr.push(scene.scaleFactor);
            // this.loadingCount += 1;
            this.actions.increase();

            return scene;
          })
          .then((sceneObject: any) => {
            const e = this.lights[i];
            const lightObject = this.createSpotlight(
              e.position,
              e.l,
              sceneObject.position,
              e.shadow,
            );
            if (!this._scene) return;
            this._scene.add(lightObject.target);
            this._scene.add(lightObject);
          })
          .catch((err) => console.log(err));
      });
    } else {
      this.actions.increase();
    }
  }
  loadPedestal(position: THREE.Vector3, scaleFactor: number, pHeight: number) {
    const boxMaterial = new THREE.MeshLambertMaterial({ color: 0xcfcfcf });
    const boxGeometry = new THREE.BoxGeometry(scaleFactor, pHeight, scaleFactor);
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.position.set(position.x, position.y - 2, position.z);
    boxMesh.name = 'pedestal';
    (boxMesh as any).customProperty = 'pedestal';
    boxMesh.receiveShadow = true;
    boxMesh.castShadow = true;
    return boxMesh;
  }
  addPedestal() {
    // addModelAndLight 이후에 호출할 것
    this.models.forEach((e, i) => {
      if (e.pedestal) {
        // 좌대 있으면
        this.pedeObject['pede' + i] = this.loadPedestal(e.position, this.scaleFactorArr[i], 4);
      }
    });
    // scene add paintings
    for (const pede of Object.values(this.pedeObject)) {
      if (!this.pedeGroup) return;
      this.pedeGroup.add(pede as THREE.Mesh);
    }
    if (!this._scene || !this.pedeGroup) return;
    this._scene.add(this.pedeGroup);
  }
  checkCollision() {
    const playerBoundingBox = new THREE.Box3();
    const cameraWorldPosition = new THREE.Vector3();
    if (!this._camera) return;
    this._camera.getWorldPosition(cameraWorldPosition);
    playerBoundingBox.setFromCenterAndSize(cameraWorldPosition, new THREE.Vector3(1.7, 1.7, 1.7));
    // loop through each wall
    if (!this.wallGroup) return;
    for (let i = 0; i < this.wallGroup.children.length; i++) {
      const wall = this.wallGroup.children[i]; // get the wall
      if (playerBoundingBox.intersectsBox((wall as any).BoundingBox)) {
        return true;
      }
    }
    if (!this.objGroup) return;
    for (let i = 0; i < this.objGroup.children.length; i++) {
      const wall = this.objGroup.children[i]; // get the wall
      if (playerBoundingBox.intersectsBox((wall as any).BoundingBox)) {
        return true;
      }
    }
    if (!this.pedeGroup) return;
    for (let i = 0; i < this.pedeGroup.children.length; i++) {
      const wall = this.pedeGroup.children[i];
      if (playerBoundingBox.intersectsBox((wall as any).BoundingBox)) {
        return true;
      }
    }
    return false; // if it doesn't, return false
  }
  loopForCollision() {
    if (!this.wallGroup) return;
    for (let i = 0; i < this.wallGroup.children.length; i++) {
      (this.wallGroup.children[i] as any).BoundingBox = new THREE.Box3();
      (this.wallGroup.children[i] as any).BoundingBox.setFromObject(this.wallGroup.children[i]);
    }
    if (!this.objGroup) return;
    for (let i = 0; i < this.objGroup.children.length; i++) {
      (this.objGroup.children[i] as any).BoundingBox = new THREE.Box3();
      (this.objGroup.children[i] as any).BoundingBox.setFromObject(this.objGroup.children[i]);
    }
    if (!this.pedeGroup) return;
    for (let i = 0; i < this.pedeGroup.children.length; i++) {
      (this.pedeGroup.children[i] as any).BoundingBox = new THREE.Box3();
      (this.pedeGroup.children[i] as any).BoundingBox.setFromObject(this.pedeGroup.children[i]);
    }
    if (this.checkCollision()) {
      if (!this.previousPosition || !this._camera) return;
      this._camera.position.copy(this.previousPosition);
    }
    if (!this.previousPosition || !this._camera) return;
    this.previousPosition.copy(this._camera.position); // 여기에 한번더 카피 해줘야함
  }
  informDisplay() {
    const distanceThreshold = 17; // Set the distance threshold for displaying the painting information
    let shouldHide = true;

    if (this.infoArr.length > 0) {
      this.mergeArr.forEach((e, i) => {
        // mergeArr have position inform
        if (!this._camera) return;
        const distance = this._camera.position.distanceTo(e);

        if (distance < distanceThreshold) {
          this.boolActions.setTrue(this.infoArr[i].info);
          // displayPaintingInfo(infoArr[i].info);  여기 체크할 것 !!!!!!!!!!!!!!!!
          shouldHide = false; // If we displayed info, we should not hide
        }
      });

      if (shouldHide) {
        this.boolActions.setFalse({});
        // hidePaintingInfo();  여기 체크할 것 !!!!!!!!!!!!!!!!
      }
    }
  }
  controlSet() {
    // get the direction that the camera is pointing
    const direction = new THREE.Vector3();
    if (!this._camera) return;
    this._camera.getWorldDirection(direction);
    direction.y = 0; // ignore any up/down tilt of the camera

    if (this.controls.w || this.controls.ArrowUp || this.controls['ㅈ']) {
      // w - forward
      this._camera.position.add(direction.normalize().multiplyScalar(this.player.speed));
    }
    if (this.controls.s || this.controls.ArrowDown || this.controls['ㄴ']) {
      // s - backward
      this._camera.position.add(direction.normalize().multiplyScalar(-this.player.speed));
    }

    // For left and right movement, we need to compute the right vector
    const right = new THREE.Vector3();
    this._camera.getWorldDirection(right);
    right.y = 0; // Again, ignore the up/down tilt of the camera
    right.cross(this._camera.up); // This will give us the vector that is perpendicular to the up vector and direction vector

    if (this.controls.a || this.controls.ArrowLeft || this.controls['ㅁ']) {
      // a - left
      this._camera.position.add(right.normalize().multiplyScalar(-this.player.speed));
    }
    if (this.controls.d || this.controls.ArrowRight || this.controls['ㅇ']) {
      // d - right
      this._camera.position.add(right.normalize().multiplyScalar(this.player.speed));
    }

    // space === jump action
    if (this.controls.space) {
      if (this.player.jumps) return false;
      this.player.jumps = true;
      this.player.velocity = -this.player.jumpHeight;
    }
  }
  ixMovementUpdate() {
    if (!this.player) return;
    this.player.velocity += this.player.gravity;
    if (!this._camera) return;
    this._camera.position.y -= this.player.velocity;

    if (this._camera.position.y < this.player.height) {
      this._camera.position.y = this.player.height;
      this.player.jumps = false;
    }
  }
  modelDispose(scene: any) {
    scene.children.forEach((e: any) => {
      if (typeof e.number === 'number') {
        scene.remove(e);
        if (e.children[0].geometry) {
          // console.log('지오 폐기')
          e.children[0].geometry.dispose();
        }
        if (e.children[0].material) {
          // console.log('메터리얼 폐기')
          e.children[0].material.dispose();
        }
        if (e.children[0].material.map) {
          // console.log('텍스처 폐기')
          e.children[0].material.map.dispose();
        }
      }
    });
    scene.traverse((object: any) => {
      // Geometry 삭제
      if (object.geometry) {
        object.geometry.dispose();
        console.log('geo disposed!');
      }
      // Material 삭제
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => this.disposeMaterial(material));
          console.log('material array disposed!');
        } else {
          this.disposeMaterial(object.material);
          console.log('material disposed!');
        }
      }
    });
  }
  disposeMaterial(material: any) {
    // 텍스처 삭제
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    // Material 자체 삭제
    material.dispose();
  }
  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    if (this._camera) {
      if (this._camera instanceof THREE.PerspectiveCamera) {
        // PerspectiveCamera
        this._camera.aspect = aspect;
      } else if (this._camera as any) {
        // OrthographicCamera
        (this._camera as any).left = aspect * -1;
        (this._camera as any).right = aspect * 1;
      }
      this._camera.updateProjectionMatrix();
    }

    if (this._renderer) {
      this._renderer.setSize(width, height);
    }
  }
  rotate() {
    // const canvas = document.querySelector('canvas')
    this.canvasdiv.addEventListener('mousedown', () => {
      this.isDragging = true;
      if (!this.controls) return;
      this.controls.lock();
    });
    this.canvasdiv.addEventListener('mousemove', (e) => {
      if (this.isDragging) this.controls.onMouseMove(e);
    });
    this.canvasdiv.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.controls) return;
        this.controls.unlock();
      }
    });
    this.canvasdiv.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      if (this.isDragging) this.controls.onTouchMove(e);
    });
    this.canvasdiv.addEventListener('touchend', (e) => {
      if (this.isDragging) {
        this.isDragging = false;
        if (!this.controls) return;
        this.controls.onTouchEnd(e);
      }
    });
  }
  onKeydownUp() {
    document.addEventListener('keydown', (e) => {
      if (
        [
          'w',
          'a',
          's',
          'd',
          'ㅈ',
          'ㅁ',
          'ㄴ',
          'ㅇ',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Escape',
        ].includes(e.key)
      ) {
        this.controls[e.key] = true;
      } else if (e.key === ' ') {
        this.controls['space'] = true;
      }
    });
    document.addEventListener('keyup', (e) => {
      if (
        [
          'w',
          'a',
          's',
          'd',
          'ㅈ',
          'ㅁ',
          'ㄴ',
          'ㅇ',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
          'Escape',
        ].includes(e.key)
      ) {
        this.controls[e.key] = false;
      } else if (e.key === ' ') {
        this.controls['space'] = false;
      }
    });
  }
  onMoveKeyDown(dataset: any) {
    if (!this.controls) return;
    this.controls[dataset] = true;
  }
  onMoveKeyUp(dataset: any) {
    if (!this.controls) return;
    this.controls[dataset] = false;
  }
  render() {
    if (!this.running) return;
    if (!this._renderer || !this._scene || !this._camera) return;
    this._renderer.render(this._scene, this._camera);
    this.loopForCollision();
    this.informDisplay();
    this.controlSet();
    this.ixMovementUpdate();
  }
  destroy() {
    if (!this._renderer || !this._scene) return;
    this.running = false;
    this._renderer.dispose();
    this.modelDispose(this._scene);
  }
}
