import { BlockType } from "../Block";
import { Game } from "../Game";
import { WorldMap } from "./WorldMap";

export class LoadBearing {
  worldMap: WorldMap;
  load: number[] = [];

  constructor(private game: Game) {
    this.worldMap = game.getComponent(WorldMap);
  }

  calculateSupport(): void {
    this.load = Array(this.worldMap.map.length).fill(0);

    for (let i = 0; i < this.worldMap.map.length; i++) {
      if (this.worldMap.map[i]) {
        this.load[i] = 1;
      }
    }
  }
}

const blockLoadCapacity: Record<BlockType, number> = {
  [BlockType.Rock]: 100,
  [BlockType.WoodenSupport]: 2,
  [BlockType.House]: 0,
  [BlockType.Lumberjack]: 0,
  [BlockType.Sawmill]: 0,
};
