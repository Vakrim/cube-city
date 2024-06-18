import { OrthographicCamera } from "three";
import { screen } from "./screen";

const cameraSize = 4;
const camera = new OrthographicCamera(
  -cameraSize * screen.aspectRatio,
  cameraSize * screen.aspectRatio,
  cameraSize,
  -cameraSize,
  0.1,
  1000
);
camera.position.set(7, 10, 10);
camera.lookAt(0, 0, 0);
