import { Mesh, Scene } from "three";
import { BlockType } from "../Block";
import { BlockMesh, WorldMapRenderer } from "./WorldMapRenderer";
import { Controls } from "./Controls";
import { Game } from "../Game";
import { WorldMap } from "./WorldMap";
import { Construction } from "./Construction";
import { Reactive, reactive } from "../helpers/reactive";
import { LoadBearing } from "./LoadBearing";
import { errorGhostMaterial, ghostMaterial } from "../materials/ghostMaterial";

export class Placing {
  helperBox: Reactive<BlockMesh, Parameters<typeof this.createHelperBlock>> =
    reactive(
      (...params) => this.createHelperBlock(...params),
      (result) => this.scene.add(result),
      (result) => this.scene.remove(result),
    );
  private worldMapRenderer: WorldMapRenderer;
  private controls: Controls;
  private scene: Scene;
  private worldMap: WorldMap;

  constructor(private game: Game) {
    this.worldMap = game.get(WorldMap);
    this.worldMapRenderer = game.get(WorldMapRenderer);
    this.controls = game.get(Controls);
    this.scene = game.get(Scene);
  }

  init() {}

  createHelperBlock(blockType: BlockType, valid: boolean) {
    const sampleBlock = this.game.get(Construction).getSampleBlock(blockType);

    const helperBox = this.worldMapRenderer.createMesh(sampleBlock);

    if (helperBox.children.length > 0) {
      helperBox.children.forEach((child) => {
        if (child instanceof Mesh) {
          child.material = valid ? ghostMaterial : errorGhostMaterial;
        }
      });
    } else {
      helperBox.material = valid ? ghostMaterial : errorGhostMaterial;
    }

    helperBox.castShadow = false;
    helperBox.receiveShadow = true;

    return helperBox;
  }

  update() {
    const placingPosition = this.getPlacingPosition();
    const activeBlockType = this.game.get(Construction).activeBlockType;
    const canBePlaced =
      placingPosition !== null &&
      this.game
        .get(LoadBearing)
        .canBlockBePlaced(placingPosition, activeBlockType);

    if (placingPosition) {
      const helperBox = this.helperBox(activeBlockType, canBePlaced);
      helperBox.position.copy(placingPosition);
    } else {
      this.helperBox.destroy();
    }

    if (canBePlaced && this.controls.keyPressedThisFrame.leftMouseButton) {
      const blockToBePlaced = this.game
        .get(Construction)
        .getSampleBlock(activeBlockType);

      this.worldMap.setBlock(placingPosition, blockToBePlaced);
    }
  }

  private getPlacingPosition() {
    const intersects = this.controls.getIntersect(
      this.worldMapRenderer.getAllMeshes(),
    );

    if (intersects.length > 0) {
      const intersect = intersects[0];

      if (intersect.face) {
        return intersect.point
          .clone()
          .add(intersect.face.normal.clone().multiplyScalar(0.5))
          .round();
      }
    }

    return null;
  }
}
