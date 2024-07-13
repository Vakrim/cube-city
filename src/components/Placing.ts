import { Scene } from "three";
import { BlockType } from "../Block";
import { BlockMesh, WorldMapRenderer } from "./WorldMapRenderer";
import { Controls } from "./Controls";
import { Game } from "../Game";
import { WorldMap } from "./WorldMap";
import { Construction } from "./Construction";
import { Reactive, reactive } from "../helpers/reactive";

export class Placing {
  helperBox: Reactive<BlockMesh, Parameters<typeof this.createHelperBlock>> =
    reactive(
      (params) => this.createHelperBlock(params),
      (result) => this.scene.add(result),
      (result) => this.scene.remove(result)
    );
  private worldMapRenderer: WorldMapRenderer;
  private controls: Controls;
  private scene: Scene;
  private worldMap: WorldMap;

  constructor(private game: Game) {
    this.worldMap = game.getComponent(WorldMap);
    this.worldMapRenderer = game.getComponent(WorldMapRenderer);
    this.controls = game.getComponent(Controls);
    this.scene = game.getComponent(Scene);
  }

  init() {}

  createHelperBlock(blockType: BlockType) {
    const sampleBlock = this.game
      .getComponent(Construction)
      .getSampleBlock(blockType);

    const helperBox = this.worldMapRenderer.createMesh(sampleBlock);
    helperBox.material = helperBox.material.clone();

    helperBox.material.opacity = 0.5;
    helperBox.material.transparent = true;

    helperBox.castShadow = false;
    helperBox.receiveShadow = false;

    return helperBox;
  }

  update(dt: number) {
    const intersects = this.controls.getIntersect(
      this.worldMapRenderer.getAllMeshes()
    );

    if (intersects.length > 0) {
      const helperBox = this.helperBox(
        this.game.getComponent(Construction).activeBlockType
      );

      const intersect = intersects[0];

      if (intersect.face) {
        helperBox.position
          .copy(intersect.point)
          .add(intersect.face.normal.clone().multiplyScalar(0.5))
          .round();

        const sampleBlock = this.game
          .getComponent(Construction)
          .getSampleBlock(this.game.getComponent(Construction).activeBlockType);

        if (this.controls.keyPressedThisFrame.leftMouseButton) {
          this.worldMap.setBlock(helperBox.position, sampleBlock);
        }
      }
    } else {
      this.helperBox.destroy();
    }
  }
}
