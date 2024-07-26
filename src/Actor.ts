import { ArrowHelper, Scene, Vector3 } from "three";
import { Game } from "./Game";
import { WorldMap } from "./components/WorldMap";
import { Block, BlockType, Orientation } from "./Block";

export class Actor {
  position = new Vector3();

  mesh: ArrowHelper;
  accessiblePlacesMeshes: ArrowHelper[] = [];

  constructor(
    public id: number,
    private game: Game,
  ) {
    this.mesh = new ArrowHelper(
      new Vector3(0, 1, 0),
      this.position,
      1,
      0xffff00,
    );
    this.game.get(Scene).add(this.mesh);
  }

  update() {
    this.mesh.position.copy(this.position);
    this.drawAccessiblePlaces();
  }

  dispose() {
    this.game.get(Scene).remove(this.mesh);
    this.accessiblePlacesMeshes.forEach((mesh) => {
      this.game.get(Scene).remove(mesh);
    });
  }

  drawAccessiblePlaces() {
    if (this.accessiblePlacesMeshes.length > 0) {
      return;
    }

    const map = this.game.get(WorldMap);

    const toExplore: Vector3[] = [this.position];
    const visited: Vector3[] = [];
    const from = new Map<Vector3, Vector3>();

    while (toExplore.length > 0) {
      const current = toExplore.shift()!;

      const neighbors = [
        new Vector3(current.x + 1, current.y, current.z),
        new Vector3(current.x - 1, current.y, current.z),
        new Vector3(current.x, current.y, current.z + 1),
        new Vector3(current.x, current.y, current.z - 1),
      ];

      neighbors.forEach((neighbor) => {
        if (
          !visited.some((v) => v.equals(neighbor)) &&
          !toExplore.some((v) => v.equals(neighbor)) &&
          isPositionTraversableHorizontally(map, neighbor)
        ) {
          toExplore.push(neighbor);
          from.set(neighbor, current);
        }
      });

      const stairsNeighbors = [
        new Vector3(current.x + 1, current.y + 1, current.z),
        new Vector3(current.x - 1, current.y + 1, current.z),
        new Vector3(current.x, current.y + 1, current.z + 1),
        new Vector3(current.x, current.y + 1, current.z - 1),
        new Vector3(current.x + 1, current.y - 1, current.z),
        new Vector3(current.x - 1, current.y - 1, current.z),
        new Vector3(current.x, current.y - 1, current.z + 1),
        new Vector3(current.x, current.y - 1, current.z - 1),
      ];

      stairsNeighbors.forEach((neighbor) => {
        if (
          !visited.some((v) => v.equals(neighbor)) &&
          !toExplore.some((v) => v.equals(neighbor)) &&
          isPositionTraversableByStairs(map, neighbor, current)
        ) {
          toExplore.push(neighbor);
          from.set(neighbor, current);
        }
      });

      visited.push(current);
    }

    for (const [position, fromPosition] of from) {
      const direction = position.clone().sub(fromPosition).normalize();
      const arrow = new ArrowHelper(
        direction,
        position.clone().sub(direction),
        1,
        0x00ff00,
      );
      this.accessiblePlacesMeshes.push(arrow);
      this.game.get(Scene).add(arrow);
    }
  }
}

function isPositionTraversableByStairs(
  map: WorldMap,
  position: Vector3,
  from: Vector3,
) {
  if (
    !map.isInBounds(position) ||
    !canStandWithinBlock(map.getBlock(position))
  ) {
    return false;
  }

  const block = map.getBlock(
    new Vector3(position.x, position.y - 1, position.z),
  );

  if (block?.type !== BlockType.WoodenStairs) {
    return false;
  }

  const directionX = position.x - from.x;
  const directionZ = position.z - from.z;

  return (
    (directionX === 1 &&
      directionZ === 0 &&
      block.orientation === Orientation.PositiveX) ||
    (directionX === -1 &&
      directionZ === 0 &&
      block.orientation === Orientation.NegativeX) ||
    (directionX === 0 &&
      directionZ === 1 &&
      block.orientation === Orientation.PositiveZ) ||
    (directionX === 0 &&
      directionZ === -1 &&
      block.orientation === Orientation.NegativeZ)
  );
}

function isPositionTraversableHorizontally(map: WorldMap, position: Vector3) {
  return (
    map.isInBounds(position) &&
    canStandWithinBlock(map.getBlock(position)) &&
    canStandOnBlock(
      map.getBlock(new Vector3(position.x, position.y - 1, position.z)),
    )
  );
}

function canStandOnBlock(block: Block | null) {
  return (
    block !== null
    //&&
    // (block.type === BlockType.Rock ||
    //   block.type === BlockType.WoodenSupport ||
    //   block.type === BlockType.House ||
    //   block.type === BlockType.Lumberjack ||
    //   block.type === BlockType.Sawmill)
  );
}

function canStandWithinBlock(block: Block | null) {
  return block === null || block.type === BlockType.WoodenSupport;
}
