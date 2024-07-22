export enum BlockType {
  Rock = 1,
  WoodenSupport,
  WoodenStairs,
  House,
  Lumberjack,
  Sawmill,
}

export enum Orientation {
  PositiveX = 1,
  PositiveZ,
  NegativeX,
  NegativeZ,
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

interface WoodenStairsBlock extends BaseBlock {
  type: BlockType.WoodenStairs;
  orientation: Orientation;
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
  | WoodenStairsBlock
  | HouseBlock
  | LumberjackBlock
  | SawmillBlock;

export const blockNames: Record<BlockType, string> = {
  [BlockType.Rock]: "Rock",
  [BlockType.WoodenSupport]: "Wooden Support",
  [BlockType.WoodenStairs]: "Wooden Stairs",
  [BlockType.House]: "House",
  [BlockType.Lumberjack]: "Lumberjack",
  [BlockType.Sawmill]: "Sawmill",
};
