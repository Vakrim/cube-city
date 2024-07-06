import {
  Camera,
  EventDispatcher,
  Object3D,
  Raycaster,
  Scene,
  Vector2,
} from "three";
import { Game } from "./Game";
import { World } from "./World";
import { GameCamera } from "./GameCamera";
import { renderer } from "./renderer";

export class Controls extends EventDispatcher<{
  click: {};
}> {
  rayCaster = new Raycaster();
  pointer: Vector2 | null = null;
  scene: Scene;
  camera: Camera;

  constructor(game: Game) {
    super();

    this.camera = game.getComponent(GameCamera).camera;
    this.scene = game.getComponent(World).scene;
  }

  init() {
    this.addListeners(renderer.domElement);
  }

  addListeners(target: HTMLElement) {
    target.addEventListener("pointermove", (event) => {
      this.pointer ??= new Vector2();
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    target.addEventListener("pointerdown", (event) => {
      this.pointer ??= new Vector2();
      this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.dispatchEvent({ type: "click" });
    });
  }

  getIntersect(objects: Object3D[]) {
    if (!this.pointer) {
      return [];
    }

    this.rayCaster.setFromCamera(this.pointer, this.camera);
    return this.rayCaster.intersectObjects(objects, false);
  }
}
