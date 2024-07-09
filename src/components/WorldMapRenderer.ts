import {
  BoxGeometry,
  BufferGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  Vector3,
} from "three";
import { Block, BlockType } from "../Block";
import { Position } from "../Position";
import { rockMaterial } from "../materials/rockMaterial";
import { Game, GameComponent } from "../Game";
import { World } from "./World";
import { woodMaterial } from "../materials/woodMaterial";

export class WorldMapRenderer implements GameComponent {
  private meshMap = new Map<Block, Mesh>();

  constructor(private game: Game) {}

  init() {}

  addBlock(position: Position, block: Block) {
    const mesh = this.createMesh(block);
    this.meshMap.set(block, mesh);

    mesh.position.add(new Vector3(position.x, position.y, position.z));

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
    return meshFactory[block.type](block);
  }

  getAllMeshes() {
    return Array.from(this.meshMap.values());
  }
}

const unitBoxGeometry = new BoxGeometry(1, 1, 1);

const meshFactory: Record<BlockType, (block: Block) => BlockMesh> = {
  [BlockType.Rock]: () => {
    const mesh = new Mesh(unitBoxGeometry, rockMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.WoodenSupport]: () => {
    const mesh = new Mesh(unitBoxGeometry, woodMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.House]: () => {
    const mesh = new Mesh(unitBoxGeometry, woodMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.Lumberjack]: () => {
    const mesh = new Mesh(unitBoxGeometry, woodMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.Sawmill]: () => {
    const mesh = new Mesh(unitBoxGeometry, woodMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
};

export type BlockMesh = Mesh<
  BufferGeometry,
  MeshBasicMaterial | MeshLambertMaterial
>;
