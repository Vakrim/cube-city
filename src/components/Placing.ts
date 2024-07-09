import { Scene } from "three";
import { BlockType } from "../Block";
import { BlockMesh, WorldMapRenderer } from "./WorldMapRenderer";
import { Controls } from "./Controls";
import { Game } from "../Game";
import { WorldMap } from "./WorldMap";

export class Placing {
  helperBox: BlockMesh | null = null;
  private worldMapRenderer: WorldMapRenderer;
  private controls: Controls;
  private scene: Scene;
  private worldMap: WorldMap;

  constructor(game: Game) {
    this.worldMap = game.getComponent(WorldMap);
    this.worldMapRenderer = game.getComponent(WorldMapRenderer);
    this.controls = game.getComponent(Controls);
    this.scene = game.getComponent(Scene);
  }

  init() {}

  createHelperBlock() {
    const helperBox = this.worldMapRenderer.createMesh({
      type: BlockType.WoodenSupport,
      variant: 0,
    });
    helperBox.material = helperBox.material.clone();

    helperBox.material.opacity = 0.5;
    helperBox.material.color.set(0x75e6da);

    helperBox.castShadow = false;
    helperBox.receiveShadow = false;

    this.scene.add(helperBox);

    return helperBox;
  }

  update(dt: number) {
    const intersects = this.controls.getIntersect(
      this.worldMapRenderer.getAllMeshes()
    );

    if (intersects.length > 0) {
      this.helperBox ??= this.createHelperBlock();

      const intersect = intersects[0];

      if (intersect.face) {
        this.helperBox.position
          .copy(intersect.point)
          .add(intersect.face.normal.clone().multiplyScalar(0.5))
          .round();

        if (this.controls.keyPressedThisFrame.leftMouseButton) {
          this.worldMap.setBlock(this.helperBox.position, {
            type: BlockType.WoodenSupport,
            variant: 0,
          });
        }
      }
    } else {
      if (this.helperBox) {
        this.scene.remove(this.helperBox);
        this.helperBox = null;
      }
    }
  }
}
