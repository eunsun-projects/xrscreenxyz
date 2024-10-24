import { VasInformActions } from '@/context/vasInform.context';
import { VasLoadingActions } from '@/context/vasLoading.context';
import { sanctumLights, sanctumTextures } from '@/data/sanctum.data';
import * as THREE from 'three';
import Vas from './vas.class';

export default class Sanctum extends Vas {
  steelCamera: THREE.CubeCamera | null;
  steel: THREE.Object3D | null;
  constructor(
    canvasdiv: HTMLDivElement,
    title: string,
    actions: VasLoadingActions,
    boolActions: VasInformActions,
    textures: typeof sanctumTextures,
    paintings: any[],
    models: any[],
    lights: typeof sanctumLights,
  ) {
    super(canvasdiv, title, actions, boolActions, textures, paintings, models, lights);
    this.initReflection();
    this.steelCamera = null;
    this.steel = null;
  }
  //기본 카메라 설정
  initCamera() {
    if (!this._camera || !this._scene) return;
    if (this.title === 'sanctum') {
      // 공간에 따라 시작위치 변경
      this._camera.position.set(0, this.player.height, 45);
      this._camera.lookAt(new THREE.Vector3(0, this.player.height, 0));
      this._scene.add(this._camera);
    }
  }
  //기본 빛 추가
  addWorldLight() {
    if (!this._scene) return;
    if (this.title === 'sanctum') {
      const ambLight = new THREE.AmbientLight(0xfffff0, 0.1);
      this._scene.add(ambLight);
      const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
      this._scene.add(light);
    }
  }
  initReflection() {
    if (!this._renderer) return;
    const sphereRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    (sphereRenderTarget as any)._pmremGen = new THREE.PMREMGenerator(this._renderer);
    const steelCamera = new THREE.CubeCamera(1, 1000, sphereRenderTarget);
    this.steelCamera = steelCamera;
  }
  // 벽 바닥 천장 추가
  addWallFloorCeiling() {
    let fTexture;
    let wTexture;
    let cTexture;
    if (this.title === 'sanctum') {
      fTexture = this.textures[0].src;
      wTexture = this.textures[1].src;
      cTexture = this.textures[2].src;
    }

    // Texture of the floor 바닥 생성
    this.loadTexture(fTexture!)
      .then((tex: unknown) => {
        const texture = tex as THREE.Texture;
        let planeGeometry;
        if (this.title === 'sanctum') {
          planeGeometry = new THREE.PlaneGeometry(85, 110); /////
        }

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        const material = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });

        const floorPlane = new THREE.Mesh(planeGeometry, material);
        floorPlane.receiveShadow = true;
        floorPlane.rotation.x = Math.PI / 2;
        floorPlane.position.y = -Math.PI;
        if (this._scene) {
          this._scene.add(floorPlane);
        }

        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((error) => console.log(error));

    // Create wall material 벽 생성
    this.loadTexture(wTexture!)
      .then((tex: unknown) => {
        const wallTexture = tex as THREE.Texture;
        let frontWall;
        let leftWall;
        let rightWall;
        let backWall;
        // Front Wall
        if (this.title === 'sanctum') {
          wallTexture.wrapS = THREE.RepeatWrapping;
          wallTexture.wrapT = THREE.RepeatWrapping;
          wallTexture.repeat.set(2, 2);

          frontWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001), // (가로, 높이, 두께)
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          frontWall.position.z = -50; // push the wall forward in the Z axis

          // Left Wall
          leftWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          leftWall.rotation.y = Math.PI / 2;
          leftWall.position.x = -30;

          // Right Wall
          rightWall = new THREE.Mesh(
            new THREE.BoxGeometry(100, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          rightWall.position.x = 30;
          rightWall.rotation.y = Math.PI / 2;

          // Back Wall
          backWall = new THREE.Mesh(
            new THREE.BoxGeometry(60, 30, 0.001),
            new THREE.MeshLambertMaterial({ map: wallTexture }),
          );
          backWall.position.z = 50;

          if (this.wallGroup) {
            this.wallGroup.add(frontWall, backWall, leftWall, rightWall);
          }
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
        if (this._scene && this.wallGroup) {
          this._scene.add(this.wallGroup);
        }
        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((err) => console.log(err));

    // Create the ceiling 천장 생성
    this.loadTexture(cTexture!) // load the image/texture
      .then((tex: unknown) => {
        const ceilingTexture = tex as THREE.Texture;
        let ceilingGeometry;
        ceilingTexture.wrapS = THREE.RepeatWrapping;
        ceilingTexture.wrapT = THREE.RepeatWrapping;
        ceilingTexture.repeat.set(5, 5);
        if (this.title === 'sanctum') {
          ceilingGeometry = new THREE.PlaneGeometry(100, 110);
        }
        const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });
        const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
        ceilingPlane.receiveShadow = true;

        ceilingPlane.rotation.x = Math.PI / 2; // 90 degrees
        ceilingPlane.position.y = 15;

        if (this._scene) {
          this._scene.add(ceilingPlane);
        }

        this.loadingCount += 1;
        this.actions.increase();
      })
      .catch((err) => console.log(err));
  }
  // 모델 로더 업데이트
  modelLoad(model: any, position: THREE.Vector3) {
    return new Promise((resolve, reject) => {
      this._modelLoader!.load(
        model.obj,
        (gltf) => {
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const size = box.getSize(new THREE.Vector3());
          const scaleFactor = 10 / Math.max(size.x, size.y, size.z);
          gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
          if (this.objGroup) {
            this.objGroup.add(gltf.scene);
          }

          gltf.scene.traverse(function (object: any) {
            if (object.isMesh) {
              object.castShadow = true;
              object.receiveShadow = true;
            } else {
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
          (gltf.scene as any).children[0].customProperty = 'obj';
          gltf.scene.position.set(position.x, position.y, position.z);
          if (this.objGroup) {
            (this.objGroup as any).customProperty = 'objsGroup';
            if (this._scene && this.objGroup) {
              this._scene.add(this.objGroup);
            }
          }

          // 오브젝트01 반사를 위한 설정
          // if(gltf.scene.name === 'object01'){
          //     gltf.scene.add(this.steelCamera)
          //     gltf.scene.children[0].material.envMapIntensity = 1;
          //     gltf.scene.children[0].material.reflectivity = 1;
          // }
          if (gltf.scene.name === 'object01') {
            if (this.steelCamera) {
              gltf.scene.add(this.steelCamera);
            }
            const steel = gltf.scene.children[0];
            if (steel) {
              this.steel = steel;
              (steel as any).material.envMapIntensity = 1;
              (steel as any).material.reflectivity = 1;
            }
          }
          if (gltf.scene.name === 'object03') {
            gltf.scene.rotation.y = -Math.PI / 2;
            gltf.scene.scale.set(4, 4, 4);
          }

          resolve(gltf.scene); // Resolve the promise when the model has loaded
        },
        (xhr) => {
          const loadCounter = (xhr.loaded / xhr.total) * 100;
          if (loadCounter < 100) {
            if (this.loadingBoxGroup) {
              this.loadingBoxGroup.add(this.loadingBox(position));
              if (this._scene && this.loadingBoxGroup) {
                this._scene.add(this.loadingBoxGroup);
              }
            }
          } else if (loadCounter === 100) {
            if (this._scene && this.loadingBoxGroup) {
              this._scene.remove(this.loadingBoxGroup);
            }
          }
        },
        function (error) {
          console.error(error);
          reject(error);
        },
      );
    });
  }
  // 오브젝트02 서서히 올라갔다 내려갔다
  octaAnimation() {
    if (this.objGroup && this.objGroup.getObjectByName('object02')) {
      const to = this.objGroup.getObjectByName('object02');
      if (to) {
        to.rotation.y += 0.001; // slowly rotate the model
        to.position.y = -9 + Math.sin(Date.now() / 1000) * 1; // slowly move up and down
      }
    }
  }
  // 오브젝트01 반사를 위해서!!!!!!!!!!
  ufanReflection() {
    if (this.steel && this.steelCamera) {
      const renderTarget = (this.steelCamera!.renderTarget as any)._pmremGen.fromCubemap(
        this.steelCamera!.renderTarget.texture,
      );
      if (this.steel) {
        (this.steel as any).material.envMap = renderTarget.texture;
      }

      if (this.steelCamera && this._renderer && this._scene) {
        this.steelCamera.position.copy(this.steel.position);
        this.steelCamera.update(this._renderer, this._scene);
      }
    }
  }
  // render 함수 오버라이딩
  render() {
    if (!this.running) return;
    if (this._renderer && this._scene && this._camera) {
      this._renderer.render(this._scene, this._camera);
    }
    this.loopForCollision();
    this.informDisplay();
    this.controlSet();
    this.ixMovementUpdate();
    this.octaAnimation();
    this.ufanReflection();
  }
}
