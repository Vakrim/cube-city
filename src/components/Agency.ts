import { Block, BlockType } from "../Block";
import { Game, GameComponent } from "../Game";
import { Position } from "../Position";
import { WorldMap } from "./WorldMap";
import { Actor } from "../Actor";

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

    this.actors.forEach((actor) => actor.update());
  }

  deleteActor(actor: Actor) {
    const index = this.actors.indexOf(actor);

    if (index === -1) {
      throw new Error("Actor not found");
    }

    this.actors.splice(index, 1);
    actor.dispose();
  }

  createActor(position: Position) {
    const actor = new Actor(this.nextActorId++, this.game);
    actor.position.set(position.x, position.y, position.z);

    this.actors.push(actor);

    return actor;
  }

  onBlockRemoved(block: Block) {
    if (block.type === BlockType.House) {
      block.occupantIds.forEach((id) => {
        const actor = this.actors.find((actor) => actor.id === id);

        if (!actor) {
          throw new Error("Actor not found");
        }

        this.deleteActor(actor);
      });
    }
  }
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
