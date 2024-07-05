import { Camera, Object3D, Raycaster, Scene, Vector2 } from "three";

export class Controls {
  rayCaster = new Raycaster();
  pointer = new Vector2();

  constructor(public camera: Camera, public scene: Scene) {}

  addListeners(target: HTMLElement) {
    target.addEventListener("pointermove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
  }

  getIntersect(objects: Object3D[]) {
    this.rayCaster.setFromCamera(this.pointer, this.camera);
    return this.rayCaster.intersectObjects(objects, false);
  }
}
