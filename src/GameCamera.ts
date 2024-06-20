import { OrthographicCamera } from "three";
import { screen } from "./screen";

export class GameCamera {
  cameraSize = 4;
  camera: OrthographicCamera;

  constructor() {
    this.camera = new OrthographicCamera(
      -this.cameraSize * screen.aspectRatio,
      this.cameraSize * screen.aspectRatio,
      this.cameraSize,
      -this.cameraSize,
      0.1,
      1000
    );

    this.camera.position.set(7, 10, 10);
    this.camera.lookAt(0, 0, 0);
  }

  updateAspectRatio() {
    const aspectRatio = screen.width / screen.height;
    this.camera.left = -this.cameraSize * aspectRatio;
    this.camera.right = this.cameraSize * aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
