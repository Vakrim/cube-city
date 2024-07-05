import { BoxGeometry, Material, Mesh, Scene } from "three";
import { Block, BlockType } from "./Block";
import { Position } from "./Position";
import { tileMaterial } from "./materials/tileMaterial";

export class WorldMapRenderer {
  boxGeometry = new BoxGeometry(1, 1, 1);

  private meshMap = new Map<Block, Mesh>();

  constructor(public scene: Scene) {}

  addBlock(position: Position, block: Block) {
    const mesh = this.createMesh(block);
    this.meshMap.set(block, mesh);

    mesh.position.set(position.x, position.y, position.z);

    this.scene.add(mesh);
  }

  removeBlock(block: Block) {
    const mesh = this.meshMap.get(block);

    if (mesh) {
      this.scene.remove(mesh);
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
  [BlockType.Rock]: tileMaterial,
  [BlockType.Road]: tileMaterial,
};
