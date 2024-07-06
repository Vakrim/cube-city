import { Block, BlockType } from "./Block";
import { Game, GameComponent } from "./Game";
import { Position } from "./Position";
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
      { type: BlockType.Rock }
    );
    this.setBlock(
      { x: 0, y: 0, z: WORLD_MAP_SIZE - 1 },
      { type: BlockType.Rock }
    );
    this.setBlock(
      { x: WORLD_MAP_SIZE - 1, y: 0, z: WORLD_MAP_SIZE - 1 },
      { type: BlockType.Rock }
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

    return { x, y, z };
  }
}
