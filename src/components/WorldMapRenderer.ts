import { BoxGeometry, BufferGeometry, Material, Mesh, Vector3 } from "three";
import { Block, BlockType } from "../Block";
import { Position } from "../Position";
import { rockMaterial } from "../materials/rockMaterial";
import { Game, GameComponent } from "../Game";
import { World } from "./World";
import { woodMaterial } from "../materials/woodMaterial";
import { AssetsPack } from "../AssetsPack";
import { invisibleMaterial } from "../materials/invisibleMaterial";

export class WorldMapRenderer implements GameComponent {
  private meshMap = new Map<Block, Mesh>();

  constructor(private game: Game) {}

  init() {}

  addBlock(position: Position, block: Block) {
    const mesh = this.createMesh(block);
    this.meshMap.set(block, mesh);

    mesh.position.add(new Vector3(position.x, position.y, position.z));

    this.game.get(World).scene.add(mesh);
  }

  removeBlock(block: Block) {
    const mesh = this.meshMap.get(block);

    if (mesh) {
      this.game.get(World).scene.remove(mesh);
      this.meshMap.delete(block);
    }
  }

  createMesh(block: Block) {
    return meshFactory[block.type](block, this.game.get(AssetsPack));
  }

  getAllMeshes() {
    return Array.from(this.meshMap.values());
  }
}

const unitBoxGeometry = new BoxGeometry(1, 1, 1);

const meshFactory: Record<
  BlockType,
  (block: Block, assetPack: AssetsPack) => BlockMesh
> = {
  [BlockType.Rock]: () => {
    const mesh = new Mesh(unitBoxGeometry, rockMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.WoodenSupport]: (block, assetsPack) => {
    const model = new Mesh(
      assetsPack.models.woodenSupport.geometry,
      assetsPack.models.woodenSupport.material,
    );
    model.scale.set(10 / 16, 10 / 16, 10 / 16);

    model.castShadow = true;
    model.receiveShadow = true;

    const mesh = new Mesh(unitBoxGeometry, invisibleMaterial);

    mesh.add(model);

    return mesh;
  },
  [BlockType.House]: () => {
    const mesh = new Mesh(unitBoxGeometry, houseMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  },
  [BlockType.Lumberjack]: () => {
    const mesh = new Mesh(unitBoxGeometry, LumberjackMaterial);
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

const houseMaterial = woodMaterial.clone();
houseMaterial.color.set(0xe06666);

const LumberjackMaterial = woodMaterial.clone();
LumberjackMaterial.color.set(0xbf9000);

export type BlockMesh = Mesh<BufferGeometry, Material | Material[]>;
