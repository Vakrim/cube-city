import { Camera, PerspectiveCamera, Vector3 } from "three";
import { screen } from "../screen";
import { WORLD_MAP_SIZE } from "./WorldMap";
import { clamp } from "../helpers/clamp";
import { Game } from "../Game";

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
  scrollRight = 0;
  scrollForward = 0;
  mouseX = 0;
  mouseY = 0;
  lastMouseX = 0;
  lastMouseY = 0;
  mouseDeltaY = 0;
  isLeftMouseDown = false;
  isRightMouseDown = false;

  cameraOrigin = new Vector3(WORLD_MAP_SIZE / 2, 0, WORLD_MAP_SIZE / 2);
  cameraRadius = 50;
  cameraAzimuth = 30;
  cameraElevation = 30;

  constructor(game: Game) {
    this.camera = new PerspectiveCamera(75, screen.aspectRatio, 0.1, 1000);

    game.addComponentInstance(Camera, this.camera);

    this.updateCameraPosition();
  }

  init() {
    this.addControlsListeners(window);
  }

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
    const mouseDeltaX = this.mouseX - this.lastMouseX;
    const mouseDeltaY = this.mouseY - this.lastMouseY;

    if (this.isRightMouseDown) {
      this.cameraAzimuth += -(mouseDeltaX * AZIMUTH_SENSITIVITY);
      this.cameraElevation += mouseDeltaY * ELEVATION_SENSITIVITY;
      this.cameraElevation = clamp(
        this.cameraElevation,
        MIN_CAMERA_ELEVATION,
        MAX_CAMERA_ELEVATION
      );
    }

    const forward = new Vector3(0, 0, -1).applyAxisAngle(
      Y_AXIS,
      this.cameraAzimuth * DEG2RAD
    );
    const left = new Vector3(1, 0, 0).applyAxisAngle(
      Y_AXIS,
      this.cameraAzimuth * DEG2RAD
    );
    this.cameraOrigin.add(
      forward.multiplyScalar(PAN_SENSITIVITY * this.scrollForward * deltaTime)
    );
    this.cameraOrigin.add(
      left.multiplyScalar(PAN_SENSITIVITY * this.scrollRight * deltaTime)
    );

    this.cameraOrigin.x = clamp(this.cameraOrigin.x, 0, WORLD_MAP_SIZE);
    this.cameraOrigin.z = clamp(this.cameraOrigin.z, 0, WORLD_MAP_SIZE);

    this.cameraRadius = clamp(
      this.cameraRadius + this.mouseDeltaY * ZOOM_SENSITIVITY,
      MIN_CAMERA_RADIUS,
      MAX_CAMERA_RADIUS
    );

    this.updateCameraPosition();

    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
    this.mouseDeltaY = 0;
  }

  addControlsListeners(target: Window) {
    target.addEventListener("keydown", (event) => {
      if (event.key === "w") {
        this.scrollForward = 1;
      }
      if (event.key === "s") {
        this.scrollForward = -1;
      }
      if (event.key === "a") {
        this.scrollRight = -1;
      }
      if (event.key === "d") {
        this.scrollRight = 1;
      }
    });

    target.addEventListener("keyup", (event) => {
      if (event.key === "w" || event.key === "s") {
        this.scrollForward = 0;
      }
      if (event.key === "a" || event.key === "d") {
        this.scrollRight = 0;
      }
    });

    target.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        this.isLeftMouseDown = true;
      }
      if (event.button === 2) {
        this.isRightMouseDown = true;
      }
    });

    target.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        this.isLeftMouseDown = false;
      }
      if (event.button === 2) {
        this.isRightMouseDown = false;
      }
    });

    target.addEventListener("mousemove", (event) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    });

    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    target.addEventListener("wheel", (event) => {
      this.mouseDeltaY += event.deltaY;
    });
  }

  updateAspectRatio() {
    this.camera.aspect = screen.aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
