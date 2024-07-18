import { BoxGeometry, Mesh, Scene } from "three";
import { BlockType } from "../Block";
import { Game } from "../Game";
import { Position } from "../Position";
import { assertPresent } from "../helpers/assertPresent";
import { WorldMap } from "./WorldMap";
import { numberMaterials } from "../materials/numberMaterial";

export class LoadBearing {
  worldMap: WorldMap;
  load: (Load | null)[] = [];

  dirty: boolean = true;

  meshes: Mesh[] = [];

  constructor(private game: Game) {
    this.worldMap = game.get(WorldMap);
  }

  update(): void {
    if (this.dirty) {
      this.calculateSupport();
    }
  }

  updateMeshes(): void {
    const scene = this.game.get(Scene);

    for (const mesh of this.meshes) {
      scene.remove(mesh);
    }

    this.meshes = [];

    for (let x = 0; x < this.worldMap.worldMapSize; x++) {
      for (let y = 0; y < this.worldMap.worldMapSize; y++) {
        for (let z = 0; z < this.worldMap.worldMapSize; z++) {
          const load = this.getTotalLoadCapacity({ x, y, z });

          if (load === null) {
            continue;
          }

          const mesh = new Mesh(
            unitBoxGeometry,
            numberMaterials[Math.min(9, load)],
          );

          mesh.position.set(x, y, z);

          scene.add(mesh);
          this.meshes.push(mesh);
        }
      }
    }
  }

  calculateSupport(): void {
    this.load = Array<Load | null>(this.worldMap.map.length).fill(null);

    const openSet = new Set<number>();

    for (let x = 0; x < this.worldMap.worldMapSize; x++) {
      for (let z = 0; z < this.worldMap.worldMapSize; z++) {
        if (this.worldMap.getBlock({ x, y: 0, z })?.type !== BlockType.Rock) {
          continue;
        }

        this.load[this.worldMap.getIndex({ x, y: 0, z })] = {
          horizontal: 0,
          vertical: Infinity,
        };

        openSet.add(this.worldMap.getIndex({ x, y: 0, z }));
      }
    }

    for (const blockIndex of openSet) {
      openSet.delete(blockIndex);

      const p = this.worldMap.getPosition(blockIndex);

      const currentBlockLoad = this.load[blockIndex];

      assertPresent(currentBlockLoad);

      const currentBlockLoadSum =
        currentBlockLoad.horizontal + currentBlockLoad.vertical;

      this.passLoadCapacityUpward(
        {
          ...p,
          y: p.y + 1,
        },
        currentBlockLoadSum,
        openSet,
      );

      this.passHorizontalLoadCapacity(
        { ...p, x: p.x - 1 },
        currentBlockLoadSum - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, x: p.x + 1 },
        currentBlockLoadSum - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, z: p.z - 1 },
        currentBlockLoadSum - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, z: p.z + 1 },
        currentBlockLoadSum - 1,
        openSet,
      );
    }

    this.dirty = false;

    this.updateMeshes();
  }

  passHorizontalLoadCapacity(
    p: Position,
    maxProvidedLoadCapacity: number,
    openSet: Set<number>,
  ): void {
    if (!this.worldMap.isInBounds(p)) {
      return;
    }

    const block = this.worldMap.getBlock(p);

    if (!block) {
      return;
    }

    const blockMaxLoad = blockMaxHorizontalLoadCapacity[block.type];

    const newLoad = Math.min(maxProvidedLoadCapacity, blockMaxLoad);

    const currentLoad = this.load[this.worldMap.getIndex(p)];

    // this block already can handle more load than we are providing
    if (currentLoad !== null && currentLoad.horizontal >= newLoad) {
      return;
    }

    this.load[this.worldMap.getIndex(p)] ??= { horizontal: 0, vertical: 0 };
    this.load[this.worldMap.getIndex(p)]!.horizontal = newLoad;

    openSet.add(this.worldMap.getIndex(p));
  }

  passLoadCapacityUpward(
    p: Position,
    maxProvidedLoadCapacity: number,
    openSet: Set<number>,
  ): void {
    if (!this.worldMap.isInBounds(p)) {
      return;
    }

    const block = this.worldMap.getBlock(p);

    if (!block) {
      return;
    }

    const newLoad = maxProvidedLoadCapacity;

    const currentLoad = this.load[this.worldMap.getIndex(p)];

    // this block already can handle more load than we are providing
    if (currentLoad !== null && currentLoad.vertical >= newLoad) {
      return;
    }

    this.load[this.worldMap.getIndex(p)] ??= { horizontal: 0, vertical: 0 };
    this.load[this.worldMap.getIndex(p)]!.vertical = newLoad;

    openSet.add(this.worldMap.getIndex(p));
  }

  getLoadCapacity(p: Position): Load | null {
    return this.load[this.worldMap.getIndex(p)];
  }

  getTotalLoadCapacity(p: Position): number | null {
    const load = this.getLoadCapacity(p);
    if (!load) {
      return null;
    }
    return load.horizontal + load.vertical;
  }

  canBePlacedNextTo(p: Position): boolean {
    const totalCapacity = this.getTotalLoadCapacity(p);

    return totalCapacity !== null && totalCapacity >= 1;
  }

  canBlockBePlaced(p: Position, blockType: BlockType): boolean {
    if (!this.worldMap.isInBounds(p)) {
      return false;
    }

    if (this.getTotalLoadCapacity({ x: p.x, y: p.y - 1, z: p.z }) !== null) {
      return true;
    }

    if (
      blockMaxHorizontalLoadCapacity[blockType] > 0 &&
      (this.canBePlacedNextTo({ x: p.x - 1, y: p.y, z: p.z }) ||
        this.canBePlacedNextTo({ x: p.x + 1, y: p.y, z: p.z }) ||
        this.canBePlacedNextTo({ x: p.x, y: p.y, z: p.z - 1 }) ||
        this.canBePlacedNextTo({ x: p.x, y: p.y, z: p.z + 1 }))
    ) {
      return true;
    }

    return false;
  }
}

const unitBoxGeometry = new BoxGeometry(1.1, 1.1, 1.1);

const blockMaxHorizontalLoadCapacity: Record<BlockType, number> = {
  [BlockType.Rock]: 0,
  [BlockType.WoodenSupport]: 2,
  [BlockType.House]: 0,
  [BlockType.Lumberjack]: 0,
  [BlockType.Sawmill]: 0,
};

interface Load {
  horizontal: number;
  vertical: number;
}
