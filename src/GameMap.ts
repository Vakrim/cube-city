import { Block } from "./Block";

const MAP_SIZE = 128;

export class GameMap {
  blocks: PositionedBlock[] = [];
  map: (Block | null)[] = Array(MAP_SIZE ** 3).fill(null);

  setBlock(position: Position, block: Block) {
    const index = this.getIndex(position);
    this.map[index] = block;
    this.blocks.push({ position, block });
  }

  getBlock(position: Position) {
    const index = this.getIndex(position);
    return this.map[index];
  }

  private getIndex(position: Position) {
    return position.x + position.y * MAP_SIZE + position.z * MAP_SIZE ** 2;
  }
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface PositionedBlock {
  position: Position;
  block: Block;
}
