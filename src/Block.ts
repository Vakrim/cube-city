enum BlockType {
  Rock,
  Road,
}

interface RockBlock {
  type: BlockType.Rock;
}

interface RoadBlock {
  type: BlockType.Road;
  variant: number;
}

export type Block = RockBlock | RoadBlock;
