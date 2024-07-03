export enum BlockType {
  Rock,
  Road,
}

interface BaseBlock {
  type: BlockType;
}

interface RockBlock extends BaseBlock {
  type: BlockType.Rock;
}

interface RoadBlock extends BaseBlock {
  type: BlockType.Road;
  variant: number;
}

export type Block = RockBlock | RoadBlock;
