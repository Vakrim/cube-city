import { Camera, PerspectiveCamera, Vector2, Vector3 } from "three";
import { screen } from "../screen";
import { WORLD_MAP_SIZE } from "./WorldMap";
import { clamp } from "../helpers/clamp";
import { Game } from "../Game";
import { Controls } from "./Controls";

const DEG2RAD = Math.PI / 180.0;

const MIN_CAMERA_RADIUS = 10;
const MAX_CAMERA_RADIUS = 150;
const MIN_CAMERA_ELEVATION = 10;
const MAX_CAMERA_ELEVATION = 60;

const AZIMUTH_SENSITIVITY = 0.2;
const ELEVATION_SENSITIVITY = 0.2;
const ZOOM_SENSITIVITY = 0.05;
const PAN_SENSITIVITY = 0.05;

const Y_AXIS = new Vector3(0, 1, 0);

export class GameCamera {
  cameraSize = 4;
  camera: PerspectiveCamera;
  panSpeed = 0.05;
  lastPointer = new Vector2(0, 0);
  lastWheelPosition = 0;

  cameraOrigin = new Vector3(WORLD_MAP_SIZE / 2, 0, WORLD_MAP_SIZE / 2);
  cameraRadius = 50;
  cameraAzimuth = 30;
  cameraElevation = 30;

  controls: Controls;

  constructor(game: Game) {
    this.camera = new PerspectiveCamera(75, screen.aspectRatio, 0.1, 1000);

    game.addComponentInstance(Camera, this.camera);

    this.controls = game.getComponent(Controls);

    this.updateCameraPosition();
  }

  init() {}

  updateCameraPosition() {
    this.camera.position.x =
      this.cameraRadius *
      Math.sin(this.cameraAzimuth * DEG2RAD) *
      Math.cos(this.cameraElevation * DEG2RAD);
    this.camera.position.y =
      this.cameraRadius * Math.sin(this.cameraElevation * DEG2RAD);
    this.camera.position.z =
      this.cameraRadius *
      Math.cos(this.cameraAzimuth * DEG2RAD) *
      Math.cos(this.cameraElevation * DEG2RAD);
    this.camera.position.add(this.cameraOrigin);
    this.camera.lookAt(this.cameraOrigin);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
  }

  update(deltaTime: number) {
    const mouseDeltaX = this.controls.pointer.x - this.lastPointer.x;
    const mouseDeltaY = this.controls.pointer.y - this.lastPointer.y;
    const wheelDelta = this.controls.wheelPosition - this.lastWheelPosition;

    const scrollForward =
      (this.controls.keyPressed.w ? 1 : 0) -
      (this.controls.keyPressed.s ? 1 : 0);

    const scrollRight =
      (this.controls.keyPressed.d ? 1 : 0) -
      (this.controls.keyPressed.a ? 1 : 0);

    if (this.controls.keyPressed.rightMouseButton) {
      this.cameraAzimuth += -(mouseDeltaX * AZIMUTH_SENSITIVITY);
      this.cameraElevation += mouseDeltaY * ELEVATION_SENSITIVITY;
      this.cameraElevation = clamp(
        this.cameraElevation,
        MIN_CAMERA_ELEVATION,
        MAX_CAMERA_ELEVATION,
      );
    }

    const forward = new Vector3(0, 0, -1).applyAxisAngle(
      Y_AXIS,
      this.cameraAzimuth * DEG2RAD,
    );
    const left = new Vector3(1, 0, 0).applyAxisAngle(
      Y_AXIS,
      this.cameraAzimuth * DEG2RAD,
    );
    this.cameraOrigin.add(
      forward.multiplyScalar(PAN_SENSITIVITY * scrollForward * deltaTime),
    );
    this.cameraOrigin.add(
      left.multiplyScalar(PAN_SENSITIVITY * scrollRight * deltaTime),
    );

    this.cameraOrigin.x = clamp(this.cameraOrigin.x, 0, WORLD_MAP_SIZE);
    this.cameraOrigin.z = clamp(this.cameraOrigin.z, 0, WORLD_MAP_SIZE);

    this.cameraRadius = clamp(
      this.cameraRadius + wheelDelta * ZOOM_SENSITIVITY,
      MIN_CAMERA_RADIUS,
      MAX_CAMERA_RADIUS,
    );

    this.updateCameraPosition();

    this.lastPointer.copy(this.controls.pointer);
    this.lastWheelPosition = this.controls.wheelPosition;
  }

  updateAspectRatio() {
    this.camera.aspect = screen.aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
