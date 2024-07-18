export enum BlockType {
  Rock = 1,
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

export const blockNames: Record<BlockType, string> = {
  [BlockType.Rock]: "Rock",
  [BlockType.WoodenSupport]: "Wooden Support",
  [BlockType.House]: "House",
  [BlockType.Lumberjack]: "Lumberjack",
  [BlockType.Sawmill]: "Sawmill",
};
