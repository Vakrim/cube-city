import { BlockType } from "../Block";
import { Game } from "../Game";
import { Position } from "../Position";
import { WorldMap } from "./WorldMap";

export class LoadBearing {
  worldMap: WorldMap;
  load: (number | null)[] = [];

  constructor(private game: Game) {
    this.worldMap = game.get(WorldMap);
  }

  calculateSupport(): void {
    this.load = Array<number | null>(this.worldMap.map.length).fill(null);

    const openSet = new Set<number>();

    for (let x = 0; x < this.worldMap.worldMapSize; x++) {
      for (let y = 0; y < this.worldMap.worldMapSize; y++) {
        for (let z = 0; z < this.worldMap.worldMapSize; z++) {
          if (this.worldMap.getBlock({ x, y, z })?.type === BlockType.Rock) {
            this.load[this.worldMap.getIndex({ x, y, z })] =
              blockMaxHorizontalLoadCapacity[BlockType.Rock];
            openSet.add(this.worldMap.getIndex({ x, y, z }));
          }
        }
      }
    }

    while (openSet.size > 0) {
      const blockIndex = openSet.values().next().value as number;
      openSet.delete(blockIndex);

      const p = this.worldMap.getPosition(blockIndex);

      this.passHorizontalLoadCapacity(
        { ...p, x: p.x - 1 },
        this.load[blockIndex]! - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, x: p.x + 1 },
        this.load[blockIndex]! - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, z: p.z - 1 },
        this.load[blockIndex]! - 1,
        openSet,
      );
      this.passHorizontalLoadCapacity(
        { ...p, z: p.z + 1 },
        this.load[blockIndex]! - 1,
        openSet,
      );
    }
  }

  passHorizontalLoadCapacity(
    p: Position,
    maxProvidedLoadCapacity: number,
    openSet: Set<number>,
  ): void {
    if (!this.worldMap.isInBounds(p)) {
      return;
    }

    const loadAtP = this.load[this.worldMap.getIndex(p)];

    // this block already can handle more load than we are providing
    if (loadAtP !== null && loadAtP >= maxProvidedLoadCapacity) {
      return;
    }

    const blockType = this.worldMap.getBlock(p)?.type;

    // there is no block here
    if (!blockType) {
      return;
    }

    const blockMaxLoad = blockMaxHorizontalLoadCapacity[blockType];

    this.load[this.worldMap.getIndex(p)] = Math.min(
      maxProvidedLoadCapacity,
      blockMaxLoad,
    );

    openSet.add(this.worldMap.getIndex(p));
  }
}

const blockMaxHorizontalLoadCapacity: Record<BlockType, number> = {
  [BlockType.Rock]: 100,
  [BlockType.WoodenSupport]: 2,
  [BlockType.House]: 0,
  [BlockType.Lumberjack]: 0,
  [BlockType.Sawmill]: 0,
};
