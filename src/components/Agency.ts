import { ArrowHelper, Scene, Vector3 } from "three";
import { BlockType } from "../Block";
import { Game, GameComponent } from "../Game";
import { Position } from "../Position";
import { WorldMap } from "./WorldMap";

export class Agency implements GameComponent {
  actors: Actor[] = [];
  nextActorId = 0;

  constructor(private game: Game) {}

  update() {
    const houses = this.game
      .get(WorldMap)
      .filterBlock(BlockType.House, (house) => house.occupantIds.length === 0);

    houses.forEach((house) => {
      const emptySpace = findEmptySpaceAround(
        this.game.get(WorldMap),
        house.position,
      );

      if (!emptySpace) {
        return;
      }

      const actor = this.createActor(emptySpace);
      house.block.occupantIds.push(actor.id);
    });
  }

  createActor(position: Position) {
    const actor: Actor = {
      id: this.nextActorId++,
      position: new Vector3(position.x, position.y, position.z),
    };

    this.actors.push(actor);

    console.log("Actor created", actor);

    const arrowHelper = new ArrowHelper(
      new Vector3(0, 1, 0),
      actor.position,
      1,
      0xffff00,
    );

    this.game.get(Scene).add(arrowHelper);

    return actor;
  }
}

interface Actor {
  id: number;
  position: Vector3;
}

const adjacent = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function findEmptySpaceAround(map: WorldMap, position: Position) {
  for (const [dx, dz] of adjacent) {
    const p = {
      x: position.x + dx,
      y: position.y,
      z: position.z + dz,
    };

    if (
      map.getBlock(p) === null &&
      map.getBlock({ ...p, y: p.y - 1 }) !== null
    ) {
      return p;
    }
  }

  return null;
}
