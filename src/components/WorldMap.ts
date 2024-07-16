import { Vector3 } from "three";
import { Block, BlockType } from "../Block";
import { database } from "../Database";
import { Game, GameComponent } from "../Game";
import { Position } from "../Position";
import { WorldMapRenderer } from "./WorldMapRenderer";

export const WORLD_MAP_SIZE = 64;

export class WorldMap implements GameComponent {
  map: (Block | null)[] = Array(WORLD_MAP_SIZE ** 3).fill(null);
  render: WorldMapRenderer;

  constructor(game: Game) {
    this.render = game.getComponent(WorldMapRenderer);
  }

  init() {
    this.setBlock({ x: 0, y: 0, z: 0 }, { type: BlockType.Rock });
    this.setBlock(
      { x: WORLD_MAP_SIZE - 1, y: 0, z: 0 },
      { type: BlockType.Rock },
    );
    this.setBlock(
      { x: 0, y: 0, z: WORLD_MAP_SIZE - 1 },
      { type: BlockType.Rock },
    );
    this.setBlock(
      { x: WORLD_MAP_SIZE - 1, y: 0, z: WORLD_MAP_SIZE - 1 },
      { type: BlockType.Rock },
    );
  }

  setBlock(position: Position, block: Block) {
    const index = this.getIndex(position);

    const existingBlock = this.map[index];

    if (existingBlock) {
      this.render.removeBlock(existingBlock);
    }

    this.map[index] = block;
    this.render.addBlock(position, block);
  }

  setBlockByIndex(index: number, block: Block) {
    const position = this.getPosition(index);
    this.setBlock(position, block);
  }

  getBlock(position: Position) {
    const index = this.getIndex(position);
    return this.map[index];
  }

  deleteBlock(position: Position) {
    const index = this.getIndex(position);

    const block = this.map[index];

    if (block) {
      this.render.removeBlock(block);
      this.map[index] = null;
    }
  }

  private getIndex(position: Position) {
    return (
      position.x +
      position.y * WORLD_MAP_SIZE +
      position.z * WORLD_MAP_SIZE ** 2
    );
  }

  private getPosition(index: number) {
    const x = index % WORLD_MAP_SIZE;
    const y = Math.floor(index / WORLD_MAP_SIZE) % WORLD_MAP_SIZE;
    const z = Math.floor(index / WORLD_MAP_SIZE ** 2);

    return new Vector3(x, y, z);
  }

  async save() {
    await database.setItem("worldMap", this.map);
  }

  clear() {
    this.map.forEach((block) => {
      if (block) {
        this.render.removeBlock(block);
      }
    });

    this.map.fill(null);
  }

  async load() {
    const map = await database.getItem<(Block | null)[]>("worldMap");

    if (!map) {
      return;
    }

    this.clear();

    map.forEach((block, index) => {
      if (block) {
        this.setBlock(this.getPosition(index), block);
      }
    });
  }

  async loadBonkers() {
    const map = await database.getItem<(Block | null)[]>("worldMap");
    if (!map) {
      return;
    }

    this.clear();

    const bonkers: {
      block: Block;
      position: Vector3;
    }[] = [];

    map.forEach((block, index) => {
      if (block) {
        bonkers.push({ block, position: this.getPosition(index) });
      }
    });

    bonkers.sort(
      (a, b) =>
        a.position.x +
        a.position.y +
        a.position.z -
        (b.position.x + b.position.y + b.position.z),
    );

    for (const { block, position } of bonkers) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      this.setBlock(position, block);
    }
  }
}
