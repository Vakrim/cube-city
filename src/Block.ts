export enum BlockType {
  Rock,
  WoodenSupport,
  House,
  Lumberjack,
  Sawmill,
}

interface BaseBlock {
  type: BlockType;
}

interface RockBlock extends BaseBlock {
  type: BlockType.Rock;
}

interface WoodenSupportBlock extends BaseBlock {
  type: BlockType.WoodenSupport;
  variant: number;
}

interface HouseBlock extends BaseBlock {
  type: BlockType.House;
}

interface LumberjackBlock extends BaseBlock {
  type: BlockType.Lumberjack;
}

interface SawmillBlock extends BaseBlock {
  type: BlockType.Sawmill;
}

export type Block =
  | RockBlock
  | WoodenSupportBlock
  | HouseBlock
  | LumberjackBlock
  | SawmillBlock;
