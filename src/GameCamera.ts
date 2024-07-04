import { PerspectiveCamera, Vector3 } from "three";
import { screen } from "./screen";

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
  isLeftMouseDown = false;
  isRightMouseDown = false;

  constructor() {
    this.camera = new PerspectiveCamera(75, screen.aspectRatio, 0.1, 1000);

    this.camera.position.set(5, 15, 30);
    this.camera.lookAt(0, 0, 0);
  }

  moveCameraForward(amount: number) {
    const direction = new Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    direction.multiplyScalar(amount);
    this.camera.position.add(direction);
  }

  moveCameraRight(amount: number) {
    const direction = new Vector3();
    this.camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    direction.applyAxisAngle(new Vector3(0, 1, 0), -Math.PI / 2);
    direction.multiplyScalar(amount);
    this.camera.position.add(direction);
  }

  rotateCamera(deltaX: number, deltaY: number) {
    this.camera.rotation.y -= deltaX * 0.01;
    this.camera.rotation.x -= deltaY * 0.01;
  }

  update(deltaTime: number) {
    const mouseDeltaX = this.mouseX - this.lastMouseX;
    const mouseDeltaY = this.mouseY - this.lastMouseY;

    this.moveCameraForward(this.scrollForward * this.panSpeed * deltaTime);
    this.moveCameraRight(this.scrollRight * this.panSpeed * deltaTime);
    if (this.isRightMouseDown) {
      this.rotateCamera(mouseDeltaX, mouseDeltaY);
    }

    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
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
  }

  updateAspectRatio() {
    this.camera.aspect = screen.aspectRatio;
    this.camera.updateProjectionMatrix();
  }
}
