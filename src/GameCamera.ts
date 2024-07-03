import { OrthographicCamera, PerspectiveCamera } from "three";
import { screen } from "./screen";

export class GameCamera {
  cameraSize = 4;
  // camera: OrthographicCamera;
  camera: PerspectiveCamera

  constructor() {
    // this.camera = new OrthographicCamera(
    //   -this.cameraSize * screen.aspectRatio,
    //   this.cameraSize * screen.aspectRatio,
    //   this.cameraSize,
    //   -this.cameraSize,
    //   0.1,
    //   1000
    // );

    this.camera = new PerspectiveCamera(75, screen.aspectRatio, 0.1, 1000);

    this.camera.position.set(5, 15, 30);
    this.camera.lookAt(0, 0, 0);
  }

  updateAspectRatio() {
    this.camera.aspect = screen.aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
