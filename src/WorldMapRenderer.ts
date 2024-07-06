import { BoxGeometry, Material, Mesh } from "three";
import { Block, BlockType } from "./Block";
import { Position } from "./Position";
import { rockMaterial } from "./materials/rockMaterial";
import { Game, GameComponent } from "./Game";
import { World } from "./World";

export class WorldMapRenderer implements GameComponent {
  boxGeometry = new BoxGeometry(1, 1, 1);

  private meshMap = new Map<Block, Mesh>();

  constructor(private game: Game) {}

  init() {}

  addBlock(position: Position, block: Block) {
    const mesh = this.createMesh(block);
    this.meshMap.set(block, mesh);

    mesh.position.set(position.x, position.y, position.z);

    this.game.getComponent(World).scene.add(mesh);
  }

  removeBlock(block: Block) {
    const mesh = this.meshMap.get(block);

    if (mesh) {
      this.game.getComponent(World).scene.remove(mesh);
      this.meshMap.delete(block);
    }
  }

  createMesh(block: Block) {
    const material = materials[block.type];

    const mesh = new Mesh(this.boxGeometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  getAllMeshes() {
    return Array.from(this.meshMap.values());
  }
}

const materials: Record<BlockType, Material> = {
  [BlockType.Rock]: rockMaterial,
  [BlockType.Road]: rockMaterial,
};
