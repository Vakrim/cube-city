import { Camera, Object3D, Raycaster, Scene, Vector2 } from "three";
import { Game } from "../Game";

const trackableKeys = [
  "w",
  "a",
  "s",
  "d",
  "leftMouseButton",
  "rightMouseButton",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
] as const;

export class Controls {
  rayCaster = new Raycaster();
  scene: Scene;

  pointer: Vector2 = new Vector2(0, 0);
  wheelPosition = 0;

  keyPressed: Record<(typeof trackableKeys)[number], boolean> =
    createRecordFromKeys(trackableKeys);

  keyPressedThisFrame: typeof Controls.prototype.keyPressed =
    createRecordFromKeys(trackableKeys);

  constructor(private game: Game) {
    this.scene = game.get(Scene);
  }

  init() {
    this.addListeners(window);
  }

  addListeners(target: Window) {
    target.addEventListener("pointermove", (event) => {
      this.pointer.set(event.clientX, event.clientY);
    });

    target.addEventListener("pointerdown", (event) => {
      this.pointer.set(event.clientX, event.clientY);

      if (event.button === 0) {
        this.keyPressed.leftMouseButton = true;
        this.keyPressedThisFrame.leftMouseButton = true;
      } else if (event.button === 2) {
        this.keyPressed.rightMouseButton = true;
        this.keyPressedThisFrame.rightMouseButton = true;
      }
    });

    target.addEventListener("pointerup", (event) => {
      if (event.button === 0) {
        this.keyPressed.leftMouseButton = false;
      } else if (event.button === 2) {
        this.keyPressed.rightMouseButton = false;
      }
    });

    target.addEventListener("keydown", (event) => {
      if (event.key in this.keyPressed) {
        this.keyPressed[event.key as keyof typeof this.keyPressed] = true;
        this.keyPressedThisFrame[event.key as keyof typeof this.keyPressed] =
          true;
      }
    });

    target.addEventListener("keyup", (event) => {
      if (event.key in this.keyPressed) {
        this.keyPressed[event.key as keyof typeof this.keyPressed] = false;
      }
    });

    target.addEventListener("wheel", (event) => {
      this.wheelPosition += event.deltaY;
    });

    target.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
  }

  afterUpdate() {
    for (const key in this.keyPressedThisFrame) {
      this.keyPressedThisFrame[key as keyof typeof this.keyPressedThisFrame] =
        false;
    }
  }

  getIntersect(objects: Object3D[]) {
    const coords = new Vector2(
      (this.pointer.x / window.innerWidth) * 2 - 1,
      -(this.pointer.y / window.innerHeight) * 2 + 1,
    );

    this.rayCaster.setFromCamera(coords, this.game.get(Camera));
    return this.rayCaster.intersectObjects(objects, false);
  }
}

function createRecordFromKeys<T extends string>(
  keys: readonly T[],
): Record<T, boolean> {
  return keys.reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<T, boolean>,
  );
}
