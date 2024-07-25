export enum BlockType {
  Rock = 0,
  WoodenSupport,
  WoodenStairs,
  House,
  Lumberjack,
  Sawmill,
}

export enum Orientation {
  PositiveX = 0,
  NegativeZ,
  NegativeX,
  PositiveZ,
}

interface BaseBlock {
  type: BlockType;
}

export interface RockBlock extends BaseBlock {
  type: BlockType.Rock;
}

export interface WoodenSupportBlock extends BaseBlock {
  type: BlockType.WoodenSupport;
}

export interface WoodenStairsBlock extends BaseBlock {
  type: BlockType.WoodenStairs;
  orientation: Orientation;
}

export interface HouseBlock extends BaseBlock {
  type: BlockType.House;
  occupantIds: number[];
}

export interface LumberjackBlock extends BaseBlock {
  type: BlockType.Lumberjack;
}

export interface SawmillBlock extends BaseBlock {
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

export type BlockOfType<T extends BlockType> = Extract<Block, { type: T }>;
