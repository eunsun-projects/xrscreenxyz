import { Control, ExtendedVideo, VideoXyz, VrModel } from '@/components/types/vr.type';
import useVrStore from '@/zustand/vr.store';
import { VideoController } from './class/VideoController.class';
import { VideoInVr } from './class/VideoInVr.class';
import WhiteSky from './class/WhiteSky.class';

export async function setSceneObject(
  mpSdk: MpSdk,
  model: VrModel,
  videoxyz: VideoXyz | null,
  control: Control | null,
) {
  const videoRef = useVrStore.getState().videoRef;
  const video = videoRef?.current as ExtendedVideo;
  let videoFactory: (() => VideoInVr) | null = null;
  let controlFactory: (() => VideoController) | null = null;

  const skyFactory = () => new WhiteSky(mpSdk);
  mpSdk.Scene.register('makeSky', skyFactory);

  if (model.video[0] && videoxyz && control) {
    videoFactory = () => new VideoInVr(mpSdk, video, videoxyz, control.isControl);
    mpSdk.Scene.register('makeVideo', videoFactory);
  }
  if (control && videoxyz && video) {
    controlFactory = () => new VideoController(videoxyz, control, mpSdk, video);
    mpSdk.Scene.register('makePp', controlFactory);
  }

  const lights = {
    enabled: true,
    color: { r: 0.5, g: 0.5, b: 0.5 },
    intensity: 0.1,
  };

  const [sceneObject] = await mpSdk.Scene.createObjects(1);
  sceneObject.addNode().addComponent('mp.ambientLight', lights); //amb light
  sceneObject.addNode().addComponent('makeSky', skyFactory);

  if (videoFactory) {
    sceneObject.addNode().addComponent('makeVideo', videoFactory);
  }

  if (controlFactory) {
    sceneObject.addNode().addComponent('makePp', controlFactory);
  }

  sceneObject.start();
}
